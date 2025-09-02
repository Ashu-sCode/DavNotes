import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Spinner } from "flowbite-react";
import { useAuth } from "../context/AuthContext";
import { handleUpload } from "../hooks/useUploadResource";
import ProgressBar from "../utils/ProgressBar";
import FetchSubjects from "../utils/admin/FetchSubjects";

// ✅ Small reusable Select component
const SelectInput = ({
  name,
  value,
  onChange,
  options,
  placeholder,
  disabled,
}) => (
  <select
    name={name}
    value={value}
    onChange={onChange}
    required
    disabled={disabled}
    className="w-full p-3 border rounded-md dark:bg-gray-800 dark:text-white"
  >
    <option value="">{placeholder}</option>
    {options.map((opt) =>
      typeof opt === "object" ? (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ) : (
        <option key={opt} value={opt}>
          {opt}
        </option>
      )
    )}
  </select>
);

// ✅ FileList component with cancel functionality
const FileList = ({ files, uploadProgress, onCancel }) => (
  <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
    {files.map((f) => {
      const key = f.name + f.lastModified;
      const progress = uploadProgress[key] ?? null;

      return (
        <li key={key} className="flex flex-col space-y-1">
          <div className="flex justify-between items-center">
            <span className="truncate">📄 {f.name}</span>
            {progress !== null && (
              <button
                type="button"
                onClick={() => onCancel(key)}
                className="text-red-500 hover:underline text-xs ml-2"
              >
                Cancel
              </button>
            )}
          </div>

          {progress !== null && (
            <div>
              <div className="flex justify-between mb-1">
                <span>{progress}%</span>
              </div>
              <ProgressBar progress={progress} />
            </div>
          )}
        </li>
      );
    })}
  </ul>
);

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
    driveLink: "",
  });

  const [files, setFiles] = useState([]);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploading, setUploading] = useState(false);
  const [uploadTasks, setUploadTasks] = useState({});

  const [uploadMode, setUploadMode] = useState("file"); // ✅ new toggle

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = { ...formData, [name]: value };
    if (name === "year") updated.semester = "";
    setFormData(updated);
  };

  const validateFiles = (files) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    const maxSizeMB = 5;

    for (let file of files) {
      if (!allowedTypes.includes(file.type)) {
        setError(`❌ "${file.name}" is not supported.`);
        return false;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`⚠️ "${file.name}" exceeds ${maxSizeMB} MB.`);
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

  const cancelUpload = (fileKey) => {
    if (uploadTasks[fileKey]) {
      uploadTasks[fileKey].cancel();
      toast("⚠️ Upload cancelled.");
      setUploadProgress((prev) => {
        const copy = { ...prev };
        delete copy[fileKey];
        return copy;
      });
      setUploadTasks((prev) => {
        const copy = { ...prev };
        delete copy[fileKey];
        return copy;
      });
    }
  };

  // --- Upload ---
  const onUploadClick = async () => {
    if (uploadMode === "file" && !files.length) {
      return setError("⚠️ Select at least one file.");
    }

    if (uploadMode === "link" && !formData.driveLink.trim()) {
      return setError("⚠️ Enter a valid Google Drive link.");
    }

    const sanitized = {
      ...formData,
      title: sanitizeInput(formData.title),
      description: sanitizeInput(formData.description),
      subject: sanitizeInput(formData.subject),
    };

    try {
      setUploading(true);

      await handleUpload({
        formData: { ...sanitized, file: uploadMode === "file" ? files : [] },
        setFormData,
        setUploading,
        setUploadProgress,
        setUploadTasks,
        currentUser,
      });

      setError(null);
      setFiles([]);
    } catch (err) {
      console.error(err);
      setError("❌ Upload failed. Please try again.");
      toast.error("❌ Upload failed.");
    } finally {
      setUploading(false);
    }
  };

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

  return (
    <form className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl space-y-4">
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
      <SelectInput
        name="category"
        value={formData.category}
        onChange={handleChange}
        options={typeOptions}
        placeholder="Select Type"
      />

      {/* Program */}
      <SelectInput
        name="program"
        value={formData.program}
        onChange={handleChange}
        options={programOptions}
        placeholder="Select Program"
      />

      {/* Year */}
      <SelectInput
        name="year"
        value={formData.year}
        onChange={handleChange}
        options={yearOptions}
        placeholder="Select Year"
      />

      {/* Semester */}
      <SelectInput
        name="semester"
        value={formData.semester}
        onChange={handleChange}
        options={getSemesterOptions(formData.year).map((s) => ({
          value: s,
          label: `Semester ${s}`,
        }))}
        placeholder="Select Semester"
        disabled={!formData.year}
      />

      {/* Subject */}
      <FetchSubjects
        program={formData.program}
        semester={formData.semester}
        value={formData.subject}
        onChange={(value) =>
          setFormData((prev) => ({ ...prev, subject: value }))
        }
      />

      {/* Mode Toggle */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="file"
            checked={uploadMode === "file"}
            onChange={(e) => setUploadMode(e.target.value)}
          />
          Upload File
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            value="link"
            checked={uploadMode === "link"}
            onChange={(e) => setUploadMode(e.target.value)}
          />
          Add Drive Link
        </label>
      </div>

      {uploadMode === "file" ? (
        <>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            multiple
            onChange={handleFileChange}
            className="w-full text-sm text-gray-900 dark:text-gray-200
              file:mr-4 file:py-2 file:px-5 file:rounded-lg file:border-0
              file:bg-indigo-600 file:text-white hover:file:bg-indigo-700"
          />

          {files.length > 0 && (
            <FileList
              files={files}
              uploadProgress={uploadProgress}
              onCancel={cancelUpload}
            />
          )}
        </>
      ) : (
        <input
          type="url"
          name="driveLink"
          placeholder="Paste Google Drive link"
          value={formData.driveLink}
          onChange={handleChange}
          className="w-full p-3 border rounded-md dark:bg-gray-800 dark:text-white"
          required
        />
      )}

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
        ) : uploadMode === "file" ? (
          "Upload Resource"
        ) : (
          "Save Link"
        )}
      </button>
    </form>
  );
};

export default UploadForm;
