import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import "./styles.css";

const router = getRouter();

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}

// Log unhandled errors to the console for debugging (no telemetry).
// This catches runtime exceptions that escape React's error boundaries.
window.addEventListener("error", (e) => {
  console.error("[Global Error]", e.error?.message || e.message);
});
window.addEventListener("unhandledrejection", (e) => {
  console.error("[Global Unhandled Rejection]", e.reason?.message || e.reason);
});
const rootEl = document.getElementById("root")!;
createRoot(rootEl).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
