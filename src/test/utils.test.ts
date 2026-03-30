import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("returns a single class name unchanged", () => {
    expect(cn("foo")).toBe("foo");
  });

  it("merges multiple class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("ignores falsy values", () => {
    expect(cn("foo", undefined, null, false, "bar")).toBe("foo bar");
  });

  it("deduplicates conflicting Tailwind classes (last one wins)", () => {
    expect(cn("p-4", "p-8")).toBe("p-8");
  });

  it("handles conditional classes via objects", () => {
    expect(cn({ "font-bold": true, "text-red-500": false })).toBe("font-bold");
  });

  it("handles arrays of class names", () => {
    expect(cn(["foo", "bar"])).toBe("foo bar");
  });

  it("returns an empty string when no arguments are provided", () => {
    expect(cn()).toBe("");
  });
});
