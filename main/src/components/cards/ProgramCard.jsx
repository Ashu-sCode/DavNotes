import React from "react";
import { motion } from "framer-motion";
import { programData } from "../../data/data";

const ProgramCard = ({ name, count = 0, onClick }) => {
  const { icon: Icon, image, color } = programData[name] || {};

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="relative group rounded-xl overflow-hidden shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      aria-label={`Open ${name} program with ${count} resource${count !== 1 ? "s" : ""}`}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image || "/images/default.jpg"})` }}
      />

      {/* Gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t ${
          color || "from-gray-900 to-gray-700"
        } opacity-90`}
      />

      {/* Content */}
      <div className="relative p-6 flex flex-col justify-end h-48">
        {/* Icon Badge */}
        {Icon && (
          <div className="absolute -top-2 left-5 bg-white dark:bg-gray-900 p-3 rounded-xl shadow-lg">
            <Icon className="w-6 h-6 text-gray-900 dark:text-white" />
          </div>
        )}
        <h3 className="text-lg font-bold text-white">{name}</h3>
        <p className="text-sm text-gray-200">
          {count} resource{count !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Hover Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-white transition-opacity duration-300" />
    </motion.button>
  );
};

export default ProgramCard;
