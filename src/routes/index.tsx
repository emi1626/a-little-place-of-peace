import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "This is for u!" },
      { name: "description", content: "Un refugio tranquilo, hecho a mano, para que te sientas en paz." },
      { property: "og:title", content: "This is for u!" },
      { property: "og:description", content: "Un refugio tranquilo, hecho a mano, para que te sientas en paz." },
    ],
  }),
  component: Index,
});

const lines = ["Respira.", "Aquí no hay prisa.", "Este lugar es tuyo."];

const pillars = [
  { k: "01", t: "Calma", d: "Un espacio sin ruido, donde puedes bajar los hombros y simplemente estar." },
  { k: "02", t: "Entendimiento", d: "No necesitas explicar nada. Aquí todo lo que sientes tiene sentido." },
  { k: "03", t: "Seguridad", d: "Los días difíciles pasan. Esto se queda, para cuando lo necesites." },
];

function Index() {
  const [step, setStep] = useState(0);
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    if (entered || step >= lines.length) return;
    const id = setTimeout(() => setStep((s) => s + 1), 1900);
    return () => clearTimeout(id);
  }, [step, entered]);

  if (!entered) {
    return (
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="relative mb-10 size-24">
          <span className="absolute inset-0 rounded-full bg-glow/30 blur-2xl animate-breathe" />
          <span className="absolute inset-6 rounded-full border border-glow/60 animate-breathe" />
        </div>
        <div className="h-24 md:h-28">
          {step < lines.length ? (
            <p key={step} className="font-display text-5xl italic animate-rise md:text-7xl">{lines[step]}</p>
          ) : (
            <button onClick={() => setEntered(true)} className="glass group inline-flex items-center gap-3 rounded-full px-7 py-4 text-sm font-medium tracking-wide animate-rise transition-transform hover:scale-[1.03]">
              Entrar a tu refugio <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>
        {step < lines.length && (
          <button onClick={() => setEntered(true)} className="absolute bottom-28 text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground md:bottom-12">Saltar</button>
        )}
      </main>
    );
  }

  return (
    <main className="relative z-10 mx-auto max-w-6xl px-6 pb-40 pt-16 md:pt-36">
      <section className="flex min-h-[70vh] flex-col justify-center">
        <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground animate-rise">Un lugar hecho a mano</p>
        <h1 data-perch className="mt-6 max-w-4xl font-display text-6xl leading-[0.95] animate-rise sm:text-7xl md:text-[8.5rem]" style={{ animationDelay: ".1s" }}>
          This is <em className="text-primary">for u.</em>
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground animate-rise" style={{ animationDelay: ".25s" }}>
          No es un regalo cualquiera. Es un rincón para los días buenos y, sobre todo, para los que no lo son tanto. Quédate el tiempo que quieras.
        </p>
        <div className="mt-10 flex flex-wrap gap-3 animate-rise" style={{ animationDelay: ".4s" }}>
          <Link to="/carta" data-perch className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.03]">
            Leer lo que te escribí <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link to="/galeria" className="glass inline-flex items-center rounded-full px-6 py-3.5 text-sm font-medium transition-transform hover:scale-[1.03]">Explorar con calma</Link>
        </div>
      </section>

      <section className="mt-16 grid gap-4 md:grid-cols-3">
        {pillars.map((p, i) => (
          <article key={p.k} data-perch className="glass group rounded-3xl p-8 transition-all duration-500 hover:-translate-y-1.5 animate-rise" style={{ animationDelay: `${0.5 + i * 0.12}s` }}>
            <span className="text-xs tracking-[0.3em] text-muted-foreground">{p.k}</span>
            <h2 className="mt-6 font-display text-4xl transition-colors group-hover:text-primary">{p.t}</h2>
            <p className="mt-3 leading-relaxed text-muted-foreground">{p.d}</p>
          </article>
        ))}
      </section>

      <section className="mt-28 text-center">
        <p data-perch className="mx-auto max-w-3xl font-display text-3xl italic leading-snug md:text-5xl">
          “A veces la vida pesa. Pero al final, todo va a estar bien — y aquí siempre habrá un lugar para ti.”
        </p>
        <p className="mt-8 text-sm text-muted-foreground">Cambia el ambiente con el botón del menú: {""}
          <span className="text-foreground">cielo de noche</span> o <span className="text-foreground">tarde en el prado</span>.
        </p>
      </section>
    </main>
  );
}
