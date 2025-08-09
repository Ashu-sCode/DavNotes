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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Upload New Resource */}
        <button
          onClick={() => navigate("/admin/upload")}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 transition"
        >
          <PlusCircle size={20} />
          Upload Resource
        </button>

        {/* Manage Resources */}
        <button
          onClick={() => navigate("/admin/manage")}
          className="flex items-center justify-center gap-2 bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition"
        >
          <FolderCog size={20} />
          Manage Resources
        </button>

        {/* Export Data */}
        <button
          onClick={handleExport}
          className="flex items-center justify-center gap-2 bg-yellow-500 text-white p-3 rounded-lg hover:bg-yellow-600 transition"
        >
          <Download size={20} />
          Export Data
        </button>

      </div>
    </div>
  );
};

export default QuickActions;
