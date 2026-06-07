import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export type OrbitalNode = {
  id: string;
  code: string;
  title: string;
  items: string[];
};

/**
 * RadialOrbital
 * 4 categorías orbitando un centro. Click expande la card lateral con sus items.
 * Paleta flat: #E8A230 nodos, #4DFFB4 nodo activo, líneas rgba(255,255,255,0.08).
 */
export function RadialOrbital({ nodes }: { nodes: OrbitalNode[] }) {
  const [activeId, setActiveId] = useState<string>(nodes[0]?.id ?? "");
  const [rotation, setRotation] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!autoRotate) return;
    const id = window.setInterval(() => {
      setRotation((r) => (r + 0.18) % 360);
    }, 40);
    return () => window.clearInterval(id);
  }, [autoRotate]);

  const radius = 160;
  const active = nodes.find((n) => n.id === activeId);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[480px] md:h-[560px] flex items-center justify-center select-none"
      onMouseEnter={() => setAutoRotate(false)}
      onMouseLeave={() => setAutoRotate(true)}
      style={{ background: "#080C0E" }}
    >
      {/* Anillo */}
      <div
        className="absolute rounded-full"
        style={{
          width: radius * 2,
          height: radius * 2,
          border: "1px dashed rgba(255,255,255,0.08)",
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: radius * 2 + 40,
          height: radius * 2 + 40,
          border: "1px solid rgba(255,255,255,0.04)",
        }}
      />

      {/* Centro */}
      <div
        className="absolute flex items-center justify-center rounded-full"
        style={{
          width: 88,
          height: 88,
          background: "#0E1416",
          border: "1px solid rgba(232,162,48,0.4)",
        }}
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--accent)]">
          STACK
        </span>
      </div>

      {/* Nodos orbitales */}
      {nodes.map((node, i) => {
        const angle = (i / nodes.length) * 360 + rotation;
        const rad = (angle * Math.PI) / 180;
        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;
        const isActive = node.id === activeId;
        return (
          <button
            key={node.id}
            type="button"
            onClick={() => setActiveId(node.id)}
            className="absolute flex flex-col items-center justify-center transition-transform duration-200 cursor-pointer focus:outline-none"
            style={{
              transform: `translate(${x}px, ${y}px) scale(${isActive ? 1.15 : 1})`,
            }}
          >
            <div
              className="flex items-center justify-center rounded-full transition-colors"
              style={{
                width: 56,
                height: 56,
                background: "#0E1416",
                border: `1.5px solid ${isActive ? "#4DFFB4" : "#E8A230"}`,
                color: isActive ? "#4DFFB4" : "#E8A230",
              }}
            >
              <span className="font-mono text-[11px] font-bold">{node.code}</span>
            </div>
            <span
              className="mt-2 font-mono text-[9px] uppercase tracking-[0.2em] whitespace-nowrap"
              style={{ color: isActive ? "#4DFFB4" : "rgba(255,255,255,0.5)" }}
            >
              {node.title}
            </span>
          </button>
        );
      })}

      {/* Card lateral con items de la categoría activa */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[min(92%,520px)] p-5"
            style={{
              background: "#0E1416",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 4,
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)]">
                {active.code} · {active.title}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[var(--accent-green)]">
                {active.items.length} TOOLS
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {active.items.map((it) => (
                <span
                  key={it}
                  className="font-mono text-[11px] text-foreground px-2.5 py-1.5"
                  style={{
                    background: "#080C0E",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {it}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
