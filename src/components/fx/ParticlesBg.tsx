import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

interface ParticlesBgProps {
  count?: number;
  connectionDistance?: number;
  particleColor?: string;
  lineColor?: string;
  maxOpacity?: number;
  maxLineOpacity?: number;
  speed?: number;
}

export function ParticlesBg({
  count = 90,
  connectionDistance = 130,
  particleColor = "59,130,246",
  lineColor = "59,130,246",
  maxOpacity = 0.25,
  maxLineOpacity = 0.08,
  speed = 0.25,
}: ParticlesBgProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setSize = () => {
      const { width, height } = wrapper.getBoundingClientRect();
      if (width === 0 || height === 0) return false;
      canvas.width = width;
      canvas.height = height;
      return true;
    };

    const initParticles = () => {
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * maxOpacity + 0.05,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const pts = particlesRef.current;

      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleColor},${p.opacity})`;
        ctx.fill();
      }

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * maxLineOpacity;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(${lineColor},${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };

    // defer one frame so the parent has layout
    const rafId = requestAnimationFrame(() => {
      if (setSize()) {
        initParticles();
        draw();
      }
    });

    const ro = new ResizeObserver(() => {
      if (setSize()) {
        initParticles();
      }
    });
    ro.observe(wrapper);

    return () => {
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(animRef.current);
      ro.disconnect();
    };
  }, [count, connectionDistance, particleColor, lineColor, maxOpacity, maxLineOpacity, speed]);

  return (
    <div ref={wrapperRef} className="absolute inset-0 w-full h-full">
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}
