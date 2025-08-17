import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Download, PlusCircle, FolderCog, User } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const defaultActions = [
  {
    label: "Upload Resource",
    icon: <PlusCircle size={22} />,
    color: "bg-indigo-600 hover:bg-indigo-700 focus-visible:ring-indigo-400",
    onClick: (navigate) => navigate("/upload"),
  },
  {
    label: "Manage Resources",
    icon: <FolderCog size={22} />,
    color: "bg-green-600 hover:bg-green-700 focus-visible:ring-green-400",
    onClick: (navigate) => navigate("/admin/manage"),
  },
  {
    label: "Export Data",
    icon: <Download size={22} />,
    color: "bg-yellow-500 hover:bg-yellow-600 focus-visible:ring-yellow-400",
    onClick: async () => {
      toast("📤 Export feature coming soon!", { icon: "⚡" });
    },
  },
  {
    label: "Manage Users",
    icon: <User size={22} />,
    color: "bg-purple-600 hover:bg-purple-700 focus-visible:ring-purple-400",
    onClick: (navigate) => navigate("/admin/manage-users"),
  },
];

const QuickActions = ({ actions = defaultActions }) => {
  const navigate = useNavigate();
  const [loadingIndex, setLoadingIndex] = useState(null);

  const handleClick = async (action, index) => {
    try {
      setLoadingIndex(index);
      if (action.onClick.length === 1) {
        await action.onClick(navigate);
      } else {
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
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-5xl mx-auto">
      <h2 className="text-xl dark:text-white font-semibold mb-6 text-center">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {actions.map(({ label, icon, color }, idx) => (
          <motion.button
            key={label}
            onClick={() => handleClick(actions[idx], idx)}
            disabled={loadingIndex === idx}
            title={label}
            aria-label={label}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex flex-col items-center justify-center gap-2 text-white py-4 rounded-xl shadow-md transition-all duration-150 ease-in-out focus:outline-none focus-visible:ring-2 ${color} ${
              loadingIndex === idx ? "cursor-wait opacity-70" : "cursor-pointer"
            }`}
          >
            {loadingIndex === idx ? (
              <motion.div
                className="animate-spin h-6 w-6 text-white"
                style={{ borderTop: "2px solid rgba(255,255,255,0.3)", borderRight: "2px solid rgba(255,255,255,0.3)", borderBottom: "2px solid rgba(255,255,255,0.3)", borderLeft: "2px solid white", borderRadius: "50%" }}
              />
            ) : (
              icon
            )}
            <span className="font-medium">{label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
