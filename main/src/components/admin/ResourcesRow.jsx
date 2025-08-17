import React, { useState } from "react";
import { Edit3, Trash2, Download } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const formatBytes = (bytes) => {
  if (!bytes) return "-";
  const k = 1024,
    dm = 2,
    sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const ResourceRow = ({ resource, onEdit, onDelete, isSelected, toggleSelect }) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadClick = (e) => {
    e.preventDefault();
    if (!resource.fileUrl) return toast.error("Download URL not available.");
    if (downloading) return;

    setDownloading(true);
    try {
      // Open file in new tab
      window.open(resource.fileUrl, "_blank");
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={`border-b border-gray-300 dark:border-gray-600 transition-colors duration-200 ease-in-out ${
        isSelected
          ? "bg-indigo-100 dark:bg-indigo-800/80"
          : "hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
      tabIndex={0}
      aria-selected={isSelected}
    >
      {/* Selection Checkbox */}
      <td className="p-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={toggleSelect}
          aria-label={`Select resource ${resource.title}`}
          className="cursor-pointer"
        />
      </td>

      <td className="p-3 truncate max-w-[150px]" title={resource.title}>
        {resource.title}
      </td>
      <td className="p-3 truncate max-w-[120px]" title={resource.category}>
        {resource.category}
      </td>
      <td className="p-3 truncate max-w-[120px]" title={resource.program}>
        {resource.program}
      </td>
      <td className="p-3">{resource.year}</td>
      <td className="p-3 truncate max-w-[120px]" title={resource.subject}>
        {resource.subject}
      </td>
      <td className="p-3">{formatBytes(resource.fileSize)}</td>
      <td className="p-3">
        {resource.createdAt
          ? resource.createdAt.toDate().toLocaleDateString()
          : "-"}
      </td>

      {/* Actions */}
      <td className="p-3 flex gap-2 justify-end">
        <button
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          onClick={() => onEdit(resource)}
          aria-label={`Edit ${resource.title || "resource"}`}
        >
          <Edit3 size={16} />
        </button>
        <button
          className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          onClick={() => onDelete(resource)}
          aria-label={`Delete ${resource.title || "resource"}`}
        >
          <Trash2 size={16} />
        </button>
        <button
          onClick={handleDownloadClick}
          disabled={downloading}
          className={`p-2 rounded text-white transition ${
            downloading
              ? "bg-green-600/50 cursor-wait"
              : "bg-green-600 hover:bg-green-700"
          }`}
          aria-label={`Download ${resource.title || "resource"}`}
          title={`Download ${resource.title || "resource"}`}
        >
          {downloading ? (
            <svg
              className="animate-spin h-5 w-5 mx-auto"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          ) : (
            <Download size={16} />
          )}
        </button>
      </td>
    </motion.tr>
  );
};

export default ResourceRow;
