// src/hooks/useUploadResource.js
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { getFriendlyError } from "../utils/getFriendlyError";
import { storage, db } from "../api/firebase"; // your Firebase instances
// import { useAuth } from "../context/AuthContext";



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

  if (
    !file ||
    file.length === 0 ||
    !category ||
    !program ||
    !year ||
    !semester ||
    !subject
  ) {
    toast.error("Please fill all required fields");
    return;
  }

  console.log("File details:", file.name, file.type, file.size);

  setUploading(true);
  toast.loading("📤 Uploading files...");

  try {
    const filesArray = Array.from(file); // Handle multiple files
    const yearShort = year.replace(" Year", ""); // "1st Year" → "1st"

    for (const fileItem of filesArray) {
      const extension = fileItem.name.split(".").pop();
      const timestamp = Date.now();

      const cleanFileName = `${program}_${yearShort}_${semester}_${subject}_${category}_${timestamp}.${extension}`;
      const storagePath = `resources/${program}/${year}/${semester}/${subject}/${category}/${cleanFileName}`;
      const storageRef = ref(storage, storagePath);

      console.log("📁 Starting upload to:", storagePath);

      const uploadTask = uploadBytesResumable(storageRef, fileItem);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(
              `📊 ${fileItem.name} is ${progress.toFixed(0)}% uploaded`
            );

            setUploadProgress((prev) => ({
              ...prev,
              [fileItem.name]: progress.toFixed(0),
            }));
          },
          (error) => {
            console.error(" Upload failed: ", error.code, error.message);
            const friendly = getFriendlyError(error);
           toast.error(friendly); // ✅ clean and direct
            setUploading(false);
            reject(error);
          },
          async () => {
            const fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
            console.log(`✅ Uploaded ${fileItem.name}, URL:`, fileUrl);

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
            });

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
