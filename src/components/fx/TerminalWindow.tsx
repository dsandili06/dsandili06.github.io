import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

type Line = { text: string; color: string };

const BOOT_LINES: Line[] = [
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

const COMMANDS: Record<string, Line[]> = {
  help: [
    { text: "Comandos disponibles:", color: "#E2E8F0" },
    { text: "  help      — Muestra esta ayuda", color: "#475569" },
    { text: "  whoami    — Info del analista", color: "#475569" },
    { text: "  ls        — Lista secciones del portfolio", color: "#475569" },
    { text: "  skills    — Stack técnico", color: "#475569" },
    { text: "  contact   — Info de contacto", color: "#475569" },
    { text: "  clear     — Limpia el terminal", color: "#475569" },
    { text: "  exit      — Cierra la sesión", color: "#475569" },
  ],
  whoami: [
    { text: "Santiago Daniel Sandili", color: "#3B82F6" },
    { text: "SOC Analyst Jr. · Blue Team · DFIR", color: "#E2E8F0" },
    { text: "Tucumán, Argentina", color: "#475569" },
  ],
  ls: [
    { text: "about/        proyectos/    investigaciones/", color: "#22D3EE" },
    { text: "stack/        certs/        cursos/", color: "#22D3EE" },
    { text: "contacto/", color: "#22D3EE" },
  ],
  skills: [
    { text: "Forense:      Volatility 3, Autopsy, FTK Imager, Velociraptor", color: "#E2E8F0" },
    { text: "Malware:      dnSpy, ExtAnalysis, Hybrid Analysis, Any.Run", color: "#E2E8F0" },
    { text: "SIEM:         Splunk SPL, ELK Stack, Wireshark, Suricata", color: "#E2E8F0" },
    { text: "Scripting:    Python, Bash, PowerShell", color: "#E2E8F0" },
    { text: "OSINT:        Shodan, VirusTotal, AbuseIPDB, CyberChef", color: "#E2E8F0" },
  ],
  contact: [
    { text: "LinkedIn:  /in/santiagodsandili", color: "#3B82F6" },
    { text: "Email:     sdsandili06@gmail.com", color: "#3B82F6" },
    { text: "GitHub:    github.com/dsandili06", color: "#3B82F6" },
  ],
  exit: [
    { text: "[*] Cerrando sesión...", color: "#475569" },
    { text: "[+] Hasta la próxima. Stay curious.", color: "#22D3EE" },
  ],
};

const CHAR_MS = 12;
const LINE_DELAY = 300;

export function TerminalWindow({ start = true }: { start?: boolean }) {
  const [printed, setPrinted] = useState<Line[]>([]);
  const [current, setCurrent] = useState("");
  const [lineIdx, setLineIdx] = useState(0);
  const [done, setDone] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [history, setHistory] = useState<Line[]>([]);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-typing animation
  useEffect(() => {
    if (!start || done) return;
    if (lineIdx >= BOOT_LINES.length) {
      setDone(true);
      setInteractive(true);
      return;
    }
    const full = BOOT_LINES[lineIdx].text;
    if (current.length < full.length) {
      const t = setTimeout(() => setCurrent(full.slice(0, current.length + 1)), CHAR_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setPrinted((p) => [...p, BOOT_LINES[lineIdx]]);
      setCurrent("");
      setLineIdx((i) => i + 1);
    }, LINE_DELAY);
    return () => clearTimeout(t);
  }, [start, current, lineIdx, done]);

  // Scroll to bottom on new content
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [printed, current, history]);

  // Focus input when interactive
  useEffect(() => {
    if (interactive && inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  }, [interactive]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const newHistory: Line[] = [
      ...history,
      { text: `analyst@soc-lab:~$ ${cmd}`, color: "#22D3EE" },
    ];

    if (trimmed === "clear") {
      setHistory([]);
      setUserInput("");
      return;
    }

    if (trimmed === "exit") {
      setHistory([...newHistory, ...COMMANDS.exit]);
      setInteractive(false);
      setUserInput("");
      return;
    }

    const response = COMMANDS[trimmed];
    if (response) {
      setHistory([...newHistory, ...response]);
    } else if (trimmed) {
      setHistory([
        ...newHistory,
        { text: `bash: ${trimmed}: command not found`, color: "#FF5F56" },
        { text: "Escribí 'help' para ver los comandos disponibles.", color: "#475569" },
      ]);
    } else {
      setHistory(newHistory);
    }
    setUserInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommand(userInput);
    }
  };

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
      onClick={() => interactive && inputRef.current?.focus()}
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
        {interactive && (
          <span className="ml-auto font-mono text-[9px] text-[var(--accent)] animate-pulse">
            INTERACTIVE
          </span>
        )}
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
            {l.text.endsWith("$ ") && i === BOOT_LINES.length - 1 && !interactive && (
              <span
                className="inline-block align-[-2px] ml-0.5 animate-[blink_1s_steps(2)_infinite]"
                style={{ width: "0.6em", height: "1em", background: "#22D3EE" }}
              />
            )}
          </div>
        ))}
        {!done && lineIdx < BOOT_LINES.length && (
          <div style={{ color: BOOT_LINES[lineIdx].color }}>
            {current}
            <span
              className="inline-block align-[-2px] ml-0.5 animate-[blink_1s_steps(2)_infinite]"
              style={{
                width: "0.6em",
                height: "1em",
                background: BOOT_LINES[lineIdx].color,
              }}
            />
          </div>
        )}
        {history.map((l, i) => (
          <div key={`history-${i}`} style={{ color: l.color }}>
            {l.text}
          </div>
        ))}
        {interactive && (
          <div className="flex items-center">
            <span style={{ color: "#22D3EE" }}>analyst@soc-lab:~$ </span>
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-[#E2E8F0] font-mono text-[12px] ml-1"
              style={{ caretColor: "#22D3EE" }}
              aria-label="Terminal input"
            />
            <span
              className="inline-block align-[-2px] ml-0.5 animate-[blink_1s_steps(2)_infinite]"
              style={{ width: "0.6em", height: "1em", background: "#22D3EE" }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
