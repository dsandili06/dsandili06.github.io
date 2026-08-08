import { useEffect, useRef, useState } from "react";

const GLYPHS = "!<>-_\\/[]{}=+*^?#01";

type TextScrambleProps = {
  text: string;
  className?: string;
};

/**
 * Decodes text letter by letter with random glyphs before revealing
 * the final character. Runs once on mount. Cyber/SOC aesthetic.
 */
export function TextScramble({ text, className }: TextScrambleProps) {
  const [output, setOutput] = useState(text);
  const startedRef = useRef(false);

  useEffect(() => {
    // Run only once
    if (startedRef.current) return;
    startedRef.current = true;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let frame = 0;
    const queue = text.split("").map((char, i) => ({
      char,
      start: i * 3,
      duration: 12 + Math.floor(Math.random() * 12),
    }));
    const totalFrames = Math.max(...queue.map((q) => q.start + q.duration), 1);

    const interval = setInterval(() => {
      frame++;
      let result = "";
      let complete = 0;
      for (const q of queue) {
        if (frame >= q.start + q.duration) {
          complete++;
          result += q.char;
        } else {
          // Random glyph — keeps full length from frame 0 (no layout shift)
          result += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }
      setOutput(result);
      if (complete === queue.length || frame > totalFrames) {
        setOutput(text);
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [text]);

  return <span className={className}>{output}</span>;
}
