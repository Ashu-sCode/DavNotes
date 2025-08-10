import React from "react";
import { Edit3, Trash2, Download } from "lucide-react";

const formatBytes = (bytes) => {
  if (!bytes) return "-";
  const k = 1024,
    dm = 2,
    sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const ResourceRow = ({
  resource,
  onEdit,
  onDelete,
  isSelected,
  toggleSelect,
}) => {
  return (
    <tr
      className={`border-b border-gray-300 dark:border-gray-600 ${
        isSelected ? "bg-indigo-100 dark:bg-indigo-900" : ""
      }`}
      key={resource.id}
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
   
      <td className="p-3">{resource.title}</td>
      <td className="p-3">{resource.category}</td>
      <td className="p-3">{resource.program}</td>
      <td className="p-3">{resource.year}</td>
      <td className="p-3">{resource.subject}</td>
      <td className="p-3">{formatBytes(resource.fileSize)}</td>
      <td className="p-3">
        {resource.createdAt
          ? resource.createdAt.toDate().toLocaleDateString()
          : "-"}
      </td>
      <td className="p-3 text-right flex gap-2 justify-end">
        <button
          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => onEdit(resource)}
          aria-label={`Edit ${resource.title || "resource"}`}
        >
          <Edit3 size={16} />
        </button>
        <button
          className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={() => onDelete(resource)}
          aria-label={`Delete ${resource.title || "resource"}`}
        >
          <Trash2 size={16} />
        </button>
        <a
          href={resource.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
          aria-label={`Download ${resource.title || "resource"}`}
        >
          <Download size={16} />
        </a>
      </td>
    </tr>
  );
};

export default ResourceRow;
