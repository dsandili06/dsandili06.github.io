import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
} from "@tanstack/react-router";
import { SITE } from "@/data/site";

function NotFoundComponent() {
  return (
    <div className="min-h-screen bg-background grid-bg flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Scanline */}
      <div className="scanline" />

      <div className="relative max-w-md text-center">
        {/* Terminal-style error */}
        <div className="font-mono text-xs text-[var(--muted-foreground)] mb-6">
          <span className="text-[var(--accent)]">analyst@soc-lab</span>:~$ cd /requested-page
        </div>
        <div className="font-mono text-xs text-[var(--accent-error)] mb-8">
          bash: cd: /requested-page: No such file or directory
        </div>

        {/* Glitch 404 */}
        <h1
          className="glitch font-display font-bold leading-none tracking-tight mb-4"
          style={{ fontSize: "clamp(5rem, 15vw, 9rem)", color: "var(--accent)" }}
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
          className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] px-5 py-3 border border-border-dim text-[var(--accent)] hover:bg-[var(--surface-2)] hover:border-[var(--accent)] transition-colors"
        >
          <span>cd ~</span>
          <span className="text-[var(--accent)]">→</span>
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-mono text-sm uppercase tracking-[0.25em] text-[var(--accent-error)] mb-4">
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
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] px-5 py-3 border border-border-dim text-[var(--accent)] hover:bg-[var(--surface-2)] hover:border-[var(--accent)] transition-colors"
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
      { title: SITE.title },
      { name: "description", content: SITE.description },
      { property: "og:image", content: SITE.image },
      { property: "og:image:width", content: SITE.imageWidth },
      { property: "og:image:height", content: SITE.imageHeight },
      { name: "twitter:image", content: SITE.image },
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
