// src/components/ProgramCard.jsx
import React from "react";
import { programData } from "../data/data";

const ProgramCard = ({ name, count = 0, onClick }) => {
  const { icon: Icon, image, color } = programData[name] || {};
  
  return (
    <button
      onClick={onClick}
      className="relative group rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image || "/images/default.jpg"})` }}
      />
      
      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-t ${color || "from-gray-900 to-gray-700"} opacity-90`} />
      
      {/* Content */}
      <div className="relative p-6 flex flex-col justify-end h-48">
        {/* Icon Badge */}
        {Icon && (
          <div className="absolute -top-2 left-5 bg-white dark:bg-gray-900 p-3 rounded-xl shadow-lg">
            <Icon className="w-6 h-6 text-gray-900 dark:text-white" />
          </div>
        )}
        <h3 className="text-lg font-bold text-white">{name}</h3>
        <p className="text-sm text-gray-200">{count} resource{count !== 1 ? "s" : ""}</p>
      </div>

      {/* Hover Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300" />
    </button>
  );
};

export default ProgramCard;
