import React from "react";
import { Trash2 } from "lucide-react";

const FloatingDeleteButton = ({ onClick, count }) => {
  return (
    <button
      onClick={onClick}
      aria-label={`Delete Selected (${count})`}
      className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition"
      title={`Delete Selected (${count})`}
    >
      <Trash2 size={20} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-800 rounded-full">
          {count}
        </span>
      )}
    </button>
  );
};

export default FloatingDeleteButton;
