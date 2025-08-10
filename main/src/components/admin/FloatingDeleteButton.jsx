import React from "react";
import { Trash2 } from "lucide-react";

const FloatingDeleteButton = ({ onClick, count }) => {
  return (
    <button
      onClick={onClick}
      aria-label={`Delete Selected (${count})`}
      className="fixed bottom-24 right-6 z-50 flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition"
      title={`Delete Selected (${count})`}
    >
      <Trash2 size={20} />
      <span className="font-semibold">{count}</span>
    </button>
  );
};

export default FloatingDeleteButton;
