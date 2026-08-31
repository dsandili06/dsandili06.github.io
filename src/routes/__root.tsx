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
        <div className="font-mono text-[11px] text-[#475569] mb-6">
          <span className="text-[#22D3EE]">analyst@soc-lab</span>:~$ cd /requested-page
        </div>
        <div className="font-mono text-[11px] text-[#FF5F56] mb-8">
          bash: cd: /requested-page: No such file or directory
        </div>

        {/* Glitch 404 */}
        <h1
          className="glitch font-display font-bold text-8xl text-[#3B82F6] leading-none tracking-tight mb-4"
          style={{ fontSize: "clamp(5rem, 15vw, 9rem)" }}
        >
          404
        </h1>

        <h2 className="font-mono text-sm uppercase tracking-[0.25em] text-[#E2E8F0] mb-3">
          PAGE_NOT_FOUND
        </h2>
        <p className="font-mono text-[11px] text-[#475569] mb-8 max-w-sm mx-auto leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Try going back to the main
          terminal.
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
          [ERROR] Session crashed
        </h1>
        <p className="font-mono text-[11px] text-[#475569] mb-8 max-w-sm mx-auto leading-relaxed">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] px-5 py-3 border border-[#3B82F6]/30 text-[#3B82F6] hover:bg-[#3B82F6]/10 hover:border-[#3B82F6] transition-colors"
          >
            <span>retry</span>
          </button>
          <a
            href="/"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] px-5 py-3 border border-[#475569]/30 text-[#475569] hover:text-[#E2E8F0] hover:border-[#475569] transition-colors"
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
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap",
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
