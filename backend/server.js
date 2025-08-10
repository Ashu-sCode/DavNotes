// server.js
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const sharp = require("sharp");
const { PDFDocument } = require("pdf-lib");

const app = express();
app.use(cors());

const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/compress-pdf", upload.single("file"), async (req, res) => {
  try {
    const fileBuffer = req.file.buffer;

    // Load PDF document
    const pdfDoc = await PDFDocument.load(fileBuffer);

    // For each embedded image, compress with sharp (example, only jpeg images)
    const embeddedImages = pdfDoc.context
      .enumerateIndirectObjects()
      .filter(
        ([ref, obj]) =>
          obj &&
          obj.constructor.name === "PDFRawStream" &&
          obj.dict.get("Subtype")?.name === "Image"
      );

    for (const [ref, imageStream] of embeddedImages) {
      try {
        const imgBytes = imageStream.contents;
        const compressedBuffer = await sharp(imgBytes)
          .jpeg({ quality: 60 })
          .toBuffer();
        imageStream.contents = compressedBuffer;
      } catch (e) {
        console.warn("Image compression failed for one image:", e);
      }
    }

    const compressedPdfBytes = await pdfDoc.save();
    res.setHeader("Content-Type", "application/pdf");
    return res.send(Buffer.from(compressedPdfBytes));
  } catch (error) {
    console.error("PDF compression failed:", error);
    return res.status(500).json({ error: "PDF compression failed" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`PDF compress backend listening on port ${PORT}`);
});
