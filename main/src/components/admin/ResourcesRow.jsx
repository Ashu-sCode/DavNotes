import React, { useState } from "react";
import { Trash2, Download } from "lucide-react";
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

const ResourceRow = ({ resource, onDelete, isSelected, toggleSelect }) => {
  const [downloading, setDownloading] = useState(false);

  const handleDownloadClick = (e) => {
    e.preventDefault();
    if (!resource.fileUrl) return toast.error("Download URL not available.");
    if (downloading) return;

    setDownloading(true);
    try {
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
      {/* Desktop Table */}
      <td className="p-3 hidden sm:table-cell">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={toggleSelect}
          aria-label={`Select resource ${resource.title}`}
          className="cursor-pointer"
        />
      </td>
      <td className="p-3 hidden sm:table-cell truncate max-w-[150px]" title={resource.title}>
        {resource.title}
      </td>
      <td className="p-3 hidden sm:table-cell truncate max-w-[120px]" title={resource.category}>
        {resource.category}
      </td>
      <td className="p-3 hidden sm:table-cell truncate max-w-[120px]" title={resource.program}>
        {resource.program}
      </td>
      <td className="p-3 hidden md:table-cell">{resource.year}</td>
      <td className="p-3 hidden md:table-cell truncate max-w-[120px]" title={resource.subject}>
        {resource.subject}
      </td>
      <td className="p-3 hidden lg:table-cell">{formatBytes(resource.fileSize)}</td>
      <td className="p-3 hidden lg:table-cell">
        {resource.createdAt ? resource.createdAt.toDate().toLocaleDateString() : "-"}
      </td>
      <td className="p-3 hidden sm:table-cell gap-2 justify-end flex">
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
            downloading ? "bg-green-600/50 cursor-wait" : "bg-green-600 hover:bg-green-700"
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
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
            </svg>
          ) : (
            <Download size={16} />
          )}
        </button>
      </td>

      {/* Mobile Card */}
      <td className="p-3 sm:hidden">
        <div className="flex flex-col gap-2 bg-gray-50 dark:bg-gray-800 rounded p-3 shadow-sm">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={toggleSelect}
                aria-label={`Select resource ${resource.title}`}
                className="cursor-pointer"
              />
              <span className="font-medium">{resource.title}</span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {resource.createdAt ? resource.createdAt.toDate().toLocaleDateString() : "-"}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-300">
            {resource.category && <span>📁 {resource.category}</span>}
            {resource.program && <span>🎓 {resource.program}</span>}
            {resource.year && <span>📅 {resource.year}</span>}
            {resource.subject && <span>📚 {resource.subject}</span>}
            {resource.fileSize && <span>💾 {formatBytes(resource.fileSize)}</span>}
          </div>

          <div className="flex gap-2 mt-2">
            <button
              className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition flex-1"
              onClick={() => onDelete(resource)}
            >
              <Trash2 size={16} />
            </button>
            <button
              onClick={handleDownloadClick}
              disabled={downloading}
              className={`p-2 rounded text-white transition flex-1 ${
                downloading ? "bg-green-600/50 cursor-wait" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {downloading ? (
                <svg
                  className="animate-spin h-5 w-5 mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
              ) : (
                <Download size={16} />
              )}
            </button>
          </div>
        </div>
      </td>
    </motion.tr>
  );
};

export default ResourceRow;
