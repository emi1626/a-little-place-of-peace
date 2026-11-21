export function meteorVelocity(side: "left" | "right", speed: number) {
  return { vx: side === "left" ? speed : -speed, vy: speed * 0.34 };
}

/** Life drain per frame so a meteor fully crosses to the opposite edge (plus its tail) before fading. */
export function meteorDecay(side: "left" | "right", startX: number, width: number, speed: number) {
  const distance = (side === "left" ? width - startX : startX) + speed * 14;
  return speed / Math.max(distance, 1);
}

/** Pogson's law: relative flux of a star of apparent magnitude m against magnitude 0. */
export function magnitudeFlux(m: number) {
  return 10 ** (-0.4 * m);
}

/** Inverse CDF of N(<m) ∝ 10^(0.5m): faint stars vastly outnumber bright ones, as in the real sky. */
export function sampleMagnitude(u: number, min = -1, max = 6.5) {
  const a = 10 ** (0.5 * min), b = 10 ** (0.5 * max);
  return 2 * Math.log10(a + u * (b - a));
}

/** Naked-eye spectral mix (approx.) with each class's colour from its blackbody temperature. */
export const SPECTRAL_CLASSES = [
  { cls: "B", share: 0.1, color: "oklch(0.86 0.06 255)" },
  { cls: "A", share: 0.22, color: "oklch(0.93 0.025 250)" },
  { cls: "F", share: 0.19, color: "oklch(0.97 0.008 220)" },
  { cls: "G", share: 0.14, color: "oklch(0.96 0.03 95)" },
  { cls: "K", share: 0.31, color: "oklch(0.9 0.06 70)" },
  { cls: "M", share: 0.04, color: "oklch(0.82 0.09 50)" },
] as const;

export function spectralColor(u: number) {
  let acc = 0;
  for (const s of SPECTRAL_CLASSES) { acc += s.share; if (u < acc) return s.color; }
  return SPECTRAL_CLASSES[SPECTRAL_CLASSES.length - 1]!.color;
}

/** Deterministic PRNG so server and browser render the identical sky. */
export function seeded(seed: number) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

const withAlpha = (color: string, a: number) => color.replace(")", ` / ${a.toFixed(3)})`);

/** Box-shadow star layers: faint field, middle field, bright stars with halos, and scintillating groups. */
export function buildStarLayers(count = 760, seed = 20261121) {
  const r = seeded(seed);
  const far: string[] = [], middle: string[] = [], near: string[] = [];
  const twinkle: string[][] = [[], [], [], []];
  const ref = magnitudeFlux(1.5);
  for (let i = 0; i < count; i++) {
    const x = (r() * 104 - 2).toFixed(2), y = (r() * 104 - 2).toFixed(2);
    const m = sampleMagnitude(r());
    const color = spectralColor(r());
    const f = magnitudeFlux(m) / ref; // ~1 for a 1.5 mag star
    const alpha = Math.min(1, 0.16 + Math.sqrt(f) * 0.84);
    const pos = `${x}vw ${y}vh`;
    if (m > 5) far.push(`${pos} 0 ${withAlpha(color, alpha)}`);
    else if (m > 3) middle.push(`${pos} 0 ${withAlpha(color, alpha)}`);
    else {
      const core = Math.min(1.8, 0.3 + Math.sqrt(f) * 0.7).toFixed(2);
      const halo = Math.min(9, 2 + Math.sqrt(f) * 3.5).toFixed(1);
      const star = `${pos} 0 ${core}px ${withAlpha(color, Math.min(1, alpha + 0.1))}, ${pos} ${halo}px 0.5px ${withAlpha(color, Math.min(0.42, 0.12 + f * 0.09))}`;
      // Atmospheric scintillation affects point sources; bright stars visibly shimmer.
      if (m < 2.2) twinkle[i % 4]!.push(star); else near.push(star);
    }
  }
  return { far: far.join(","), middle: middle.join(","), near: near.join(","), twinkle: twinkle.map((t) => t.join(",")) };
}
