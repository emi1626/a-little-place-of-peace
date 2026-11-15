export function Placeholder({ title, note }: { title: string; note: string }) {
  return (
    <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground animate-rise">Próximamente</p>
      <h1 data-perch className="mt-4 font-display text-6xl animate-rise md:text-8xl" style={{ animationDelay: ".15s" }}>{title}</h1>
      <p className="mt-4 max-w-md text-muted-foreground animate-rise" style={{ animationDelay: ".3s" }}>{note}</p>
    </main>
  );
}
