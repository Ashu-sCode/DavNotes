// components/FloatingUploadButton.jsx
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export default function FloatingUploadButton() {
  return (
    <Link
      to="/cms/upload"
      aria-label="Upload New Resource"
      className="
        fixed bottom-6 right-6
        flex items-center justify-center
        w-14 h-14 rounded-full
        bg-blue-600 hover:bg-blue-700
        dark:bg-blue-500 dark:hover:bg-blue-600
        text-white
        shadow-lg shadow-gray-500/40 dark:shadow-black/50
        transition-transform duration-300 ease-out
        hover:scale-110 active:scale-95
        focus:outline-none focus:ring-4 
        focus:ring-blue-300 dark:focus:ring-blue-800
        z-50
      "
      title="Upload New Resource"
    >
      <Plus className="w-7 h-7" strokeWidth={2.5} />
    </Link>
  );
}
