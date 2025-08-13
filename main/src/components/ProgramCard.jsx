import React from "react";
import { Code, Layers, PenTool, BookOpen, Notebook } from "lucide-react";

const programData = {
  BCA: {
    icon: Code,
    image: "/images/bca.jpg",
    color: "from-blue-600 to-indigo-600",
  },
  MCA: {
    icon: Layers,
    image: "/images/mca.jpg",
    color: "from-purple-600 to-pink-600",
  },
  "Graphic Design": {
    icon: PenTool,
    image: "/images/design.jpg",
    color: "from-pink-600 to-red-500",
  },
  "Business Admin": {
    icon: BookOpen,
    image: "/images/business.jpg",
    color: "from-green-600 to-emerald-600",
  },
};

const ProgramCard = ({ name, count = 0, onClick }) => {
  const program = programData[name] || {
    icon: Notebook,
    image: "/images/default-course.jpg",
    color: "from-gray-700 to-gray-900",
  };

  const Icon = program.icon;

  return (
    <button
      onClick={onClick}
      className="relative overflow-hidden rounded-2xl shadow-lg group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left w-full"
    >
      {/* Background Image */}
      <div className="relative h-40">
        <img
          src={program.image}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Overlay Gradient */}
        <div
          className={`absolute inset-0 bg-gradient-to-t ${program.color} opacity-80`}
        />
        {/* Floating Icon Badge */}
        <div className="absolute top-4 left-4 bg-white rounded-full p-3 shadow-md group-hover:scale-110 transform transition-transform duration-300">
          <Icon className="text-gray-800" size={20} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 bg-white dark:bg-gray-900">
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Program
        </p>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          {name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          {count} resource{count !== 1 ? "s" : ""}
        </p>
      </div>
    </button>
  );
};

export default ProgramCard;
