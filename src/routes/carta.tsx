import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/Placeholder";

export const Route = createFileRoute("/carta")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Carta · This is for u!" },
      { name: "description", content: "Unas palabras que llevo tiempo queriendo decirte." },
      { property: "og:title", content: "Carta · This is for u!" },
      { property: "og:description", content: "Unas palabras que llevo tiempo queriendo decirte." },
    ],
  }),
  component: () => <Placeholder title="Carta" note="Unas palabras que llevo tiempo queriendo decirte." />,
});
