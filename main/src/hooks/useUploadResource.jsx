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
import { PDFDocument } from "pdf-lib";

// --- Constants ---
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  "text/plain",
];

// --- Compress PDF ---
async function compressPDF(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);

    const compressedBytes = await pdfDoc.save({ useObjectStreams: true });

    const compressedFile = new File([compressedBytes], file.name, {
      type: "application/pdf",
    });

    if (compressedFile.size >= file.size * 0.95) return file;

    console.log(
      `📦 PDF compressed: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(
        compressedFile.size /
        1024 /
        1024
      ).toFixed(2)}MB`
    );

    return compressedFile;
  } catch (err) {
    console.warn("PDF compression failed, using original file:", err);
    return file;
  }
}

// ✅ Sanitizer
const sanitizeInput = (input) =>
  typeof input === "string"
    ? input.replace(
        /[<>&"'`]/g,
        (char) =>
          ({
            "<": "&lt;",
            ">": "&gt;",
            "&": "&amp;",
            '"': "&quot;",
            "'": "&#x27;",
            "`": "&#x60;",
          }[char])
      )
    : input;

// --- Main Upload Function ---
export const handleUpload = async ({
  e,
  formData,
  setFormData,
  setUploading,
  setUploadProgress,
  setError,
  setUploadTasks,
  currentUser,
}) => {
  if (e?.preventDefault) e.preventDefault();

  const logError = (...args) => {
    if (process.env.NODE_ENV === "development") console.error(...args);
  };

  // --- Destructure + sanitize ---
  let {
    title,
    description,
    category,
    program,
    year,
    semester,
    subject,
    file,
    driveLink,
  } = formData;

  title = sanitizeInput(title);
  description = sanitizeInput(description);
  category = sanitizeInput(category);
  program = sanitizeInput(program);
  year = sanitizeInput(year);
  semester = sanitizeInput(semester);
  subject = sanitizeInput(subject);
  driveLink = sanitizeInput(driveLink);

  if (!program || !year || !semester || !subject || !category) {
    toast.error("⚠️ Please fill all required fields.");
    return;
  }

  // -------------------------------
  // Case 1: Drive Link Upload
  // -------------------------------
  if (driveLink && !file?.length) {
    try {
      setUploading(true);
      toast.loading("🔗 Saving drive link...");

      await addDoc(collection(db, "resources"), {
        title,
        description: description || "",
        category,
        program,
        year,
        semester,
        subject,
        fileUrl: driveLink, // ✅ direct Drive link
        fileName: null,
        storagePath: null,
        uploadedBy: currentUser.uid,
        fullName: currentUser.fullName || "Anonymous",
        createdAt: serverTimestamp(),
        fileSize: null,
        isDriveLink: true, // ✅ mark clearly
      });

      // Increment user upload count
      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        await updateDoc(userDocRef, { uploadedCount: increment(1) });
      } catch (updateError) {
        logError("Failed to update user's upload count:", updateError);
      }

      toast.dismiss();
      toast.success("✅ Drive link saved successfully!");

      setFormData({
        title: "",
        description: "",
        category: "notes",
        program: "",
        year: "",
        semester: "",
        subject: "",
        file: [],
        driveLink: "",
      });
    } catch (err) {
      logError("🔥 Drive link error:", err);
      toast.dismiss();
      toast.error("❌ Failed to save drive link.");
    } finally {
      setUploading(false);
    }
    return; // ✅ Exit after link save
  }

  // -------------------------------
  // Case 2: File Upload
  // -------------------------------
  if (!file || file.length === 0) {
    toast.error("⚠️ Please select at least one file or provide a drive link.");
    return;
  }

  setUploading(true);
  toast.loading("📤 Uploading files...");

  try {
    const yearShort = year.replace(" Year", "");

    for (let rawFile of Array.from(file)) {
      try {
        // --- Validate ---
        if (!ALLOWED_TYPES.includes(rawFile.type)) {
          toast.error(`❌ ${rawFile.name} has unsupported file type.`);
          continue;
        }
        if (rawFile.size > MAX_FILE_SIZE) {
          toast.error(`❌ ${rawFile.name} exceeds size limit (20MB).`);
          continue;
        }

        let fileItem = rawFile;
        if (fileItem.type === "application/pdf") {
          fileItem = await compressPDF(fileItem);
        }

        // --- Safe naming ---
        const safeName = fileItem.name
          .replace(/[^a-zA-Z0-9_\-.]/g, "_")
          .replace(/_+/g, "_")
          .slice(0, 100);

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

        // ✅ Track active task
        setUploadTasks((prev) => ({ ...prev, [fileItem.name]: uploadTask }));

        await new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (
                (snapshot.bytesTransferred / snapshot.totalBytes) *
                100
              ).toFixed(0);
              setUploadProgress((prev) => ({
                ...prev,
                [fileItem.name]: progress,
              }));
            },
            (error) => {
              logError(`Upload failed for ${fileItem.name}:`, error);
              toast.error(getFriendlyError(error));
              reject(error);
            },
            async () => {
              const fileUrl = await getDownloadURL(uploadTask.snapshot.ref);

              let finalTitle = title;
              let paperYear = null;
              if (category.toLowerCase() === "pyq") {
                const yearMatch = fileItem.name.match(/\b(20\d{2})\b/);
                if (yearMatch) {
                  paperYear = yearMatch[1];
                  finalTitle = `${subject} - ${paperYear}`;
                }
              }

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
                isDriveLink: false, // ✅ differentiate
              });

              try {
                const userDocRef = doc(db, "users", currentUser.uid);
                await updateDoc(userDocRef, { uploadedCount: increment(1) });
              } catch (updateError) {
                logError("Failed to update user's upload count:", updateError);
              }

              // Remove completed task
              setUploadTasks((prev) => {
                const updated = { ...prev };
                delete updated[fileItem.name];
                return updated;
              });

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

    setFormData({
      title: "",
      description: "",
      category: "notes",
      program: "",
      year: "",
      semester: "",
      subject: "",
      file: [],
      driveLink: "",
    });
    setUploadProgress({});
    setUploadTasks({});
  } catch (err) {
    logError("🔥 Unexpected error:", err);
    toast.dismiss();
    toast.error("❌ Upload failed. Please try again.");
  } finally {
    setUploading(false);
  }
};
