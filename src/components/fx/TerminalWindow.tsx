import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

type Line = { text: string; color: string };

const LINES: Line[] = [
  { text: "$ volatility3 -f memory.raw windows.pslist", color: "#475569" },
  { text: "[*] Analyzing process list...", color: "#E2E8F0" },
  { text: "[+] 87 processes found", color: "#22D3EE" },
  { text: '$ strings malware.exe | grep -i "http"', color: "#475569" },
  { text: "[!] C2 detected: 185.220.101.47", color: "#3B82F6" },
  { text: '$ splunk search "EventCode=4625"', color: "#475569" },
  { text: "[+] 847 failed logons — threshold exceeded", color: "#22D3EE" },
  { text: "[ALERT] Escalating to T1 analyst...", color: "#3B82F6" },
  { text: "analyst@soc-lab:~$ ", color: "#22D3EE" },
];

const CHAR_MS = 35;
const LINE_DELAY = 800;

export function TerminalWindow({ start = true }: { start?: boolean }) {
  const [printed, setPrinted] = useState<Line[]>([]);
  const [current, setCurrent] = useState("");
  const [lineIdx, setLineIdx] = useState(0);
  const [done, setDone] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!start || done) return;
    if (lineIdx >= LINES.length) {
      setDone(true);
      return;
    }
    const full = LINES[lineIdx].text;
    if (current.length < full.length) {
      const t = setTimeout(
        () => setCurrent(full.slice(0, current.length + 1)),
        CHAR_MS,
      );
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setPrinted((p) => [...p, LINES[lineIdx]]);
      setCurrent("");
      setLineIdx((i) => i + 1);
    }, LINE_DELAY);
    return () => clearTimeout(t);
  }, [start, current, lineIdx, done]);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [printed, current]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: start ? 1 : 0, y: start ? 0 : 16 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="w-full overflow-hidden"
      style={{
        backgroundColor: "#0A0F11",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 4,
      }}
      aria-hidden
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 border-b"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        <span className="block size-2 rounded-full" style={{ background: "#FF5F56" }} />
        <span className="block size-2 rounded-full" style={{ background: "#FFBD2E" }} />
        <span className="block size-2 rounded-full" style={{ background: "#27C93F" }} />
        <span className="ml-3 font-mono text-[11px] text-[var(--muted-foreground)]">
          analyst@soc-lab:~
        </span>
      </div>

      {/* Body */}
      <div
        ref={bodyRef}
        className="font-mono text-[12px] leading-[1.6] overflow-hidden"
        style={{ padding: 20, height: 340 }}
      >
        {printed.map((l, i) => (
          <div key={i} style={{ color: l.color }}>
            {l.text}
            {l.text.endsWith("$ ") && i === LINES.length - 1 && (
              <span
                className="inline-block align-[-2px] ml-0.5 animate-[blink_1s_steps(2)_infinite]"
                style={{ width: "0.6em", height: "1em", background: "#22D3EE" }}
              />
            )}
          </div>
        ))}
        {!done && lineIdx < LINES.length && (
          <div style={{ color: LINES[lineIdx].color }}>
            {current}
            <span
              className="inline-block align-[-2px] ml-0.5 animate-[blink_1s_steps(2)_infinite]"
              style={{
                width: "0.6em",
                height: "1em",
                background: LINES[lineIdx].color,
              }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
