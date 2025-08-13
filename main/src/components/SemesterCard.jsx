// src/components/SemesterCard.jsx
import React from "react";

const SemesterCard = ({ semester, icon, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group p-6 rounded-xl bg-white dark:bg-gray-900 shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 w-full text-left border border-gray-200 dark:border-gray-700"
    >
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-lg font-bold shadow-md">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Semester {semester}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            View all subjects
          </p>
        </div>
      </div>
    </button>
  );
};

export default SemesterCard;
