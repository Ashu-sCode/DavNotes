import React from "react";
import { useNavigate } from "react-router-dom";
import { Download, PlusCircle, FolderCog } from "lucide-react";

const QuickActions = () => {
  const navigate = useNavigate();

  const handleExport = () => {
    // TODO: Implement CSV/Excel export logic
    alert("📤 Export feature coming soon!");
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="text-xl dark:text-white font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        
        {/* Upload New Resource */}
        <button
          onClick={() => navigate("/admin/upload")}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <PlusCircle size={20} />
          Upload Resource
        </button>

        {/* Manage Resources */}
        <button
          onClick={() => navigate("/admin/manage")}
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
        >
          <FolderCog size={20} />
          Manage Resources
        </button>

        {/* Export Data */}
        <button
          onClick={handleExport}
          className="w-full flex items-center justify-center gap-2 bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400"
        >
          <Download size={20} />
          Export Data
        </button>

      </div>
    </div>
  );
};

export default QuickActions;
