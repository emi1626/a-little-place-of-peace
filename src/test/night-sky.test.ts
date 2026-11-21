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
import { meteorDecay } from "@/lib/night-sky";
describe("Meteor reach", () => {
  it("lasts until crossing the far edge from the left", () => {
    // 1000px to travel + 140px tail at speed 10 → 114 frames
    expect(meteorDecay("left", 0, 1000, 10)).toBeCloseTo(10 / 1140);
  });
  it("lasts until crossing the far edge from the right", () => {
    expect(meteorDecay("right", 1000, 1000, 10)).toBeCloseTo(10 / 1140);
  });
});
