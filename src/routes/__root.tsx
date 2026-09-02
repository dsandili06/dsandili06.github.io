import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
} from "@tanstack/react-router";

function NotFoundComponent() {
  return (
    <div className="min-h-screen bg-[#060A10] flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#3B82F6 1px, transparent 1px), linear-gradient(90deg, #3B82F6 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Scanline */}
      <div className="scanline" />

      <div className="relative max-w-md text-center">
        {/* Terminal-style error */}
        <div className="font-mono text-xs text-[var(--muted-foreground)] mb-6">
          <span className="text-[#22D3EE]">analyst@soc-lab</span>:~$ cd /requested-page
        </div>
        <div className="font-mono text-xs text-[#FF5F56] mb-8">
          bash: cd: /requested-page: No such file or directory
        </div>

        {/* Glitch 404 */}
        <h1
          className="glitch font-display font-bold leading-none tracking-tight mb-4"
          style={{ fontSize: "clamp(5rem, 15vw, 9rem)", color: "#3B82F6" }}
        >
          404
        </h1>

        <h2 className="font-mono text-sm uppercase tracking-[0.25em] text-foreground mb-3">
          PÁGINA_NO_ENCONTRADA
        </h2>
        <p className="font-mono text-xs text-[var(--muted-foreground)] mb-8 max-w-sm mx-auto leading-relaxed">
          La página que buscás no existe o fue movida. Volvé a la terminal principal.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] px-5 py-3 border border-[#3B82F6]/30 text-[#3B82F6] hover:bg-[#3B82F6]/10 hover:border-[#3B82F6] transition-colors"
        >
          <span>cd ~</span>
          <span className="text-[#22D3EE]">→</span>
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#060A10] flex flex-col items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-mono text-sm uppercase tracking-[0.25em] text-[#FF5F56] mb-4">
          [ERROR] Sesión caída
        </h1>
        <p className="font-mono text-xs text-[var(--muted-foreground)] mb-8 max-w-sm mx-auto leading-relaxed">
          Algo salió mal. Podés refrescar la página o volver al inicio.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] px-5 py-3 border border-[#3B82F6]/30 text-[#3B82F6] hover:bg-[#3B82F6]/10 hover:border-[#3B82F6] transition-colors"
          >
            <span>reintentar</span>
          </button>
          <a
            href="/"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] px-5 py-3 border border-[var(--muted-foreground)]/30 text-[var(--muted-foreground)] hover:text-foreground hover:border-[var(--muted-foreground)] transition-colors"
          >
            <span>cd ~</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { title: "Santiago Daniel Sandili — SECURITY ANALYST L1 / Blue Team" },
      {
        name: "description",
        content:
          "Portfolio de Santiago Daniel Sandili — Analista de Seguridad L1 / Blue Team. DFIR, threat hunting, malware analysis y automatización defensiva.",
      },
      { property: "og:image", content: "https://dsandili06.github.io/og-image.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:image", content: "https://dsandili06.github.io/og-image.png" },
    ],
    links: [
      {
        rel: "preload",
        href: "/fonts/space-grotesk-700.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/fonts/inter-400.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: "/fonts/jetbrains-mono-400.woff2",
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <HeadContent />
      <Outlet />
    </QueryClientProvider>
  );
}
