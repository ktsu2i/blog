// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./button";

describe("Button", () => {
  it("renders a button with the given size", () => {
    render(<Button size="sm">button</Button>);

    expect(screen.getByRole("button", { name: "button" })).toHaveAttribute(
      "data-size",
      "sm",
    );
  });

  it("renders its child element via asChild", () => {
    render(
      <Button asChild variant="link">
        <a href="/button">button link</a>
      </Button>,
    );

    expect(screen.getByRole("link", { name: "button link" })).toHaveAttribute(
      "data-slot",
      "button",
    );
  });
});
