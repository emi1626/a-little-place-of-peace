export function meteorVelocity(side: "left" | "right", speed: number) {
  return { vx: side === "left" ? speed : -speed, vy: speed * 0.34 };
}

/** Life drain per frame so a meteor fully crosses to the opposite edge (plus its tail) before fading. */
export function meteorDecay(side: "left" | "right", startX: number, width: number, speed: number) {
  const distance = (side === "left" ? width - startX : startX) + speed * 14;
  return speed / Math.max(distance, 1);
}
