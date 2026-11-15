import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "This is for u!" },
      { name: "description", content: "Un refugio tranquilo, hecho a mano, para que te sientas en paz." },
      { property: "og:title", content: "This is for u!" },
      { property: "og:description", content: "Un refugio tranquilo, hecho a mano, para que te sientas en paz." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
        <div className="intro-orbit mb-10" />
        <div className="h-24 md:h-28">
          {step < lines.length ? (
            <p key={step} className="font-display text-4xl animate-rise sm:text-5xl md:text-7xl">{lines[step]}</p>
          ) : (
            <Button variant="ghost" onClick={() => setEntered(true)} className="glass group h-auto gap-3 rounded-full px-7 py-4 text-sm font-medium animate-rise transition-transform hover:scale-[1.03]">
              Entrar a tu refugio <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Button>
          )}
        </div>
        {step < lines.length && (
          <Button variant="ghost" onClick={() => setEntered(true)} className="absolute bottom-28 text-xs uppercase text-muted-foreground hover:text-foreground md:bottom-12">Saltar</Button>
        )}
      </main>
    );
  }

  return (
    <main className="relative z-10 mx-auto max-w-6xl px-6 pb-40 pt-28 md:pt-36">
      <section className="flex min-h-[54svh] flex-col justify-center md:min-h-[62vh]">
        <p className="text-xs uppercase tracking-normal text-muted-foreground animate-rise">Un pequeño lugar en el universo</p>
        <h1 data-perch className="mt-6 max-w-4xl font-display text-6xl leading-[1.05] animate-rise sm:text-7xl md:text-[8.5rem]" style={{ animationDelay: ".1s" }}>
           This is <span className="text-primary">for u.</span>
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground animate-rise" style={{ animationDelay: ".25s" }}>
          No es un regalo cualquiera. Es un rincón para los días buenos y, sobre todo, para los que no lo son tanto. Quédate el tiempo que quieras.
        </p>
        <div className="mt-10 flex flex-wrap gap-3 animate-rise" style={{ animationDelay: ".4s" }}>
          <Button asChild className="group h-auto rounded-full px-6 py-3.5 transition-transform hover:scale-[1.03]"><Link to="/carta" data-perch>
            Leer lo que te escribí <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link></Button>
          <Button asChild variant="ghost" className="h-auto rounded-full px-6 py-3.5"><Link to="/galeria">Explorar con calma</Link></Button>
        </div>
      </section>

      <section className="mt-10 grid gap-4 md:grid-cols-3">
        {pillars.map((p, i) => (
          <article key={p.k} data-perch className="night-pillar glass group rounded-3xl px-4 py-7 transition-all duration-500 hover:-translate-y-1 animate-rise" style={{ animationDelay: `${0.5 + i * 0.12}s` }}>
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
      </section>
    </main>
  );
}
