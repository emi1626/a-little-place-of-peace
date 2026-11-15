import { createFileRoute } from "@tanstack/react-router";
import { Placeholder } from "@/components/Placeholder";

export const Route = createFileRoute("/videos")({
  head: () => ({
    meta: [
      { title: "Videos · This is for u!" },
      { name: "description", content: "Cosas que te hagan reír cuando el día pese un poco." },
      { property: "og:title", content: "Videos · This is for u!" },
      { property: "og:description", content: "Cosas que te hagan reír cuando el día pese un poco." },
    ],
  }),
  component: () => <Placeholder title="Videos" note="Cosas que te hagan reír cuando el día pese un poco." />,
});
