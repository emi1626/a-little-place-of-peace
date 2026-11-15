import { Link } from "@tanstack/react-router";
import { Home, Images, Clapperboard, CalendarHeart, Feather, Blocks, Moon, Sun } from "lucide-react";
import { useTheme } from "./theme";
import { Button } from "@/components/ui/button";

const items = [
  { to: "/", label: "Inicio", icon: Home },
  { to: "/galeria", label: "Galería", icon: Images },
  { to: "/videos", label: "Videos", icon: Clapperboard },
  { to: "/momentos", label: "Momentos", icon: CalendarHeart },
  { to: "/carta", label: "Carta", icon: Feather },
  { to: "/mundo", label: "Mundo", icon: Blocks },
] as const;

export function Dock() {
  const { theme, toggle } = useTheme();
  return (
    <>
    <header className="mobile-sky-header fixed inset-x-0 top-0 z-30 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-6 py-5 md:hidden">
      <Link to="/" className="min-w-0 truncate font-display text-2xl">This is for u<span className="text-primary">.</span></Link>
      <span className="flex shrink-0 items-center gap-2 text-[10px] uppercase tracking-normal text-muted-foreground"><span className="size-1 rounded-full bg-primary" />{theme === "dark" ? "Bajo las estrellas" : "Luz de tarde"}</span>
    </header>
    <nav aria-label="Navegación principal" className="glass fixed bottom-4 left-1/2 z-40 flex max-w-[calc(100vw-1rem)] -translate-x-1/2 items-center gap-0 rounded-full p-1 md:bottom-auto md:top-5 md:gap-1 md:p-1.5">
      {items.map(({ to, label, icon: Icon }) => (
        <Link key={to} to={to} activeOptions={{ exact: true }}
          aria-label={label} className="group relative flex h-11 min-w-0 shrink-0 items-center gap-2 rounded-full px-2.5 text-muted-foreground transition-all duration-300 hover:text-foreground data-[status=active]:bg-primary data-[status=active]:text-primary-foreground md:px-4">
          <Icon className="size-[18px] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110" strokeWidth={1.6} />
          <span className="hidden text-sm font-medium lg:inline">{label}</span>
          <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-full bg-popover px-2.5 py-1 text-xs text-popover-foreground opacity-0 shadow transition-opacity group-hover:opacity-100 md:top-auto md:-bottom-9 lg:hidden">{label}</span>
        </Link>
      ))}
      <span className="mx-1 h-6 w-px bg-border" />
      <Button variant="ghost" size="icon" onClick={toggle} aria-label="Cambiar ambiente" title="Cambiar ambiente"
        className="size-10 shrink-0 rounded-full text-foreground transition-transform duration-500 hover:rotate-[25deg]">
        {theme === "dark" ? <Sun className="size-[18px]" strokeWidth={1.6} /> : <Moon className="size-[18px]" strokeWidth={1.6} />}
      </Button>
    </nav>
    </>
  );
}
