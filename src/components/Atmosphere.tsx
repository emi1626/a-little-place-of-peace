import { useEffect, useRef } from "react";
import { useTheme } from "./theme";
import { meteorDecay, meteorVelocity } from "@/lib/night-sky";

/** Full-screen canvas: cosmos (dark) or golden meadow with butterflies, sun & drizzle (light). */
export function Atmosphere() {
  const ref = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    let w = 0, h = 0, raf = 0, t = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, last: performance.now() };
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const palette = getComputedStyle(document.documentElement);
    const starColor = palette.getPropertyValue("--starlight").trim();
    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      c.width = w * dpr; c.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const onMove = (e: PointerEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; mouse.last = performance.now(); };
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    const small = w < 700;

    if (theme === "dark") {
      let shooting: { x: number; y: number; vx: number; vy: number; life: number; decay: number } | null = null;
      let nextMeteor = performance.now() + 2300;
      let fromLeft = Math.random() < 0.5;
      let previous = performance.now();
      let offsetX = 0, offsetY = 0;
      const draw = (now = performance.now()) => {
        const delta = Math.min((now - previous) / 16.667, 2);
        previous = now;
        ctx.clearRect(0, 0, w, h);
        offsetX += ((mouse.x - w / 2) * 0.003 - offsetX) * 0.025;
        offsetY += ((mouse.y - h / 2) * 0.003 - offsetY) * 0.025;
        const sky = c.parentElement;
        if (sky && !reducedMotion) {
          sky.style.setProperty("--sky-x", `${-offsetX}px`);
          sky.style.setProperty("--sky-y", `${-offsetY}px`);
        }
        ctx.globalAlpha = 1;
        if (!reducedMotion && !shooting && now >= nextMeteor) {
          const side = fromLeft ? "left" : "right", speed = rnd(9, 13);
          const x = fromLeft ? rnd(-40, w * 0.15) : rnd(w * 0.85, w + 40);
          shooting = { x, y: rnd(h * 0.04, h * 0.3), ...meteorVelocity(side, speed), life: 1, decay: meteorDecay(side, x, w, speed) };
          fromLeft = !fromLeft;
          nextMeteor = now + rnd(4200, 8500);
        }
        if (shooting) {
          const s = shooting;
          const g = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 14, s.y - s.vy * 14);
          g.addColorStop(0, starColor); g.addColorStop(1, "transparent");
          ctx.globalAlpha = Math.min(1, s.life * 6, (1 - s.life) * 8) * 0.9;
          ctx.strokeStyle = g; ctx.lineWidth = 1.1; ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx * 14, s.y - s.vy * 14); ctx.stroke();
          ctx.fillStyle = starColor; ctx.shadowColor = starColor; ctx.shadowBlur = 8; ctx.beginPath(); ctx.arc(s.x, s.y, 1.3, 0, 7); ctx.fill(); ctx.shadowBlur = 0;
          s.x += s.vx * delta; s.y += s.vy * delta; s.life -= s.decay * delta;
          if (s.life <= 0) shooting = null;
        }
        ctx.globalAlpha = 1;
        if (!reducedMotion) raf = requestAnimationFrame(draw);
      };
      draw();
    } else {
      const colors = ["#f2a65a", "#e9c46a", "#f4978e", "#ffffff", "#b5c99a"];
      type B = { x: number; y: number; vx: number; vy: number; flap: number; col: string; perch: { el: Element; ox: number; oy: number } | null; rest: number };
      const bs: B[] = Array.from({ length: small ? 5 : 9 }, () => ({ x: rnd(0, w), y: rnd(0, h), vx: rnd(-1, 1), vy: rnd(-1, 1), flap: rnd(0, 6), col: colors[Math.floor(rnd(0, colors.length))] ?? colors[0] ?? "", perch: null, rest: 0 }));
      const drops = Array.from({ length: small ? 40 : 90 }, () => ({ x: rnd(0, w), y: rnd(0, h), l: rnd(6, 14), v: rnd(3, 6) }));
      const petals = Array.from({ length: 18 }, () => ({ x: rnd(0, w), y: rnd(0, h), r: rnd(1, 2.5), p: rnd(0, 6) }));
      const drawB = (b: B, sitting: boolean) => {
        const open = sitting ? 0.35 + Math.abs(Math.sin(b.flap * 0.15)) * 0.25 : Math.abs(Math.sin(b.flap));
        const ang = Math.atan2(b.vy, b.vx) + Math.PI / 2;
        ctx.save(); ctx.translate(b.x, b.y); ctx.rotate(sitting ? 0 : ang * 0.3);
        ctx.fillStyle = b.col; ctx.globalAlpha = 0.9;
        for (const side of [-1, 1]) {
          ctx.save(); ctx.scale(side * (0.25 + open * 0.75), 1);
          ctx.beginPath(); ctx.ellipse(6, -4, 7, 5.5, -0.5, 0, 7); ctx.fill();
          ctx.beginPath(); ctx.ellipse(5, 4, 4.5, 3.5, 0.5, 0, 7); ctx.fill();
          ctx.restore();
        }
        ctx.globalAlpha = 1; ctx.fillStyle = "#4a3426"; ctx.fillRect(-0.8, -6, 1.6, 12);
        ctx.restore();
      };
      const draw = () => {
        t++;
        ctx.clearRect(0, 0, w, h);
        // warm sun
        const sx = w * 0.82, sy = h * 0.16, pulse = 1 + Math.sin(t * 0.01) * 0.04;
        const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, 260 * pulse);
        sg.addColorStop(0, "rgba(255,226,160,0.9)"); sg.addColorStop(0.25, "rgba(255,200,130,0.35)"); sg.addColorStop(1, "rgba(255,200,130,0)");
        ctx.fillStyle = sg; ctx.beginPath(); ctx.arc(sx, sy, 260 * pulse, 0, 7); ctx.fill();
        // gentle drizzle
        ctx.strokeStyle = "rgba(120,140,170,0.18)"; ctx.lineWidth = 1;
        for (const d of drops) {
          ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - 1.5, d.y + d.l); ctx.stroke();
          d.y += d.v; d.x -= 0.4; if (d.y > h) { d.y = -20; d.x = rnd(0, w + 50); }
        }
        // floating pollen
        for (const p of petals) {
          p.p += 0.01; p.y -= 0.15; p.x += Math.sin(p.p) * 0.3; if (p.y < 0) p.y = h;
          ctx.fillStyle = "rgba(255,240,200,0.7)"; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
        }
        const idle = performance.now() - mouse.last > 1200;
        const perches = idle ? Array.from(document.querySelectorAll("[data-perch]")) : [];
        bs.forEach((b, i) => {
          b.flap += b.perch ? 1 : 0.45;
          if (b.perch) {
            const r = b.perch.el.getBoundingClientRect();
            const tx = r.left + b.perch.ox * r.width, ty = r.top - 4;
            b.x += (tx - b.x) * 0.06; b.y += (ty - b.y) * 0.06;
            if (!idle) { b.perch = null; b.vy = -2; }
          } else {
            if (idle && perches.length && Math.random() < 0.01) {
               const el = perches[i % perches.length];
               if (!el) return;
              const r = el.getBoundingClientRect();
              if (r.bottom > 0 && r.top < h) b.perch = { el, ox: rnd(0.15, 0.85), oy: 0 };
            }
            // flee/curiosity near cursor
            const dx = b.x - mouse.x, dy = b.y - mouse.y, dist = Math.hypot(dx, dy);
             if (dist > 0 && dist < 120) { b.vx += (dx / dist) * 0.3; b.vy += (dy / dist) * 0.3; }
            b.vx += rnd(-0.15, 0.15); b.vy += rnd(-0.15, 0.15) - 0.005;
            const sp = Math.hypot(b.vx, b.vy); if (sp > 2.2) { b.vx *= 2.2 / sp; b.vy *= 2.2 / sp; }
            b.x += b.vx; b.y += b.vy + Math.sin(b.flap) * 0.6;
            if (b.x < -20) b.x = w + 20; if (b.x > w + 20) b.x = -20; if (b.y < -20) b.y = h + 20; if (b.y > h + 20) b.y = -20;
          }
          drawB(b, !!b.perch && Math.hypot(b.vx, b.vy) >= 0);
        });
         if (!reducedMotion) raf = requestAnimationFrame(draw);
      };
      draw();
    }
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", onMove); };
  }, [theme]);

  return <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
    {theme === "dark" && <div className="celestial-space absolute inset-0">
      <svg className="nebula-filter" width="0" height="0" focusable="false">
        <defs>
          <filter id="nebula-dust" x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.026" numOctaves="4" seed="17" result="dust" />
            <feColorMatrix in="dust" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0.8 0.8 0.8 0 -0.85" result="wisps" />
            <feComposite in="SourceGraphic" in2="wisps" operator="in" />
          </filter>
        </defs>
      </svg>
      <div className="nebula-dust" />
      <div className="star-depth star-depth-far"><i /></div>
      <div className="star-depth star-depth-middle"><i /></div>
      <div className="star-depth star-depth-near"><i />
        {Array.from({ length: 12 }, (_, index) => <b key={index} className="stellar-beacon" />)}
      </div>
    </div>}
    <canvas ref={ref} className="absolute inset-0" />
  </div>;
}
