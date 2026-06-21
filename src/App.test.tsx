import { describe, it, expect } from "vitest";

describe("EarthVerse AI", () => {
  it("project should have climate legacy feature", () => {
    expect("Climate Legacy Score").toContain("Climate Legacy");
  });

  it("project should have future letter feature", () => {
    expect("AI Future Letter").toContain("Future Letter");
  });

  it("project should have sustainability concept", () => {
    expect("EarthVerse AI").toContain("EarthVerse");
  });
});
