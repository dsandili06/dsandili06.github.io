import { cn } from "@/lib/utils";

type Corner = "tl" | "tr" | "bl" | "br";

type CornerBracketsProps = {
  /** Which corners to draw. Defaults to all four. */
  corners?: readonly Corner[];
  /** Size and color classes (e.g. `size-3 border-[var(--accent)]/60`). */
  className?: string;
  /** Border thickness class. */
  thickness?: "border" | "border-2";
};

const ALL_CORNERS: readonly Corner[] = ["tl", "tr", "bl", "br"];

const POSITION: Record<Corner, string> = {
  tl: "top-0 left-0 border-t border-l",
  tr: "top-0 right-0 border-t border-r",
  bl: "bottom-0 left-0 border-b border-l",
  br: "bottom-0 right-0 border-b border-r",
};

const POSITION_THICK: Record<Corner, string> = {
  tl: "top-0 left-0 border-t-2 border-l-2",
  tr: "top-0 right-0 border-t-2 border-r-2",
  bl: "bottom-0 left-0 border-b-2 border-l-2",
  br: "bottom-0 right-0 border-b-2 border-r-2",
};

/**
 * Decorative HUD corner brackets. Parent must be `relative`.
 * Use sparingly: one featured element per section.
 */
export function CornerBrackets({
  corners = ALL_CORNERS,
  className,
  thickness = "border",
}: CornerBracketsProps) {
  const map = thickness === "border-2" ? POSITION_THICK : POSITION;
  return (
    <>
      {corners.map((corner) => (
        <span
          key={corner}
          aria-hidden
          className={cn("pointer-events-none absolute z-10 size-3", map[corner], className)}
        />
      ))}
    </>
  );
}
