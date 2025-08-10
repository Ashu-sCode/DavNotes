import React from "react";
import { Download } from "lucide-react";

const FloatingDownloadButton = ({ onClick, count }) => {
  return (
    <button
      onClick={onClick}
      aria-label={`Download Selected (${count})`}
      className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition"
      title={`Download Selected (${count})`}
      disabled={count === 0}
    >
      <Download size={20} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-green-100 bg-green-800 rounded-full">
          {count}
        </span>
      )}
    </button>
  );
};

export default FloatingDownloadButton;
