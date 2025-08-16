// components/FloatingUploadButton.jsx
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

export default function FloatingUploadButton() {
  return (
    <Link
      to="/upload"
      className="
        fixed bottom-6 right-6
        bg-blue-600 hover:bg-blue-700
        dark:bg-blue-500 dark:hover:bg-blue-600
        text-white rounded-full
        shadow-lg shadow-gray-500/40 dark:shadow-black/50
        w-14 h-14 flex items-center justify-center
        transition-all duration-300
        hover:scale-110
        focus:outline-none focus:ring-4 
        focus:ring-blue-300 dark:focus:ring-blue-800
        z-50
      "
      title="Upload New Resource"
    >
      <Plus className="w-7 h-7" />
    </Link>
  );
}
