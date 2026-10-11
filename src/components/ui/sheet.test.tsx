// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./sheet";

describe("Sheet", () => {
  it.each(["top", "right", "bottom", "left"] as const)(
    "renders a %s sheet with all slots",
    async (side) => {
      const user = userEvent.setup();
      render(
        <Sheet defaultOpen>
          <SheetContent side={side} showCloseButton={side !== "left"}>
            <SheetHeader>
              <SheetTitle>title</SheetTitle>
              <SheetDescription>description</SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <SheetClose>done</SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>,
      );

      const dialog = screen.getByRole("dialog");
      expect(dialog).toHaveAccessibleDescription("description");
      expect(
        within(dialog).queryAllByRole("button", { name: "Close" }),
      ).toHaveLength(side === "left" ? 0 : 1);

      await user.click(screen.getByRole("button", { name: "done" }));
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    },
  );

  it("uses the right side by default", () => {
    render(
      <Sheet defaultOpen>
        <SheetContent>
          <SheetTitle>title</SheetTitle>
          <SheetDescription>description</SheetDescription>
        </SheetContent>
      </Sheet>,
    );

    expect(screen.getByRole("dialog")).toHaveClass("right-0");
  });
});
