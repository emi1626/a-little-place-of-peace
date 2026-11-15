import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/Placeholder";

export const Route = createFileRoute("/mundo")({
  head: () => ({
    meta: [
      { title: "Mundo · This is for u!" },
      { name: "description", content: "El mundo que construí para ti. Muy pronto podrás entrar." },
      { property: "og:title", content: "Mundo · This is for u!" },
      { property: "og:description", content: "El mundo que construí para ti. Muy pronto podrás entrar." },
    ],
  }),
  component: () => <Placeholder title="Mundo" note="El mundo que construí para ti. Muy pronto podrás entrar." />,
});
