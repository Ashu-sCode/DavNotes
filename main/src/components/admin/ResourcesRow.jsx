import React from "react";
import { Edit3, Trash2, Download } from "lucide-react";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../../api/firebase";

const formatBytes = (bytes) => {
  if (!bytes) return "-";
  const k = 1024,
    dm = 2,
    sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const ResourceRow = ({ resource, onEdit, onDelete }) => {
  const handleDownload = async () => {
    try {
      const resourceRef = doc(db, "resources", resource.id);
      await updateDoc(resourceRef, { downloadCount: increment(1) });
      window.open(resource.fileUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error("Error tracking download:", error);
    }
  };

  return (
    <>
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
        <button
          onClick={handleDownload}
          className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
          aria-label={`Download ${resource.title || "resource"}`}
        >
          <Download size={16} />
        </button>
      </td>
    </>
  );
};

export default ResourceRow;
