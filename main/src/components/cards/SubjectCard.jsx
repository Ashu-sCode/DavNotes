// src/components/SubjectCard.jsx
import { BookOpen } from "lucide-react";
import DOMPurify from "dompurify";

export default function SubjectCard({ subject, onClick }) {
  const safeSubject = DOMPurify.sanitize(subject);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      aria-label={`Open resources for ${safeSubject}`}
      className="cursor-pointer relative rounded-xl overflow-hidden group transform transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-90 group-hover:opacity-100 transition-opacity" />

      {/* Glass overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center">
        {/* Icon */}
        <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white/20 text-white mb-4 group-hover:bg-white/30 transition-colors">
          <BookOpen size={28} aria-hidden="true" />
        </div>
        {/* Subject name */}
        <h2 className="text-lg font-semibold text-white drop-shadow-md line-clamp-2">
          {safeSubject}
        </h2>
      </div>
    </div>
  );
}
