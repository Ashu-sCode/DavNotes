// src/components/common/ProgramCard.jsx
import React, { memo, useState } from "react";
import { motion } from "framer-motion";
import DOMPurify from "dompurify";
import { programData } from "../../data/Data";
import { GraduationCap } from "lucide-react";

const ProgramCard = memo(({ name, count = 0, onClick }) => {
  const [loaded, setLoaded] = useState(false);
  const program = programData[name] || {};
  const { icon: Icon = GraduationCap, image, color } = program;

  // ✅ Sanitize image
  const safeImage =
    typeof image === "string" &&
    (image.startsWith("/") || image.startsWith("http"))
      ? DOMPurify.sanitize(image)
      : "/images/default.jpg";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className="relative group rounded-xl overflow-hidden shadow-lg 
                 transition-all duration-300 focus:outline-none 
                 focus:ring-2 focus:ring-indigo-500 w-full"
      aria-label={`Open ${name} program with ${count} resource${count !== 1 ? "s" : ""}`}
    >
      {/* Background image wrapper */}
      <div className="absolute inset-0">
        {/* ✅ Low-quality blur placeholder */}
        <div
          className={`absolute inset-0 bg-gray-300 dark:bg-gray-700 animate-pulse ${
            loaded ? "opacity-0" : "opacity-100"
          } transition-opacity duration-500`}
        />

        <img
          src={safeImage}
          srcSet={`${safeImage}?w=400 400w, ${safeImage}?w=800 800w`}
          sizes="(max-width: 640px) 100vw, 50vw"
          alt={`${name} program background`}
          className={`w-full h-full object-cover transition-opacity duration-700 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
        />
      </div>

      {/* Gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t ${
          color || "from-gray-900 to-gray-700"
        } opacity-90`}
      />

      {/* Content */}
      <div className="relative p-6 flex flex-col justify-end h-48">
        {Icon && (
          <div
            className="absolute -top-2 left-5 bg-white dark:bg-gray-900 
                       p-3 rounded-xl shadow-lg flex items-center justify-center"
          >
            <Icon className="w-6 h-6 text-gray-900 dark:text-white" aria-hidden="true" />
          </div>
        )}
        <h3 className="text-lg font-bold text-white drop-shadow-sm line-clamp-1">
          {name}
        </h3>
        <p className="text-sm text-gray-200">
          {count} resource{count !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Hover Glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-20 
                   bg-white transition-opacity duration-300"
      />
    </motion.button>
  );
});

ProgramCard.displayName = "ProgramCard";

export default ProgramCard;
