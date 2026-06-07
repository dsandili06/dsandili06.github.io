import { motion } from "motion/react";

function Paths({ position }: { position: number }) {
  const paths = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.8 + i * 0.04,
  }));

  return (
    <svg
      className="w-full h-full"
      viewBox="-200 -200 1200 800"
      fill="none"
      preserveAspectRatio="xMidYMid slice"
    >
      <title>Background Paths</title>
      {paths.map((path) => (
        <motion.path
          key={path.id}
          d={path.d}
          stroke="rgba(59,130,246,1)"
          strokeWidth={path.width}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: [0, 1],
            opacity: [0, 0.15 + path.id * 0.005, 0],
          }}
          transition={{
            duration: 12 + path.id * 0.8,
            repeat: Infinity,
            ease: "linear",
            delay: path.id * 0.3,
          }}
        />
      ))}
    </svg>
  );
}

export function BackgroundPaths() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <Paths position={1} />
      <Paths position={-1} />
    </div>
  );
}
