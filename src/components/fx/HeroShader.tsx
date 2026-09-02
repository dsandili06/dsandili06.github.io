import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle, Vec2 } from "ogl";

const VERT = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = /* glsl */ `
precision highp float;
uniform float uTime;
uniform vec2 uRes;
uniform vec2 uMouse;
varying vec2 vUv;

// 2D simplex noise (Ashima)
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = vUv;
  float aspect = uRes.x / max(uRes.y, 1.0);
  vec2 p = uv * vec2(aspect, 1.0);
  float t = uTime * 0.07;

  float n1 = snoise(p * 1.4 + vec2(t, -t * 0.7));
  float n2 = snoise(p * 2.6 - vec2(t * 0.6, t * 0.4));
  float flow = n1 * 0.65 + n2 * 0.35;

  vec2 m = uMouse * vec2(aspect, 1.0);
  float md = length(p - m);
  float mouseGlow = smoothstep(0.55, 0.0, md);

  float intensity = smoothstep(-0.4, 0.9, flow) * 0.16 + mouseGlow * 0.10;

  vec3 bg = vec3(0.024, 0.039, 0.063);        // #060A10
  vec3 accent = vec3(0.231, 0.510, 0.965);    // #3B82F6
  vec3 col = bg + accent * intensity;

  // Fade toward edges so section borders stay clean
  float vig = smoothstep(1.15, 0.3, length(uv - vec2(0.5, 0.5)));
  col = mix(bg, col, clamp(vig + 0.3, 0.0, 1.0));

  gl_FragColor = vec4(col, 1.0);
}
`;

/**
 * WebGL fluid-gradient backdrop for the Hero (OGL).
 * Subtle simplex-noise flow in the accent color over the page background,
 * with a gentle glow that follows the pointer.
 * Reduced motion -> renders a single static frame (no animation loop).
 */
export function HeroShader() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let alive = true;
    let rafId = 0;
    let visible = true; // tracks whether the hero is in the viewport

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        canvas,
        alpha: false,
        antialias: false,
        dpr: Math.min(window.devicePixelRatio || 1, 1.5),
      });
    } catch {
      return; // WebGL unavailable — graceful no-op
    }
    const gl = renderer.gl;
    gl.clearColor(0.024, 0.039, 0.063, 1);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uRes: { value: new Vec2(1, 1) },
        uMouse: { value: new Vec2(0.5, 0.4) },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });

    const mouseTarget = { x: 0.5, y: 0.4 };

    const setSize = () => {
      const { width, height } = wrapper.getBoundingClientRect();
      if (width === 0 || height === 0) return false;
      renderer.setSize(width, height);
      program.uniforms.uRes.value.set(gl.canvas.width, gl.canvas.height);
      return true;
    };

    const onMouse = (e: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect();
      mouseTarget.x = (e.clientX - rect.left) / Math.max(rect.width, 1);
      mouseTarget.y = 1 - (e.clientY - rect.top) / Math.max(rect.height, 1);
    };

    const frame = (time: number) => {
      if (!alive) return;
      if (!visible) {
        rafId = requestAnimationFrame(frame);
        return; // pause rendering when hero is out of viewport
      }
      program.uniforms.uTime.value = time * 0.001;
      // Lerp mouse for smooth trailing
      const u = program.uniforms.uMouse.value as Vec2;
      u.x += (mouseTarget.x - u.x) * 0.05;
      u.y += (mouseTarget.y - u.y) * 0.05;
      renderer.render({ scene: mesh });
      if (!reduced) rafId = requestAnimationFrame(frame);
    };

    const start = () => {
      if (!setSize()) return;
      renderer.render({ scene: mesh }); // first frame (also covers reduced-motion)
      if (!reduced) rafId = requestAnimationFrame(frame);
    };
    const rafStart = requestAnimationFrame(() => {
      if (alive) start();
    });

    const ro = new ResizeObserver(() => {
      if (!alive) return;
      setSize();
      renderer.render({ scene: mesh });
    });
    ro.observe(wrapper);

    // Pause rAF when hero is out of viewport (perf on mobile/long pages)
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(wrapper);

    // Handle WebGL context loss — pause rendering silently
    const onContextLost = (e: Event) => {
      e.preventDefault();
      alive = false;
      cancelAnimationFrame(rafId);
      console.warn("[HeroShader] WebGL context lost");
    };
    const onContextRestored = () => {
      alive = true;
      if (!reduced) rafId = requestAnimationFrame(frame);
      console.warn("[HeroShader] WebGL context restored");
    };
    canvas.addEventListener("webglcontextlost", onContextLost);
    canvas.addEventListener("webglcontextrestored", onContextRestored);

    if (!reduced) {
      window.addEventListener("mousemove", onMouse, { passive: true });
    }

    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(rafStart);
      ro.disconnect();
      io.disconnect();
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      if (!reduced) window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="absolute inset-0 -z-30" aria-hidden>
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
