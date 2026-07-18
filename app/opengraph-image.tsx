import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getLandingContent } from "@/lib/content/queries";

export const alt = "Yungas Rock — eventos y música en vivo en Jujuy";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";
export const dynamic = "force-dynamic";

async function getHeroImage(imageUrl: string) {
  if (imageUrl.startsWith("http")) {
    try {
      const response = await fetch(imageUrl);
      if (response.ok) {
        const contentType = response.headers.get("content-type") || "image/jpeg";
        const buffer = Buffer.from(await response.arrayBuffer());
        return `data:${contentType};base64,${buffer.toString("base64")}`;
      }
    } catch {
      // La imagen local mantiene disponible la preview si Storage no responde.
    }
  }

  const heroBuffer = await readFile(join(process.cwd(), "public", "hero-concert.png"));
  return `data:image/png;base64,${heroBuffer.toString("base64")}`;
}

export default async function OpenGraphImage() {
  const content = await getLandingContent();
  const { event } = content;
  const [logoBuffer, hero] = await Promise.all([
    readFile(join(process.cwd(), "public", "yungas-rock-logo.jpg")),
    getHeroImage(event.heroImageUrl),
  ]);
  const logo = `data:image/jpeg;base64,${logoBuffer.toString("base64")}`;
  const title = event.whatsappTitle || event.artistName;
  const description = event.whatsappDescription || event.description;

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          overflow: "hidden",
          background: "#0b0b0a",
          color: "#f3efe4",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <img
          src={hero}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.58,
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background: "linear-gradient(90deg, rgba(5,5,4,.97) 0%, rgba(5,5,4,.78) 48%, rgba(5,5,4,.12) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 76,
            display: "flex",
            width: 26,
            height: "100%",
            background: "#ff6b00",
            transform: "skewX(-8deg)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            width: 760,
            flexDirection: "column",
            gap: 22,
            paddingLeft: 74,
          }}
        >
          <img
            src={logo}
            alt=""
            width="150"
            height="150"
            style={{ borderRadius: "50%", border: "5px solid #ff6b00" }}
          />
          <div style={{ display: "flex", color: "#ff6b00", fontSize: 24, fontWeight: 800, letterSpacing: 4 }}>
            {event.eyebrow.toUpperCase()} · YUNGAS ROCK
          </div>
          <div style={{ display: "flex", maxWidth: 720, fontSize: title.length > 28 ? 58 : 76, fontWeight: 900, lineHeight: 0.92, letterSpacing: -2, textTransform: "uppercase" }}>
            {title}
          </div>
          <div style={{ display: "flex", maxWidth: 660, fontSize: 27, fontWeight: 600 }}>
            {description.length > 135 ? `${description.slice(0, 132)}...` : description}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
