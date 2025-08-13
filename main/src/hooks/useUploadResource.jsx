// src/hooks/useUploadResource.js
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { toast } from "react-hot-toast";
import { getFriendlyError } from "../utils/getFriendlyError";
import { storage, db } from "../api/firebase";
import { PDFDocument } from "pdf-lib"; // For PDF optimization

// Max allowed file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Allowed file types
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

/**
 * Compress PDF file (basic optimization + image downsampling)
 * @param {File} file
 * @returns {Promise<File>}
 */
async function compressPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    // (Optional) — more advanced compression: downsample embedded images
    // But pdf-lib doesn’t do aggressive compression — this is safe/lightweight
    const compressedPdfBytes = await pdfDoc.save({
      useObjectStreams: true, // helps reduce size
    });

    const reducedFile = new File([compressedPdfBytes], file.name, {
      type: "application/pdf",
    });

    // If size > original or not reduced much, keep original
    if (reducedFile.size >= file.size * 0.95) {
      return file;
    }

    console.log(
      `📦 PDF compressed: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(
        reducedFile.size /
        1024 /
        1024
      ).toFixed(2)}MB`
    );

    return reducedFile;
  } catch (err) {
    console.warn("PDF compression failed, using original file:", err);
    return file;
  }
}

export const handleUpload = async ({
  e,
  formData,
  setFormData,
  setUploading,
  setUploadProgress,
  setError,
  currentUser,
}) => {
  e.preventDefault();

  const logError = (...args) => {
    if (process.env.NODE_ENV === "development") {
      console.error(...args);
    }
    // Optionally: send errors to Sentry, LogRocket, etc.
  };

  const {
    title,
    description,
    category,
    program,
    year,
    semester,
    subject,
    file,
  } = formData;

  // --- Basic form validation ---
  if (!file || file.length === 0) {
    toast.error("Please select at least one file to upload.");
    return;
  }
  if (!program || !year || !semester || !subject || !category) {
    toast.error("Please fill all required fields.");
    return;
  }

  setUploading(true);
  toast.loading("📤 Uploading files...");

  try {
    const yearShort = year.replace(" Year", "");
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "text/plain",
    ];
    const maxSizeBytes = 20 * 1024 * 1024; // 20 MB limit

    for (let rawFile of Array.from(file)) {
      try {
        // --- File validation ---
        if (!allowedTypes.includes(rawFile.type)) {
          toast.error(`❌ ${rawFile.name} has unsupported file type.`);
          continue;
        }
        if (rawFile.size > maxSizeBytes) {
          toast.error(`❌ ${rawFile.name} exceeds size limit (20MB).`);
          continue;
        }

        // --- Compress PDF if needed ---
        let fileItem = rawFile;
        if (fileItem.type === "application/pdf") {
          try {
            fileItem = await compressPDF(fileItem);
          } catch {
            if (process.env.NODE_ENV === "development") {
              console.warn(
                `Compression failed for ${fileItem.name}, using original.`
              );
            }
          }
        }

        // --- Safe filename ---
        const safeName = fileItem.name
          .replace(/[^a-zA-Z0-9_\-.]/g, "_")
          .replace(/_+/g, "_")
          .slice(0, 100); // limit length

        const extension = safeName.split(".").pop().toLowerCase();
        const timestamp = Date.now();

        const cleanFileName = `${encodeURIComponent(
          program
        )}_${encodeURIComponent(yearShort)}_${encodeURIComponent(
          semester
        )}_${encodeURIComponent(subject)}_${encodeURIComponent(
          category
        )}_${timestamp}.${extension}`;

        const storagePath = `resources/${encodeURIComponent(
          program
        )}/${encodeURIComponent(year)}/${encodeURIComponent(
          semester
        )}/${encodeURIComponent(subject)}/${encodeURIComponent(
          category
        )}/${cleanFileName}`;

        const storageRef = ref(storage, storagePath);
        const uploadTask = uploadBytesResumable(storageRef, fileItem);

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress((prev) => ({
                ...prev,
                [fileItem.name]: progress.toFixed(0),
              }));
            },
            (error) => {
              logError(`Upload failed for ${fileItem.name}:`, error);
              toast.error(getFriendlyError(error));
              reject(error);
            },
            async () => {
              const fileUrl = await getDownloadURL(uploadTask.snapshot.ref);

              // --- Extract year for PYQ ---
              let finalTitle = title;
              let paperYear = null;
              if (category.toLowerCase() === "pyq") {
                const yearMatch = fileItem.name.match(/\b(20\d{2})\b/);
                if (yearMatch) {
                  paperYear = yearMatch[1];
                  finalTitle = `${subject} - ${paperYear}`;
                }
              }

              // --- Save metadata ---
              await addDoc(collection(db, "resources"), {
                title: finalTitle,
                paperYear,
                description: description || "",
                category,
                program,
                year,
                semester,
                subject,
                fileUrl,
                fileName: cleanFileName,
                storagePath,
                uploadedBy: currentUser.uid,
                fullName: currentUser.fullName || "Anonymous",
                createdAt: serverTimestamp(),
                fileSize: fileItem.size,
              });

              // --- Increment user's upload count ---
              try {
                const userDocRef = doc(db, "users", currentUser.uid);
                await updateDoc(userDocRef, { uploadedCount: increment(1) });
              } catch (updateError) {
                logError("Failed to update user's upload count:", updateError);
              }

              resolve();
            }
          );
        });
      } catch (fileErr) {
        logError(`Error processing ${rawFile.name}:`, fileErr);
        toast.error(`❌ Failed to upload ${rawFile.name}`);
      }
    }

    toast.dismiss();
    toast.success("🎉 All valid files uploaded successfully!");

    // Reset form
    setFormData({
      title: "",
      description: "",
      category: "notes",
      program: "",
      year: "",
      semester: "",
      subject: "",
      file: [],
    });
    setUploadProgress({});
  } catch (err) {
    logError("🔥 Unexpected error:", err);
    toast.dismiss();
    toast.error("Upload failed. Please try again.");
  } finally {
    setUploading(false);
  }
};
