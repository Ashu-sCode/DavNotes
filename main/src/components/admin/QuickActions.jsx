import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, PlusCircle, FolderCog, User } from "lucide-react";
import { toast } from "react-hot-toast";

const defaultActions = [
  {
    label: "Upload Resource",
    icon: <PlusCircle size={22} />,
    color:
      "bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-indigo-400 active:scale-95 active:bg-indigo-800",
    onClick: (navigate) => navigate("/upload"),
  },
  {
    label: "Manage Resources",
    icon: <FolderCog size={22} />,
    color:
      "bg-green-600 hover:bg-green-700 focus-visible:ring-green-400 active:scale-95 active:bg-green-800",
    onClick: (navigate) => navigate("/admin/manage"),
  },
  {
    label: "Export Data",
    icon: <Download size={22} />,
    color:
      "bg-yellow-500 hover:bg-yellow-600 focus-visible:ring-yellow-400 active:scale-95 active:bg-yellow-700",
    onClick: async () => {
      toast("📤 Export feature coming soon!", { icon: "⚡" });
    },
  },
  {
    label: "Manage Users",
    icon: <User size={22} />,
    color:
      "bg-purple-600 hover:bg-purple-700 focus-visible:ring-purple-400 active:scale-95 active:bg-purple-800",
    onClick: (navigate) => navigate("/admin/manage-users"),
  },
];

const QuickActions = ({ actions = defaultActions }) => {
  const navigate = useNavigate();
  const [loadingIndex, setLoadingIndex] = useState(null);

  // Handles clicks with loading state support for async handlers
  const handleClick = async (action, index) => {
    try {
      setLoadingIndex(index);
      if (action.onClick.length === 1) {
        // Pass navigate if handler expects 1 argument
        await action.onClick(navigate);
      } else {
        // Otherwise just call handler
        await action.onClick();
      }
    } catch (err) {
      console.error("Action error:", err);
      toast.error("Something went wrong");
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-full">
      <h2 className="text-xl dark:text-white font-semibold mb-4">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 w-full">
        {actions.map(({ label, icon, color }, idx) => (
          <button
            key={label}
            onClick={() => handleClick(actions[idx], idx)}
            disabled={loadingIndex === idx}
            title={label}
            aria-label={label}
            className={`w-full flex items-center justify-center gap-2 text-white py-3 rounded-lg shadow-md transition-transform duration-150 ease-in-out focus:outline-none focus-visible:ring-2 ${color} ${
              loadingIndex === idx ? "cursor-wait opacity-70" : "cursor-pointer"
            }`}
          >
            {loadingIndex === idx ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
            ) : (
              icon
            )}
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
