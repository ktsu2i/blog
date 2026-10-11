// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Separator } from "./separator";

describe("Separator", () => {
  it("renders decorative and semantic separators", () => {
    render(
      <>
        <Separator data-testid="decorative" />
        <Separator decorative={false} orientation="vertical" />
      </>,
    );

    expect(screen.getByTestId("decorative")).toHaveAttribute("data-orientation", "horizontal");
    expect(screen.getByRole("separator")).toHaveAttribute("aria-orientation", "vertical");
  });

});
