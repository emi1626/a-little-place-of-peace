import { useEffect, useRef } from "react";
import { useTheme } from "./theme";

/** Full-screen canvas: cosmos (dark) or golden meadow with butterflies, sun & drizzle (light). */
export function Atmosphere() {
  const ref = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    let w = 0, h = 0, raf = 0, t = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -999, y: -999, last: performance.now() };
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
      const stars = Array.from({ length: small ? 160 : 320 }, () => ({ x: rnd(0, w), y: rnd(0, h), r: rnd(0.2, 1.4), p: rnd(0, 6.28), s: rnd(0.005, 0.03), z: rnd(0.2, 1) }));
      const flies = Array.from({ length: small ? 10 : 22 }, () => ({ x: rnd(0, w), y: rnd(h * 0.4, h), a: rnd(0, 6.28), p: rnd(0, 6.28) }));
      let shooting: { x: number; y: number; vx: number; vy: number; life: number } | null = null;
      const draw = () => {
        t++;
        ctx.clearRect(0, 0, w, h);
        const px = (mouse.x - w / 2) * 0.01, py = (mouse.y - h / 2) * 0.01;
        for (const s of stars) {
          s.p += s.s;
          const a = 0.35 + Math.sin(s.p) * 0.35 + 0.3;
          ctx.fillStyle = `rgba(255,246,225,${a * s.z})`;
          ctx.beginPath(); ctx.arc(s.x - px * s.z, s.y - py * s.z, s.r, 0, 7); ctx.fill();
        }
        if (!shooting && Math.random() < 0.004) shooting = { x: rnd(w * 0.2, w), y: rnd(0, h * 0.4), vx: -rnd(7, 11), vy: rnd(2.5, 4.5), life: 1 };
        if (shooting) {
          const s = shooting;
          const g = ctx.createLinearGradient(s.x, s.y, s.x - s.vx * 14, s.y - s.vy * 14);
          g.addColorStop(0, `rgba(255,250,235,${s.life})`); g.addColorStop(1, "rgba(255,250,235,0)");
          ctx.strokeStyle = g; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx * 14, s.y - s.vy * 14); ctx.stroke();
          s.x += s.vx; s.y += s.vy; s.life -= 0.012;
          if (s.life <= 0) shooting = null;
        }
        for (const f of flies) {
          f.a += rnd(-0.08, 0.08); f.p += 0.03;
          f.x += Math.cos(f.a) * 0.4; f.y += Math.sin(f.a) * 0.3;
          if (f.x < 0) f.x = w; if (f.x > w) f.x = 0; if (f.y < h * 0.2) f.a = 1.57; if (f.y > h) f.a = -1.57;
          const a = (Math.sin(f.p) + 1) / 2;
          const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, 10);
          g.addColorStop(0, `rgba(255,214,120,${0.8 * a})`); g.addColorStop(1, "rgba(255,214,120,0)");
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(f.x, f.y, 10, 0, 7); ctx.fill();
        }
        raf = requestAnimationFrame(draw);
      };
      draw();
    } else {
      const colors = ["#f2a65a", "#e9c46a", "#f4978e", "#ffffff", "#b5c99a"];
      type B = { x: number; y: number; vx: number; vy: number; flap: number; col: string; perch: { el: Element; ox: number; oy: number } | null; rest: number };
      const bs: B[] = Array.from({ length: small ? 5 : 9 }, () => ({ x: rnd(0, w), y: rnd(0, h), vx: rnd(-1, 1), vy: rnd(-1, 1), flap: rnd(0, 6), col: colors[Math.floor(rnd(0, colors.length))]!, perch: null, rest: 0 }));
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
              const el = perches[i % perches.length]!;
              const r = el.getBoundingClientRect();
              if (r.bottom > 0 && r.top < h) b.perch = { el, ox: rnd(0.15, 0.85), oy: 0 };
            }
            // flee/curiosity near cursor
            const dx = b.x - mouse.x, dy = b.y - mouse.y, dist = Math.hypot(dx, dy);
            if (dist < 120) { b.vx += (dx / dist) * 0.3; b.vy += (dy / dist) * 0.3; }
            b.vx += rnd(-0.15, 0.15); b.vy += rnd(-0.15, 0.15) - 0.005;
            const sp = Math.hypot(b.vx, b.vy); if (sp > 2.2) { b.vx *= 2.2 / sp; b.vy *= 2.2 / sp; }
            b.x += b.vx; b.y += b.vy + Math.sin(b.flap) * 0.6;
            if (b.x < -20) b.x = w + 20; if (b.x > w + 20) b.x = -20; if (b.y < -20) b.y = h + 20; if (b.y > h + 20) b.y = -20;
          }
          drawB(b, !!b.perch && Math.hypot(b.vx, b.vy) >= 0);
        });
        raf = requestAnimationFrame(draw);
      };
      draw();
    }
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); window.removeEventListener("pointermove", onMove); };
  }, [theme]);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-0" />;
}
