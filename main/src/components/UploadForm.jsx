import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Spinner } from "flowbite-react";

import { useAuth } from "../context/AuthContext";
import { handleUpload } from "../hooks/useUploadResource";
import ProgressBar from "../utils/ProgressBar";

const UploadForm = () => {
  const { currentUser } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "notes",
    program: "",
    year: "",
    semester: "",
    subject: "",
    file: [],
  });

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

  // --- Handle form changes ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };

    // Reset semester if year changes
    if (name === "year") updatedData.semester = "";

    setFormData(updatedData);
  };

  // --- File validation ---
  const validateBeforeUpload = (files) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    const maxSizeMB = 5;

    for (let file of files) {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`File "${file.name}" is not supported.`);
        return false;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`File "${file.name}" exceeds ${maxSizeMB} MB.`);
        return false;
      }
    }
    return true;
  };

  // --- Handle file selection ---
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) {
      setError("No file selected");
      return;
    }

    const isValid = validateBeforeUpload(files);
    if (!isValid) return;

    setError(null);
    setFormData((prev) => ({ ...prev, file: files }));
  };

  // --- Options ---
  const programOptions = ["BCA", "BBA", "BCom", "BA", "BA BEd", "BSc", "BSc (Biotech)", "MA", "MSc", "Diploma"];
  const yearOptions = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const getSemesterOptions = (year) => {
    switch (year) {
      case "1st Year": return [1, 2];
      case "2nd Year": return [3, 4];
      case "3rd Year": return [5, 6];
      case "4th Year": return [7, 8];
      default: return [];
    }
  };
  const typeOptions = [
    { value: "notes", label: "Notes" },
    { value: "assignment", label: "Assignment" },
    { value: "pyq", label: "Previous Year Question" },
    { value: "syllabus", label: "Syllabus" },
  ];

  // --- Handle upload click ---
  const onUploadClick = async () => {
    if (!formData.file.length) {
      setError("Please select at least one file to upload.");
      return;
    }

    const sanitizedData = {
      ...formData,
      title: sanitizeInput(formData.title),
      description: sanitizeInput(formData.description),
      subject: sanitizeInput(formData.subject),
    };

    try {
      setUploading(true);
      await handleUpload({
        formData: sanitizedData,
        setFormData,
        setUploading,
        setUploadProgress,
        currentUser,
      });
      toast.success("Resource uploaded successfully!");
      setError(null);
    } catch (err) {
      console.error(err);
      toast.error("Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-700 shadow-lg rounded-xl space-y-4 transition-colors duration-300">
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-white">📤 Upload Resource</h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Title */}
      <input
        type="text"
        name="title"
        placeholder="Enter Title"
        value={formData.title}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white transition-colors duration-300"
        required
      />

      {/* Category */}
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white transition-colors duration-300"
      >
        {typeOptions.map((type) => (
          <option key={type.value} value={type.value}>{type.label}</option>
        ))}
      </select>

      {/* Program */}
      <select
        name="program"
        value={formData.program}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white transition-colors duration-300"
        required
      >
        <option value="">Select Program</option>
        {programOptions.map((program) => <option key={program} value={program}>{program}</option>)}
      </select>

      {/* Year */}
      <select
        name="year"
        value={formData.year}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white transition-colors duration-300"
        required
      >
        <option value="">Select Year</option>
        {yearOptions.map((year) => <option key={year} value={year}>{year}</option>)}
      </select>

      {/* Semester */}
      <select
        name="semester"
        value={formData.semester}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white transition-colors duration-300"
        required
        disabled={!formData.year}
      >
        <option value="">Select Semester</option>
        {getSemesterOptions(formData.year).map((sem) => (
          <option key={sem} value={sem}>Semester {sem}</option>
        ))}
      </select>

      {/* Subject */}
      <input
        type="text"
        name="subject"
        placeholder="Enter Subject Name"
        value={formData.subject}
        onChange={handleChange}
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white transition-colors duration-300"
        required
      />

      {/* File Upload */}
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        multiple
        onChange={handleFileChange}
        className="w-full text-sm text-gray-900 dark:text-gray-200
               file:mr-4 file:py-2 file:px-5 file:rounded-lg file:border-0
               file:text-sm file:font-medium file:bg-indigo-600 file:text-white
               hover:file:bg-indigo-700 transition-colors duration-300"
      />

      {/* Upload Progress */}
      {Object.entries(uploadProgress).map(([fileName, progress]) => (
        <div key={fileName} className="my-4">
          <div className="flex justify-between mb-1">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[70%]">{fileName}</p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{progress}%</p>
          </div>
          <ProgressBar progress={progress} />
        </div>
      ))}

      {/* Upload Button */}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700
               dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-3 px-4
               rounded-md transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
        disabled={uploading}
        onClick={onUploadClick}
      >
        {uploading ? (
          <>
            <Spinner aria-label="Uploading resource..." size="sm" light />
            <span className="text-sm sm:text-base">Uploading...</span>
          </>
        ) : (
          "Upload Resource"
        )}
      </button>
    </form>
  );
};

export default UploadForm;
