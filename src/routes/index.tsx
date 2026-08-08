import { createFileRoute } from "@tanstack/react-router";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LenisProvider } from "@/components/fx/LenisProvider";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Proyectos } from "@/components/sections/Proyectos";
import { Investigaciones } from "@/components/sections/Investigaciones";
import { Stack } from "@/components/sections/Stack";
import { Certs } from "@/components/sections/Certs";
import { Cursos } from "@/components/sections/Cursos";
import { Contacto } from "@/components/sections/Contacto";
import { Footer } from "@/components/sections/Footer";
import { useRevealOnView } from "@/hooks/useRevealOnView";

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
  return (
    <TooltipProvider delayDuration={150}>
      <LenisProvider />
      <div className="min-h-screen bg-background text-foreground font-body relative selection:bg-accent selection:text-[var(--accent-foreground)]">
        {/* Skip to content — a11y */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[10000] focus:px-4 focus:py-2 focus:bg-[var(--accent)] focus:text-[var(--accent-foreground)] focus:font-mono focus:text-xs focus:uppercase focus:tracking-[0.2em] focus:rounded"
        >
          Saltar al contenido
        </a>
        <Nav />
        <main id="main-content">
          <Hero />
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <About />
            <Proyectos />
            <Investigaciones />
            <Stack />
            <Certs />
            <Cursos />
            <Contacto />
          </div>
        </main>
        <Footer />
      </div>
    </TooltipProvider>
  );
}
