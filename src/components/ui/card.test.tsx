// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

describe("Card", () => {
  it("renders every Card slot", () => {
    const { container } = render(
      <Card className="custom">
        <CardHeader>
          <CardTitle>title</CardTitle>
          <CardDescription>description</CardDescription>
          <CardAction>action</CardAction>
        </CardHeader>
        <CardContent>content</CardContent>
        <CardFooter>footer</CardFooter>
      </Card>,
    );

    const slots = [...container.querySelectorAll("[data-slot]")].map((el) =>
      el.getAttribute("data-slot"),
    );
    expect(slots).toEqual([
      "card",
      "card-header",
      "card-title",
      "card-description",
      "card-action",
      "card-content",
      "card-footer",
    ]);
    expect(container.firstChild).toHaveClass("custom");
  });

});
