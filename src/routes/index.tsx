import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MotionConfig } from "motion/react";
import { LenisProvider } from "@/components/fx/LenisProvider";
import { GrainOverlay } from "@/components/fx/GrainOverlay";
import { SectionRail } from "@/components/fx/SectionRail";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Proyectos } from "@/components/sections/Proyectos";
import { Footer } from "@/components/sections/Footer";
import { useRevealOnView } from "@/hooks/useRevealOnView";
import { useKonamiCode } from "@/hooks/useKonamiCode";
import { MatrixRain } from "@/components/fx/MatrixRain";
import { ScrollProgress } from "@/components/fx/ScrollProgress";

// Lazy load below-the-fold sections for better initial load performance
const Investigaciones = lazy(() =>
  import("@/components/sections/Investigaciones").then((m) => ({ default: m.Investigaciones })),
);
const Stack = lazy(() => import("@/components/sections/Stack").then((m) => ({ default: m.Stack })));
const Certs = lazy(() => import("@/components/sections/Certs").then((m) => ({ default: m.Certs })));
const Cursos = lazy(() =>
  import("@/components/sections/Cursos").then((m) => ({ default: m.Cursos })),
);
const Contacto = lazy(() =>
  import("@/components/sections/Contacto").then((m) => ({ default: m.Contacto })),
);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Santiago Daniel Sandili — SECURITY ANALYST L1 / Blue Team" },
      {
        name: "description",
        content:
          "Portfolio de Santiago Daniel Sandili — Analista de Seguridad L1 / Blue Team. DFIR, threat hunting, malware analysis y automatización defensiva.",
      },
      {
        property: "og:title",
        content: "Santiago Daniel Sandili — SECURITY ANALYST L1 / Blue Team",
      },
      {
        property: "og:description",
        content: "DFIR · Threat Hunting · Malware Analysis · Blue Team Automation.",
      },
    ],
  }),
  component: Portfolio,
});

function Portfolio() {
  useRevealOnView();
  const [matrixActive, setMatrixActive] = useState(false);

  useKonamiCode(() => setMatrixActive(true));

  return (
    <TooltipProvider delayDuration={150}>
      <MotionConfig reducedMotion="user">
        <LenisProvider />
        <div className="min-h-screen bg-background text-foreground font-body relative selection:bg-accent selection:text-[var(--accent-foreground)]">
          {/* Skip to content — a11y */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10000] focus:px-4 focus:py-2 focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)] focus:font-mono focus:text-xs focus:uppercase focus:tracking-[0.2em] focus:rounded"
          >
            Saltar al contenido
          </a>
          <ScrollProgress />
          <GrainOverlay />
          <SectionRail />
          <Nav />
          <main id="main-content">
            <Hero />
            <div className="max-w-7xl mx-auto px-6 md:px-10">
              <About />
              <Proyectos />
              <Suspense fallback={<SectionSkeleton />}>
                <Investigaciones />
              </Suspense>
              <Suspense fallback={<SectionSkeleton />}>
                <Stack />
              </Suspense>
              <Suspense fallback={<SectionSkeleton />}>
                <Certs />
              </Suspense>
              <Suspense fallback={<SectionSkeleton />}>
                <Cursos />
              </Suspense>
              <Suspense fallback={<SectionSkeleton />}>
                <Contacto />
              </Suspense>
            </div>
          </main>
          <Footer />
          <MatrixRain active={matrixActive} onClose={() => setMatrixActive(false)} />
        </div>
      </MotionConfig>
    </TooltipProvider>
  );
}

/* ---------- Suspense fallback ---------- */

function SectionSkeleton() {
  return (
    <div className="py-16 md:py-32 border-b border-border-dim">
      <div className="mb-14 md:mb-20">
        <div className="h-8 w-32 bg-[var(--surface)] rounded animate-pulse" />
        <div className="mt-3 h-12 w-64 bg-[var(--surface)] rounded animate-pulse" />
      </div>
      <div className="space-y-4">
        <div className="h-24 bg-[var(--surface)] rounded animate-pulse" />
        <div className="h-24 bg-[var(--surface)] rounded animate-pulse" />
        <div className="h-24 bg-[var(--surface)] rounded animate-pulse" />
      </div>
    </div>
  );
}
