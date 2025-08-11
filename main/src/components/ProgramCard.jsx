// src/components/ProgramCard.jsx
import React from "react";
import { Users } from "lucide-react";

const ProgramCard = ({ name, count = 0, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group text-left p-6 rounded-xl bg-white dark:bg-gray-900 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-150 focus:outline-none"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300">
            <Users size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {count} resource{count !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="inline-block bg-indigo-600 text-white text-sm px-3 py-1 rounded">
            Explore
          </span>
        </div>
      </div>
    </button>
  );
};

export default ProgramCard;
