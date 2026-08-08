import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

type MatrixRainProps = {
  active: boolean;
  onClose: () => void;
};

export function MatrixRain({ active, onClose }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF";
    const charArray = chars.split("");
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    let animationId: number;
    const startTime = Date.now();
    const DURATION = 5000; // 5 seconds

    const draw = () => {
      // Fade out near the end
      const elapsed = Date.now() - startTime;
      const fadeStart = DURATION - 500;
      const alpha = elapsed > fadeStart ? 1 - (elapsed - fadeStart) / 500 : 1;

      ctx.fillStyle = `rgba(6, 10, 16, ${0.1 * alpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = charArray[Math.floor(Math.random() * charArray.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Green with varying opacity
        const opacity = Math.random() * 0.5 + 0.5;
        ctx.fillStyle = `rgba(34, 211, 238, ${opacity * alpha})`;
        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      if (elapsed < DURATION) {
        animationId = requestAnimationFrame(draw);
      } else {
        onClose();
      }
    };

    animationId = requestAnimationFrame(draw);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        cancelAnimationFrame(animationId);
        onClose();
      }
    };

    const handleClick = () => {
      cancelAnimationFrame(animationId);
      onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("click", handleClick);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("click", handleClick);
    };
  }, [active, onClose]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[10000] pointer-events-auto"
          style={{ background: "rgba(6, 10, 16, 0.9)" }}
        >
          <canvas ref={canvasRef} className="w-full h-full" style={{ display: "block" }} />
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs text-[#22D3EE] opacity-70">
            ESC o click para salir
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
