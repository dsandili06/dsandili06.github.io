import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { WriteupMarkdown } from "@/components/features/writeups/WriteupMarkdown";

const HREF =
  "https://github.com/dsandili06/Artifakt-Labs/blob/main/Writeups/CyberDefenders/FakeGPT.md";

describe("WriteupMarkdown", () => {
  it("renders an accessible copy action for fenced code blocks", () => {
    render(
      <WriteupMarkdown
        markdown={"```bash\nwhoami\n```"}
        investigationHref={HREF}
        onOpenImage={vi.fn()}
      />,
    );

    expect(screen.getByRole("button", { name: "Copiar comando" })).toBeInTheDocument();
    expect(screen.getByText("whoami")).toBeInTheDocument();
  });

  it("opens external links safely and drops untrusted image hosts", () => {
    render(
      <WriteupMarkdown
        markdown={[
          "[GitHub](https://github.com/dsandili06)",
          "![ok](https://user-attachments.githubusercontent.com/1/img.png)",
          "![blocked](https://tracker.example.com/pixel.png)",
        ].join("\n")}
        investigationHref={HREF}
        onOpenImage={vi.fn()}
      />,
    );

    const link = screen.getByRole("link", { name: "GitHub" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByAltText("ok")).toHaveAttribute(
      "src",
      "https://user-attachments.githubusercontent.com/1/img.png",
    );
    expect(screen.queryByAltText("blocked")).not.toBeInTheDocument();
  });
});
