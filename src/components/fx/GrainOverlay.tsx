/**
 * Animated film grain overlay — SVG feTurbulence texture that "flickers"
 * via steps() translation for an analog, cinematic feel.
 * Purely decorative: pointer-events none, ~3.5% opacity, respects
 * prefers-reduced-motion (grain freezes instead of flickering).
 */
export function GrainOverlay() {
  return (
    <div aria-hidden className="grain-overlay pointer-events-none fixed inset-0 z-[95]">
      <div className="grain-overlay__layer" />
    </div>
  );
}
