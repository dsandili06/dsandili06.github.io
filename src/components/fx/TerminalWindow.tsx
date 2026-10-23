import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

type Line = { text: string; color: string };

const BOOT_LINES: Line[] = [
  { text: "$ volatility3 -f memory.raw windows.pslist", color: "var(--muted-foreground)" },
  { text: "[*] Analyzing process list...", color: "var(--foreground)" },
  { text: "[+] 87 processes found", color: "var(--accent-green)" },
  { text: '$ strings malware.exe | grep -i "http"', color: "var(--muted-foreground)" },
  { text: "[!] C2 detected: 185.220.101.47", color: "var(--accent-amber)" },
  { text: '$ splunk search "EventCode=4625"', color: "var(--muted-foreground)" },
  { text: "[+] 847 failed logons — threshold exceeded", color: "var(--accent-green)" },
  { text: "[ALERT] Escalating to T1 analyst...", color: "var(--accent-amber)" },
];

const COMMANDS: Record<string, Line[]> = {
  help: [
    { text: "Comandos disponibles:", color: "var(--foreground)" },
    { text: "  help      — Muestra esta ayuda", color: "var(--muted-foreground)" },
    { text: "  whoami    — Info del analista", color: "var(--muted-foreground)" },
    { text: "  ls        — Lista secciones del portfolio", color: "var(--muted-foreground)" },
    { text: "  skills    — Stack técnico", color: "var(--muted-foreground)" },
    { text: "  contact   — Info de contacto", color: "var(--muted-foreground)" },
    { text: "  clear     — Limpia el terminal", color: "var(--muted-foreground)" },
    { text: "  exit      — Cierra la sesión", color: "var(--muted-foreground)" },
  ],
  whoami: [
    { text: "Santiago Daniel Sandili", color: "var(--accent)" },
    { text: "SOC Analyst Jr. · Blue Team · DFIR", color: "var(--foreground)" },
    { text: "Tucumán, Argentina", color: "var(--muted-foreground)" },
  ],
  ls: [
    { text: "about/        proyectos/    investigaciones/", color: "var(--accent)" },
    { text: "stack/        certs/        cursos/", color: "var(--accent)" },
    { text: "contacto/", color: "var(--accent)" },
  ],
  skills: [
    {
      text: "Forense:      Volatility 3, Autopsy, FTK Imager, Velociraptor",
      color: "var(--foreground)",
    },
    {
      text: "Malware:      dnSpy, ExtAnalysis, Hybrid Analysis, Any.Run",
      color: "var(--foreground)",
    },
    {
      text: "SIEM:         Splunk SPL, ELK Stack, Wireshark, Suricata",
      color: "var(--foreground)",
    },
    { text: "Scripting:    Python, Bash, PowerShell", color: "var(--foreground)" },
    { text: "OSINT:        Shodan, VirusTotal, AbuseIPDB, CyberChef", color: "var(--foreground)" },
  ],
  contact: [
    { text: "LinkedIn:  /in/santiagodsandili", color: "var(--accent)" },
    { text: "Email:     sdsandili06@gmail.com", color: "var(--accent)" },
    { text: "GitHub:    github.com/dsandili06", color: "var(--accent)" },
  ],
  exit: [
    { text: "[*] Cerrando sesión...", color: "var(--muted-foreground)" },
    { text: "[+] Hasta la próxima. Stay curious.", color: "var(--accent-green)" },
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
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile based on media query
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Auto-typing animation — single interval chain, no state per character
  useEffect(() => {
    if (!start || done) return;
    if (lineIdx >= BOOT_LINES.length) {
      setDone(true);
      setInteractive(true);
      return;
    }
    const full = BOOT_LINES[lineIdx].text;
    let charIdx = 0;
    const interval = setInterval(() => {
      charIdx++;
      if (charIdx <= full.length) {
        setCurrent(full.slice(0, charIdx));
      } else {
        clearInterval(interval);
        setPrinted((p) => [...p, BOOT_LINES[lineIdx]]);
        setCurrent("");
        setLineIdx((i) => i + 1);
      }
    }, CHAR_MS);
    return () => clearInterval(interval);
  }, [start, lineIdx, done]);

  // Scroll to bottom on new content
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [printed, current, history]);

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase();
    const newHistory: Line[] = [
      ...history,
      { text: `analyst@soc-lab:~$ ${cmd}`, color: "var(--accent)" },
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
        { text: `bash: ${trimmed}: command not found`, color: "var(--accent-error)" },
        {
          text: "Escribí 'help' para ver los comandos disponibles.",
          color: "var(--muted-foreground)",
        },
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
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border-dim)",
        borderRadius: 4,
      }}
      onClick={() => interactive && inputRef.current?.focus()}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 border-b"
        style={{ borderColor: "var(--border-dim)" }}
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
        data-lenis-prevent
        className="font-mono text-[11px] sm:text-[12px] leading-[1.6] p-3.5 sm:p-5 overflow-hidden md:overflow-y-auto h-[220px] md:h-[260px] lg:h-[340px]"
      >
        {printed.map((l, i) => (
          <div key={i} style={{ color: l.color }}>
            {l.text}
            {l.text.endsWith("$ ") && i === BOOT_LINES.length - 1 && !interactive && (
              <span
                className="inline-block align-[-2px] ml-0.5 animate-[blink_1s_steps(2)_infinite]"
                style={{ width: "0.6em", height: "1em", background: "var(--accent)" }}
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
        {interactive && !isMobile && (
          <div className="flex items-center">
            <span style={{ color: "var(--accent)" }}>analyst@soc-lab:~$ </span>
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent border-none outline-none text-foreground font-mono text-[12px] ml-1"
              style={{ caretColor: "var(--accent)" }}
              aria-label="Terminal input"
            />
            <span
              className="inline-block align-[-2px] ml-0.5 animate-[blink_1s_steps(2)_infinite]"
              style={{ width: "0.6em", height: "1em", background: "var(--accent)" }}
            />
          </div>
        )}
        {interactive && isMobile && (
          <div className="flex items-center gap-2 font-mono text-[11px] text-[var(--muted-foreground)] flex-wrap">
            <span className="inline-block size-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            <span>Modo interactivo disponible en desktop</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
