import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("joins conditional classes and resolves Tailwind conflicts", () => {
    expect(cn("px-2", false && "hidden", ["py-1"], "px-4")).toBe("py-1 px-4");
  });
});
