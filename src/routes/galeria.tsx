import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/Placeholder";

export const Route = createFileRoute("/galeria")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Galería · This is for u!" },
      { name: "description", content: "Un rincón de imágenes y palabras que te recuerden lo valiosa que eres." },
      { property: "og:title", content: "Galería · This is for u!" },
      { property: "og:description", content: "Un rincón de imágenes y palabras que te recuerden lo valiosa que eres." },
    ],
  }),
  component: () => <Placeholder title="Galería" note="Un rincón de imágenes y palabras que te recuerden lo valiosa que eres." />,
});
