import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/Placeholder";

export const Route = createFileRoute("/mundo")({
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Mundo · This is for u!" },
      { name: "description", content: "El mundo que construí para ti. Muy pronto podrás entrar." },
      { property: "og:title", content: "Mundo · This is for u!" },
      { property: "og:description", content: "El mundo que construí para ti. Muy pronto podrás entrar." },
    ],
  }),
  component: () => <Placeholder title="Mundo" note="El mundo que construí para ti. Muy pronto podrás entrar." />,
});
