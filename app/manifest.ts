import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Yungas Rock",
    short_name: "Yungas Rock",
    description: "Eventos, bandas, entradas y convocatorias de Yungas Rock en Jujuy.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b0b0a",
    theme_color: "#ff6b00",
    lang: "es-AR",
    icons: [
      {
        src: "/yungas-rock-logo.jpg",
        sizes: "120x120",
        type: "image/jpeg",
      },
    ],
  };
}
