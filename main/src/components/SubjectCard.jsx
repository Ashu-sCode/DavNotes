// src/components/SubjectCard.jsx
import { BookOpen } from "lucide-react";

export default function SubjectCard({ subject, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer relative rounded-xl overflow-hidden group transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-90 group-hover:opacity-100 transition-opacity" />

      {/* Glass overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center">
        {/* Icon */}
        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white/20 text-white mb-4 group-hover:bg-white/30 transition-colors">
          <BookOpen size={28} />
        </div>
        {/* Subject name */}
        <h2 className="text-lg font-semibold text-white drop-shadow-md">
          {subject}
        </h2>
      </div>
    </div>
  );
}
