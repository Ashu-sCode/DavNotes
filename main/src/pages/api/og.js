import { ImageResponse } from "@vercel/og";

// Set the Vercel runtime
export const config = {
  runtime: "edge",
};

export default function handler(req) {
  const { searchParams } = new URL(req.url);

  // Get dynamic parameters
  const title = searchParams.get("title") || "DavNotes";
  const subtitle = searchParams.get("subtitle") || "";
  const type = searchParams.get("type") || "general"; // home, program, semester, subject, resource

  // Optional: change colors or background based on type
  const bgColors = {
    home: "#4f46e5",
    program: "#3b82f6",
    semester: "#10b981",
    subject: "#f59e0b",
    resource: "#ef4444",
    general: "#6366f1",
  };
  const bgColor = bgColors[type] || bgColors.general;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "1200px",
          height: "630px",
          background: `linear-gradient(135deg, ${bgColor}, #1e40af)`,
          color: "white",
          fontFamily: "Arial, sans-serif",
          textAlign: "center",
          padding: "50px",
        }}
      >
        {/* Brand Logo */}
        <div style={{ fontSize: 48, fontWeight: "bold", marginBottom: 30 }}>
          DavNotes
        </div>

        {/* Page Title */}
        <div style={{ fontSize: 64, fontWeight: "bold" }}>{title}</div>

        {/* Subtitle */}
        {subtitle && <div style={{ fontSize: 40, marginTop: 20 }}>{subtitle}</div>}
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
