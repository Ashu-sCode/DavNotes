import React from "react";
import { Edit3, Trash2, Download } from "lucide-react";
import { doc, runTransaction, increment } from "firebase/firestore";
import { db } from "../../api/firebase";
import { toast } from "react-hot-toast";

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
  // Handle download and increment downloadCount in Firestore
  const handleDownloadClick = async (e) => {
    e.preventDefault();

    if (!resource.fileUrl) {
      toast.error("Download URL not available.");
      return;
    }
    try {
      const resourceRef = doc(db, "resources", resource.id);
      const statsDocRef = doc(db, "appStats", "global");

      await runTransaction(db, async (transaction) => {
        const resourceDoc = await transaction.get(resourceRef);
        const statsDoc = await transaction.get(statsDocRef);

        if (!resourceDoc.exists()) {
          throw new Error("Resource not found!");
        }

        // Increment resource download count or set to 1 if missing
        const currentResourceDownloads = resourceDoc.data().downloadCount || 0;
        transaction.update(resourceRef, {
          downloadCount: currentResourceDownloads + 1,
        });

        // Increment global totalDownloads or set to 1 if missing
        const currentTotalDownloads = statsDoc.exists()
          ? statsDoc.data().totalDownloads || 0
          : 0;

        transaction.set(
          statsDocRef,
          { totalDownloads: currentTotalDownloads + 1 },
          { merge: true }
        );
      });

      // Trigger actual file download in a new tab
      window.open(resource.fileUrl, "_blank");
    } catch (error) {
      console.error("Error updating download count:", error);
      toast.error("Failed to update download count.");
    }
  };

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
        <button
          onClick={handleDownloadClick}
          className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
          aria-label={`Download ${resource.title || "resource"}`}
          title={`Download ${resource.title || "resource"}`}
        >
          <Download size={16} />
        </button>
      </td>
    </tr>
  );
};

export default ResourceRow;
