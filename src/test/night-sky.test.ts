import { describe, expect, it } from "vitest";
import { meteorVelocity } from "@/lib/night-sky";

describe("Night sky", () => {
  it("shoots inward from the left", () => {
    expect(meteorVelocity("left", 10)).toEqual({ vx: 10, vy: 3.4000000000000004 });
  });
  it("shoots inward from the right", () => {
    expect(meteorVelocity("right", 10)).toEqual({ vx: -10, vy: 3.4000000000000004 });
  });
});