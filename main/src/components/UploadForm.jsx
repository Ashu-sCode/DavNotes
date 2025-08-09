import React from "react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Spinner } from "flowbite-react";

import { useAuth } from "../context/AuthContext";
import { handleUpload } from "../hooks/useUploadResource";

const UploadForm = () => {
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

  const { currentUser } = useAuth();

  const [error, setError] = useState(null);

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

  const [uploadProgress, setUploadProgress] = useState(0);

  const [uploading, setUploading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };

    // Reset semester if year is changed
    if (name === "year") {
      updatedData.semester = "";
    }

    setFormData(updatedData);
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;

    if (!selectedFiles || selectedFiles.length === 0) {
      setError("No file selected");
      return;
    }

    // Ensure it's always an array
    const filesArray = Array.from(selectedFiles);

    // Validate all files
    const isValid = validateBeforeUpload(filesArray);
    if (!isValid) return;

    // Update formData
    setFormData((prev) => ({
      ...prev,
      file: filesArray,
    }));
  };

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

  const validateBeforeUpload = (files) => {
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    const maxSizeInMB = 5;

    for (let file of files) {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`File "${file.name}" is not a supported format.`);
        return false;
      }
      if (file.size > maxSizeInMB * 1024 * 1024) {
        toast.error(`File "${file.name}" exceeds ${maxSizeInMB} MB.`);
        return false;
      }
    }

    return true;
  };

  return (
    <form className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-700 shadow-lg rounded-xl space-y-4">
      <h2 className="text-2xl font-semibold text-gray-700 dark:text-white">
        📤 Upload Resource
      </h2>

      {/* Category */}
      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        className="w-full p-3 border rounded-md dark:bg-gray-800 dark:text-white"
      >
        {typeOptions.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>

      {/* Program */}
      <select
        name="program"
        value={formData.program}
        onChange={handleChange}
        className="w-full p-3 border rounded-md dark:bg-gray-800 dark:text-white"
        required
      >
        <option value="">Select Program</option>
        {programOptions.map((program) => (
          <option key={program} value={program}>
            {program}
          </option>
        ))}
      </select>

      {/* Year */}
      <select
        name="year"
        value={formData.year}
        onChange={handleChange}
        className="w-full p-3 border rounded-md dark:bg-gray-800 dark:text-white"
        required
      >
        <option value="">Select Year</option>
        {yearOptions.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      {/* Semester */}
      <select
        name="semester"
        value={formData.semester}
        onChange={handleChange}
        className="w-full p-3 border rounded-md dark:bg-gray-800 dark:text-white"
        required
        disabled={!formData.year}
      >
        <option value="">Select Semester</option>
        {getSemesterOptions(formData.year).map((sem) => (
          <option key={sem} value={sem}>
            Semester {sem}
          </option>
        ))}
      </select>

      {/* Subject */}
      <input
        type="text"
        name="subject"
        placeholder="Enter Subject Name"
        value={formData.subject}
        onChange={handleChange}
        className="w-full p-3 border rounded-md dark:bg-gray-800 dark:text-white"
        required
      />

      {/* File Upload */}
      <input
        type="file"
        accept=".pdf"
        multiple
        name="file"
        onChange={handleFileChange}
        className="w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition"
      />

      {Object.entries(uploadProgress).map(([fileName, progress]) => (
        <div key={fileName} className="my-2">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            {fileName}: {progress}%
          </p>
          <div className="w-full h-2 bg-gray-200 rounded">
            <div
              className="h-2 bg-indigo-600 rounded"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 
                 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-3 px-4 
                 rounded-md transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
        disabled={uploading}
        onClick={(e) =>
          handleUpload({
            e,
            formData,
            setFormData,
            setUploading,
            setUploadProgress,
            currentUser,
          })
        }
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
