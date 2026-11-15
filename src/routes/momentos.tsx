import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/Placeholder";

export const Route = createFileRoute("/momentos")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Momentos · This is for u!" },
      { name: "description", content: "Nuestra línea del tiempo, salida por salida." },
      { property: "og:title", content: "Momentos · This is for u!" },
      { property: "og:description", content: "Nuestra línea del tiempo, salida por salida." },
    ],
  }),
  component: () => <Placeholder title="Momentos" note="Nuestra línea del tiempo, salida por salida." />,
});
