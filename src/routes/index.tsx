import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useState } from "react";
import { MotionConfig } from "motion/react";
import { LenisProvider } from "@/components/fx/LenisProvider";
import { GrainOverlay } from "@/components/fx/GrainOverlay";
import { SectionRail } from "@/components/fx/SectionRail";
import { Nav } from "@/components/layout/Nav";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Proyectos } from "@/components/sections/Proyectos";
import { Footer } from "@/components/layout/Footer";
import { useRevealOnView } from "@/hooks/useRevealOnView";
import { useKonamiCode } from "@/hooks/useKonamiCode";
import { MatrixRain } from "@/components/fx/MatrixRain";
import { ScrollProgress } from "@/components/fx/ScrollProgress";
import { CommandPalette } from "@/components/features/command-palette/CommandPalette";
import { ModalHost } from "@/components/features/modals/ModalHost";
import { validateModalSearch } from "@/components/features/modals/modalSearch";
import { SectionSkeleton } from "@/components/layout/SectionSkeleton";
import { SITE } from "@/data/site";

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
      { title: SITE.title },
      { name: "description", content: SITE.description },
      { property: "og:title", content: SITE.title },
      { property: "og:description", content: SITE.tagline },
    ],
  }),
  validateSearch: validateModalSearch,
  component: Portfolio,
});

function Portfolio() {
  useRevealOnView();
  const [matrixActive, setMatrixActive] = useState(false);

  useKonamiCode(() => setMatrixActive(true));

  return (
    <MotionConfig reducedMotion="user">
      <LenisProvider />
      <div className="min-h-screen bg-background grid-bg text-foreground font-body relative overflow-x-clip selection:bg-accent selection:text-[var(--accent-foreground)]">
        {/* Skip to content — a11y */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10000] focus:px-4 focus:py-2 focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)] focus:font-mono focus:text-xs focus:uppercase focus:tracking-[0.12em] focus:rounded"
        >
          Saltar al contenido
        </a>
        <ScrollProgress />
        <GrainOverlay />
        <SectionRail />
        <CommandPalette />
        <ModalHost />
        <Nav />
        <main id="main-content" tabIndex={-1} className="outline-none">
          <Hero />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
            <About />
            <Suspense fallback={<SectionSkeleton />}>
              <Certs />
            </Suspense>
            <Proyectos />
            <Suspense fallback={<SectionSkeleton />}>
              <Investigaciones />
            </Suspense>
            <Suspense fallback={<SectionSkeleton />}>
              <Stack />
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
  );
}
