import { createFileRoute, Outlet } from "@tanstack/react-router";
import { MotionConfig } from "motion/react";
import { LenisProvider } from "@/components/fx/LenisProvider";
import { Footer } from "@/components/layout/Footer";
import { WriteupsHeader } from "@/components/features/writeups/WriteupsHeader";

export const Route = createFileRoute("/writeups")({
  component: WriteupsLayout,
});

function WriteupsLayout() {
  return (
    <MotionConfig reducedMotion="user">
      <LenisProvider />
      <div
        id="top"
        className="min-h-screen bg-background grid-bg text-foreground font-body relative overflow-x-clip selection:bg-accent selection:text-[var(--accent-foreground)]"
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10000] focus:px-4 focus:py-2 focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)] focus:font-mono focus:text-xs focus:uppercase focus:tracking-[0.12em] focus:rounded"
        >
          Saltar al contenido
        </a>
        <WriteupsHeader />
        <main id="main-content" tabIndex={-1} className="outline-none">
          <Outlet />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
