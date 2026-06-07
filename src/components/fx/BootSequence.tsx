import { useEffect, useState } from "react";

const LINES = [
  "[INIT] Cargando perfil analista...",
  "[OK]   SOC L1 · Blue Team · DFIR",
  "[OK]   15 casos documentados",
  "[RUN]  Santiago Daniel Sandili >",
];

export function BootSequence({ onDone }: { onDone?: () => void }) {
  const [printed, setPrinted] = useState<string[]>([]);
  const [current, setCurrent] = useState("");
  const [lineIdx, setLineIdx] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    if (lineIdx >= LINES.length) {
      setDone(true);
      onDone?.();
      return;
    }
    const full = LINES[lineIdx];
    if (current.length < full.length) {
      const t = setTimeout(() => setCurrent(full.slice(0, current.length + 1)), 22);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setPrinted((p) => [...p, full]);
        setCurrent("");
        setLineIdx((i) => i + 1);
      }, 180);
      return () => clearTimeout(t);
    }
  }, [current, lineIdx, done, onDone]);

  return (
    <pre
      className="font-mono text-[11px] md:text-xs leading-relaxed text-[var(--accent)] whitespace-pre-wrap m-0"
      aria-hidden
    >
      {printed.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
      {!done && (
        <div>
          {current}
          <span className="inline-block w-[0.55em] h-[1em] bg-[var(--accent)] align-[-2px] ml-0.5 animate-[blink_1s_steps(2)_infinite]" />
        </div>
      )}
    </pre>
  );
}
