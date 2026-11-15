export function meteorVelocity(side: "left" | "right", speed: number) {
  return { vx: side === "left" ? speed : -speed, vy: speed * 0.34 };
}