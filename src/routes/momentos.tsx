import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/Placeholder";

export const Route = createFileRoute("/momentos")({
  head: () => ({
    meta: [
      { title: "Momentos · This is for u!" },
      { name: "description", content: "Nuestra línea del tiempo, salida por salida." },
      { property: "og:title", content: "Momentos · This is for u!" },
      { property: "og:description", content: "Nuestra línea del tiempo, salida por salida." },
    ],
  }),
  component: () => <Placeholder title="Momentos" note="Nuestra línea del tiempo, salida por salida." />,
});
