const SAFE_LINK_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);
const MAX_INLINE_IMAGE_BYTES = 1024 * 1024;
const DATA_IMAGE_PREFIX = /^data:image\/(?:png|gif|jpeg|webp|avif);base64,/i;
const VALID_BASE64 = /^(?:[a-z\d+/]{4})*(?:[a-z\d+/]{2}==|[a-z\d+/]{3}=)?$/i;

function isSafeInlineImage(value: string): boolean {
  const prefix = DATA_IMAGE_PREFIX.exec(value)?.[0];
  if (!prefix) return false;

  const base64 = value.slice(prefix.length);
  if (!base64 || !VALID_BASE64.test(base64)) return false;
  const padding = base64.endsWith("==") ? 2 : base64.endsWith("=") ? 1 : 0;
  const decodedBytes = Math.floor((base64.length * 3) / 4) - padding;
  return decodedBytes <= MAX_INLINE_IMAGE_BYTES;
}

/** Reject unsafe schemes while leaving repository-relative links and anchors intact. */
export function safeMarkdownUrl(uri: string, key?: string): string | undefined {
  const value = uri.trim();
  if (!value) return undefined;
  for (const character of value) {
    const code = character.charCodeAt(0);
    if (code <= 0x1f || code === 0x7f) return undefined;
  }
  if (
    value.startsWith("#") ||
    value.startsWith("/") ||
    value.startsWith("./") ||
    value.startsWith("../")
  ) {
    return value;
  }
  if (key === "src" && isSafeInlineImage(value)) return value;
  try {
    const parsed = new URL(value, "https://writeup.invalid/");
    return SAFE_LINK_PROTOCOLS.has(parsed.protocol) ? value : undefined;
  } catch {
    return undefined;
  }
}

/** Allow trusted image hosts or resolve repository-relative paths beside the writeup. */
export function resolveWriteupImageUri(uri: string, githubUrl: string): string {
  const safeUri = safeMarkdownUrl(uri, "src");
  if (!safeUri) return "";
  if (isSafeInlineImage(safeUri)) return safeUri;

  if (/^https?:\/\//i.test(safeUri)) {
    try {
      const url = new URL(safeUri);
      const host = url.hostname.toLowerCase();
      const trustedGithub =
        host === "github.com" ||
        host === "githubusercontent.com" ||
        host.endsWith(".githubusercontent.com");
      const trustedS3 =
        host === "s3.amazonaws.com" ||
        host.endsWith(".s3.amazonaws.com") ||
        /^s3[.-][a-z0-9-]+\.amazonaws\.com$/.test(host) ||
        /^[^.]+\.s3(?:[.-][a-z0-9-]+)?\.amazonaws\.com$/.test(host);
      return url.username || url.password || (!trustedGithub && !trustedS3) ? "" : safeUri;
    } catch {
      return "";
    }
  }

  const raw = githubUrl
    .replace("https://github.com/", "https://raw.githubusercontent.com/")
    .replace("/blob/", "/");
  return `${raw.slice(0, raw.lastIndexOf("/") + 1)}${safeUri.replace(/^\.?\//, "")}`;
}
