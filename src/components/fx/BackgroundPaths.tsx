import { motion } from "motion/react";

function Paths({ position, flip }: { position: number; flip?: boolean }) {
  const paths = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 1 + i * 0.05,
    opacity: 0.06 + i * 0.005,
  }));

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="-200 -200 1200 800"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <title>Background Paths</title>
      {paths.map((path) => (
        <motion.path
          key={path.id}
          d={path.d}
          stroke="var(--accent)"
          strokeWidth={path.width}
          strokeOpacity={path.opacity}
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{
            pathLength: {
              duration: 10 + path.id * 0.6,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
              delay: path.id * 0.25,
              repeatDelay: 2,
            },
            opacity: {
              duration: 1.5,
              delay: path.id * 0.25,
            },
          }}
        />
      ))}
    </svg>
  );
}

export function BackgroundPaths() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <Paths position={1} />
      <Paths position={1} flip />
    </div>
  );
}
