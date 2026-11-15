import { Link } from "@tanstack/react-router";
import { Home, Images, Clapperboard, CalendarHeart, Feather, Blocks, Moon, Sun } from "lucide-react";
import { useTheme } from "./theme";

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
    <nav className="glass fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-full p-1.5 md:bottom-auto md:top-5">
      {items.map(({ to, label, icon: Icon }) => (
        <Link key={to} to={to} activeOptions={{ exact: true }}
          className="group relative flex h-11 items-center gap-2 rounded-full px-3 text-muted-foreground transition-all duration-300 hover:text-foreground data-[status=active]:bg-primary data-[status=active]:text-primary-foreground md:px-4">
          <Icon className="size-[18px] transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-110" strokeWidth={1.6} />
          <span className="hidden text-sm font-medium lg:inline">{label}</span>
          <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 rounded-full bg-popover px-2.5 py-1 text-xs text-popover-foreground opacity-0 shadow transition-opacity group-hover:opacity-100 md:top-auto md:-bottom-9 lg:hidden">{label}</span>
        </Link>
      ))}
      <span className="mx-1 h-6 w-px bg-border" />
      <button onClick={toggle} aria-label="Cambiar ambiente"
        className="flex size-11 items-center justify-center rounded-full text-foreground transition-transform duration-500 hover:rotate-[25deg] hover:bg-accent">
        {theme === "dark" ? <Sun className="size-[18px]" strokeWidth={1.6} /> : <Moon className="size-[18px]" strokeWidth={1.6} />}
      </button>
    </nav>
  );
}
