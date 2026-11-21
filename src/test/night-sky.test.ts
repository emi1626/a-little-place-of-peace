import { describe, expect, it } from "vitest";
import { buildStarLayers, magnitudeFlux, meteorDecay, meteorVelocity, sampleMagnitude, spectralColor } from "@/lib/night-sky";

describe("Night sky", () => {
  it("shoots inward from the left", () => {
    expect(meteorVelocity("left", 10)).toEqual({ vx: 10, vy: 3.4000000000000004 });
  });
  it("shoots inward from the right", () => {
    expect(meteorVelocity("right", 10)).toEqual({ vx: -10, vy: 3.4000000000000004 });
  });
  it("lasts until crossing the far edge from the left", () => {
    expect(meteorDecay("left", 0, 1000, 10)).toBeCloseTo(10 / 1140);
  });
  it("lasts until crossing the far edge from the right", () => {
    expect(meteorDecay("right", 1000, 1000, 10)).toBeCloseTo(10 / 1140);
  });
  it("a 5-magnitude gap is exactly 100x in brightness", () => {
    expect(magnitudeFlux(1) / magnitudeFlux(6)).toBeCloseTo(100);
  });
  it("magnitude sampling spans the naked-eye range", () => {
    expect(sampleMagnitude(0)).toBeCloseTo(-1);
    expect(sampleMagnitude(1)).toBeCloseTo(6.5);
  });
  it("K-type orange stars are the most common class", () => {
    expect(spectralColor(0.7)).toBe("oklch(0.9 0.06 70)");
  });
  it("renders the identical sky every time", () => {
    expect(buildStarLayers()).toEqual(buildStarLayers());
  });
});
