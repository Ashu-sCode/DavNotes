import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Spinner } from "flowbite-react";
import { useAuth } from "../context/AuthContext";
import { handleUpload } from "../hooks/useUploadResource";
import ProgressBar from "../utils/ProgressBar";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../api/firebase";
import FetchSubjects from "../utils/admin/FetchSubjects";

const UploadForm = () => {
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    program: "",
    year: "",
    semester: "",
    subject: "",
  });

  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploading, setUploading] = useState(false);

  // --- Input sanitization ---
  const sanitizeInput = (input) =>
    input.replace(
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
    );

  // --- Handle text/option changes ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...formData, [name]: value };
    if (name === "year") updated.semester = ""; // reset semester on year change
    setFormData(updated);
  };

  // --- File validation ---
  const validateFiles = (files) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    const maxSizeMB = 5;

    for (let file of files) {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`❌ "${file.name}" is not supported.`);
        return false;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`⚠️ "${file.name}" exceeds ${maxSizeMB} MB.`);
        return false;
      }
    }
    return true;
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return setError("Please choose a file.");

    if (!validateFiles(selected)) return;

    setError(null);
    setFiles(selected);
  };

  // -- Fetch subjects --
  async function fetchSubjects(program, semester) {
    const querySnapshot = await getDocs(
      collection(db, "resources", program, semester, "subjects")
    );
    return querySnapshot.docs.map((doc) => doc.id); // subject names = document IDs
  }

  // --- Options ---
  const programOptions = [
    "BCA",
    "BBA",
    "BCom",
    "BA",
    "BA BEd",
    "BSc",
    "BSc (Biotech)",
    "MA",
    "MSc",
    "Diploma",
  ];
  const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const getSemesterOptions = (year) => {
    switch (year) {
      case "1st Year":
        return [1, 2];
      case "2nd Year":
        return [3, 4];
      case "3rd Year":
        return [5, 6];
      case "4th Year":
        return [7, 8];
      default:
        return [];
    }
  };
  const typeOptions = [
    { value: "notes", label: "Notes" },
    { value: "assignment", label: "Assignment" },
    { value: "pyq", label: "Previous Year Question" },
    { value: "syllabus", label: "Syllabus" },
  ];

  // --- Upload ---
  const onUploadClick = async () => {
    if (!files.length) return setError("⚠️ Select at least one file.");

    const sanitized = {
      ...formData,
      title: sanitizeInput(formData.title),
      description: sanitizeInput(formData.description),
      subject: sanitizeInput(formData.subject),
    };

    try {
      setUploading(true);
      await handleUpload({
        formData: { ...sanitized, file: files },
        setFormData,
        setUploading,
        setUploadProgress,
        currentUser,
      });
      toast.success("✅ Resource uploaded!");
      setError(null);
      setFiles([]); // reset files after upload
    } catch (err) {
      console.error(err);
      toast.error("❌ Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800  rounded-xl space-y-4">
    
      {error && <p className="text-red-500 text-sm">{error}</p>}


      <input
        type="text"
        name="title"
        placeholder="Enter Title"
        value={formData.title}
        onChange={handleChange}
        className="w-full p-3 border rounded-md dark:bg-gray-800 dark:text-white"
        required
      />

      {/* Category */}
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="w-full p-3 border rounded-md dark:bg-gray-800 dark:text-white"
      >
        <option value="">Select Type</option>
        {typeOptions.map((t) => (
          <option key={t.value} value={t.value}>
            {t.label}
          </option>
        ))}
      </select>

      {/* Program */}
      <select
        name="program"
        value={formData.program}
        onChange={handleChange}
        required
        className="w-full p-3 border rounded-md dark:bg-gray-800 dark:text-white"
      >
        <option value="">Select Program</option>
        {programOptions.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      {/* Year */}
      <select
        name="year"
        value={formData.year}
        onChange={handleChange}
        required
        className="w-full p-3 border rounded-md dark:bg-gray-800 dark:text-white"
      >
        <option value="">Select Year</option>
        {yearOptions.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      {/* Semester */}
      <select
        name="semester"
        value={formData.semester}
        onChange={handleChange}
        required
        disabled={!formData.year}
        className="w-full p-3 border rounded-md dark:bg-gray-800 dark:text-white"
      >
        <option value="">Select Semester</option>
        {getSemesterOptions(formData.year).map((s) => (
          <option key={s} value={s}>
            Semester {s}
          </option>
        ))}
      </select>

      {/* Subject */}
      <FetchSubjects
        program={formData.program} // must be set in your form state
        semester={formData.semester} // must be set in your form state
        value={formData.subject} // current subject value
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, subject: value }))
        }
      />

      {/* File Upload */}
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        multiple
        onChange={handleFileChange}
        className="w-full text-sm text-gray-900 dark:text-gray-200
          file:mr-4 file:py-2 file:px-5 file:rounded-lg file:border-0
          file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
      />

      {/* Show selected files before upload */}
      {files.length > 0 && (
        <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
          {files.map((f) => (
            <li key={f.name}>📄 {f.name}</li>
          ))}
        </ul>
      )}

      {/* Upload Progress */}
      {Object.entries(uploadProgress).map(([name, progress]) => (
        <div key={name} className="my-4">
          <div className="flex justify-between mb-1">
            <p className="truncate">{name}</p>
            <span>{progress}%</span>
          </div>
          <ProgressBar progress={progress} />
        </div>
      ))}

      {/* Upload Button */}
      <button
        type="button"
        onClick={onUploadClick}
        disabled={uploading}
        className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700
          text-white font-medium py-3 px-4 rounded-md disabled:opacity-70"
      >
        {uploading ? (
          <>
            <Spinner size="sm" light />
            <span>Uploading...</span>
          </>
        ) : (
          "Upload Resource"
        )}
      </button>
    </form>
  );
};

export default UploadForm;
