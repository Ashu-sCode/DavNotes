// src/components/common/ResourceCard.jsx
import React, { memo } from "react";
import {
  FileText,
  BookOpen,
  ClipboardList,
  FileArchive,
  Download,
} from "lucide-react";

/**
 * ResourceCard - displays a resource with category styling and download support.
 * @param {Object} props
 * @param {Object} props.resource - Resource object { id, title, category, fileUrl }
 * @param {Function} props.onDownload - Callback triggered on download (id, fileUrl)
 * @param {boolean} props.skeleton - Whether to render skeleton loader
 */
const ResourceCard = memo(({ resource, onDownload, skeleton = false }) => {
  // Category-specific styles
  const categoryStyles = {
    notes: {
      gradient: "from-green-500 to-emerald-600",
      icon: <BookOpen className="w-6 h-6 text-white" aria-hidden="true" />,
      badge:
        "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200",
    },
    pyq: {
      gradient: "from-blue-500 to-indigo-600",
      icon: <FileText className="w-6 h-6 text-white" aria-hidden="true" />,
      badge:
        "bg-blue-100 text-blue-700 dark:bg-blue-800 dark:text-blue-200",
    },
    assignment: {
      gradient: "from-purple-500 to-violet-600",
      icon: (
        <ClipboardList className="w-6 h-6 text-white" aria-hidden="true" />
      ),
      badge:
        "bg-purple-100 text-purple-700 dark:bg-purple-800 dark:text-purple-200",
    },
    syllabus: {
      gradient: "from-orange-500 to-amber-600",
      icon: <FileArchive className="w-6 h-6 text-white" aria-hidden="true" />,
      badge:
        "bg-orange-100 text-orange-700 dark:bg-orange-800 dark:text-orange-200",
    },
    default: {
      gradient: "from-gray-500 to-gray-700",
      icon: <FileText className="w-6 h-6 text-white" aria-hidden="true" />,
      badge:
        "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200",
    },
  };

  // Select safe style
  const style =
    resource && resource.category
      ? categoryStyles[resource.category.toLowerCase()] ||
        categoryStyles.default
      : categoryStyles.default;

  // Render skeleton loader
  if (skeleton) {
    return (
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border 
                   border-gray-200 dark:border-gray-700 p-5 animate-pulse 
                   flex flex-col gap-4"
        aria-busy="true"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          <div className="h-5 w-3/4 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="h-10 w-full bg-gray-300 dark:bg-gray-700 rounded mt-auto"></div>
      </div>
    );
  }

  // Safety guards
  const safeTitle = resource?.title || "Untitled Resource";
  const safeCategory = resource?.category || "Other";
  const safeFileUrl =
    typeof resource?.fileUrl === "string" &&
    (resource.fileUrl.startsWith("http://") ||
      resource.fileUrl.startsWith("https://"))
      ? resource.fileUrl
      : null;

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border 
                 border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg 
                 hover:-translate-y-1 transition-all flex flex-col gap-4"
      role="article"
      aria-label={`${safeTitle} resource card`}
    >
      {/* Header Row: Icon + Title + Category Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-full bg-gradient-to-r ${style.gradient} 
                        flex items-center justify-center shadow-sm`}
            aria-hidden="true"
          >
            {style.icon}
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
            {safeTitle}
          </h2>
        </div>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${style.badge}`}
        >
          {safeCategory}
        </span>
      </div>

      {/* Download Button */}
      <button
        type="button"
        onClick={() => {
          if (safeFileUrl && onDownload) {
            onDownload(resource.id, safeFileUrl);
          } else {
            console.error("Invalid file URL for download:", safeFileUrl);
          }
        }}
        disabled={!safeFileUrl}
        className="mt-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg 
                   bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-400 
                   disabled:cursor-not-allowed transition w-full text-sm font-medium"
        aria-disabled={!safeFileUrl}
        aria-label={`Download ${safeTitle}`}
      >
        <Download size={16} aria-hidden="true" />
        {safeFileUrl ? "Download" : "Unavailable"}
      </button>
    </div>
  );
});

ResourceCard.displayName = "ResourceCard";

export default ResourceCard;
