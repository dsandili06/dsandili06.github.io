import { Download } from "lucide-react";
import { CONTACT } from "@/data/site";

type CvDownloadButtonProps = {
  className?: string;
  size?: "md" | "lg";
};

const SIZE_CLASS = {
  md: "h-11 text-sm",
  lg: "h-14 text-base",
} as const;

const LAYER =
  "pointer-events-none absolute inset-0 flex items-center justify-center gap-2 transition-transform duration-500 ease-in-out motion-reduce:transition-opacity";

export function CvDownloadButton({ className = "", size = "md" }: CvDownloadButtonProps) {
  return (
    <a
      href={CONTACT.cv}
      download
      aria-label="Descargar CV (PDF)"
      className={`group relative inline-flex min-h-[44px] min-w-[11.5rem] items-center justify-center overflow-hidden whitespace-nowrap rounded-xs border border-[var(--accent)] px-5 font-medium transition-[box-shadow] hover:shadow-card-hover focus-visible:shadow-card-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] ${SIZE_CLASS[size]} ${className}`}
    >
      {/* Invisible in-flow sizing: layers are absolute */}
      <span aria-hidden="true" className="invisible flex items-center gap-2">
        Descargar CV
        <Download className="size-4 shrink-0" />
      </span>
      <span
        aria-hidden="true"
        className={`${LAYER} translate-y-0 scale-100 rotate-0 bg-[var(--surface)] text-[var(--accent)] group-hover:-translate-y-full group-hover:scale-0 group-hover:rotate-[120deg] group-focus-visible:-translate-y-full group-focus-visible:scale-0 group-focus-visible:rotate-[120deg] motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:scale-100 motion-reduce:group-hover:rotate-0 motion-reduce:group-focus-visible:translate-y-0 motion-reduce:group-focus-visible:scale-100 motion-reduce:group-focus-visible:rotate-0 motion-reduce:group-hover:opacity-0 motion-reduce:group-focus-visible:opacity-0`}
      >
        Descargar CV
        <Download className="size-4 shrink-0" />
      </span>
      <span
        aria-hidden="true"
        className={`${LAYER} translate-y-full bg-[var(--accent)] text-[var(--background)] group-hover:translate-y-0 group-focus-visible:translate-y-0 motion-reduce:translate-y-0 motion-reduce:opacity-0 motion-reduce:group-hover:opacity-100 motion-reduce:group-focus-visible:opacity-100`}
      >
        ¡Gracias!
        <Download className="size-4 shrink-0" />
      </span>
    </a>
  );
}
