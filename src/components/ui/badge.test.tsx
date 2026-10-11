// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./badge";

describe("Badge", () => {
  it("renders a span with the given variant", () => {
    render(<Badge variant="outline">plain</Badge>);

    expect(screen.getByText("plain").tagName).toBe("SPAN");
    expect(screen.getByText("plain")).toHaveAttribute("data-variant", "outline");
  });

  it("renders its child element via asChild", () => {
    render(
      <Badge asChild>
        <a href="/badge">badge link</a>
      </Badge>,
    );

    expect(screen.getByRole("link", { name: "badge link" })).toHaveAttribute(
      "data-slot",
      "badge",
    );
  });
});
