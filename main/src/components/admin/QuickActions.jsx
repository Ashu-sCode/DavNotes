import React from "react";
import { useNavigate } from "react-router-dom";
import { Download, PlusCircle, FolderCog } from "lucide-react";
import { toast } from "react-hot-toast";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: "Upload Resource",
      icon: <PlusCircle size={22} />,
      color: "bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-indigo-400",
      onClick: () => navigate("/admin/upload"),
    },
    {
      label: "Manage Resources",
      icon: <FolderCog size={22} />,
      color: "bg-green-600 hover:bg-green-700 focus-visible:ring-green-400",
      onClick: () => navigate("/admin/manage"),
    },
    {
      label: "Export Data",
      icon: <Download size={22} />,
      color: "bg-yellow-500 hover:bg-yellow-600 focus-visible:ring-yellow-400",
      onClick: () => toast("📤 Export feature coming soon!", { icon: "⚡" }),
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="text-xl dark:text-white font-semibold mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className={`w-full flex items-center justify-center gap-2 text-white py-3 rounded-lg shadow-sm transition transform hover:scale-105 focus:outline-none focus-visible:ring-2 ${action.color}`}
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
