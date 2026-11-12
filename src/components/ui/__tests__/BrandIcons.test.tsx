import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { GithubIcon, LinkedinIcon } from "../BrandIcons";

describe("BrandIcons", () => {
  it.each([
    ["GithubIcon", GithubIcon],
    ["LinkedinIcon", LinkedinIcon],
  ])("%s renders svg with className, size and aria-hidden", (_name, Icon) => {
    const { container } = render(<Icon className="size-4" size={14} aria-hidden="true" />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg?.getAttribute("class")).toContain("size-4");
    expect(svg?.getAttribute("width")).toBe("14");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
    expect(svg?.getAttribute("stroke-width")).toBe("2");
  });
});
