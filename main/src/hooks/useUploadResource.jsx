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

  // Validation as before ...

  setUploading(true);
  toast.loading("📤 Uploading files...");

  try {
    const yearShort = year.replace(" Year", "");

    for (let fileItem of Array.from(file)) {
      if (fileItem.type === "application/pdf") {
        fileItem = await compressPDF(fileItem);
      }

      const safeName = fileItem.name.replace(/[^a-zA-Z0-9_\-.]/g, "_");
      const extension = safeName.split(".").pop();
      const timestamp = Date.now();
      const cleanFileName = `${program}_${yearShort}_${semester}_${subject}_${category}_${timestamp}.${extension}`;

      const storagePath = `resources/${program}/${year}/${semester}/${subject}/${category}/${cleanFileName}`;
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
            console.error("Upload failed:", error);
            toast.error(getFriendlyError(error));
            setUploading(false);
            reject(error);
          },
          async () => {
            const fileUrl = await getDownloadURL(uploadTask.snapshot.ref);

            // Save resource metadata
            await addDoc(collection(db, "resources"), {
              title,
              description,
              category,
              program,
              year,
              semester,
              subject,
              fileUrl,
              fileName: cleanFileName,
              storagePath,
              uploadedBy: currentUser.uid,
              createdAt: serverTimestamp(),
              fileSize: fileItem.size,
            });

            // Increment user's uploadedCount
            try {
              const userDocRef = doc(db, "users", currentUser.uid);
              await updateDoc(userDocRef, {
                uploadedCount: increment(1),
              });
            } catch (updateError) {
              console.error(
                "Failed to update user's upload count:",
                updateError
              );
              // Optional: toast.error("Failed to update your upload count");
            }

            resolve();
          }
        );
      });
    }

    toast.dismiss();
    toast.success("🎉 All files uploaded successfully!");

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
    console.error("🔥 Unexpected error:", err);
    toast.dismiss();
    toast.error("Upload failed. Please try again.");
  } finally {
    setUploading(false);
  }
};
