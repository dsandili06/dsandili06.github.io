export const COMMAND_PALETTE_OPEN_EVENT = "open-command-palette";
export const COMMAND_PALETTE_CLOSE_EVENT = "close-command-palette";

export function openCommandPalette() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(COMMAND_PALETTE_OPEN_EVENT));
  }
}

export function closeCommandPalette() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(COMMAND_PALETTE_CLOSE_EVENT));
  }
}
