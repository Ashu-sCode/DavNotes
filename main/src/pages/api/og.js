// netlify/edge-functions/og.js
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

export default async (req, context) => {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "DavNotes";

  // Generate SVG with Satori
  const svg = await satori(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        width: "1200px",
        height: "630px",
        background: "linear-gradient(135deg, #4f46e5, #1e40af)",
        color: "white",
        fontSize: "64px",
        fontWeight: "bold",
        textAlign: "center",
      }}
    >
      DavNotes 📘
      <div style={{ fontSize: "40px", marginTop: "20px" }}>{title}</div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "Inter",
          data: await fetch(
            "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTcviYw.ttf"
          ).then((res) => res.arrayBuffer()),
          weight: 400,
          style: "normal",
        },
      ],
    }
  );

  // Convert SVG → PNG
  const png = new Resvg(svg).render().asPng();

  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
    },
  });
};
