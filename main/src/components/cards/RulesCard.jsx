import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function RulesCard() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenRules = localStorage.getItem("seenPYQRules");
    if (!hasSeenRules) {
      setIsOpen(true);
      localStorage.setItem("seenPYQRules", "true");
    }
  }, []);

  return (
    <section className="bg-yellow-50 dark:bg-gray-800 rounded-lg border border-yellow-300 dark:border-gray-700 shadow">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center bg-yellow-100 dark:bg-gray-700 px-4 py-3 border-b border-yellow-300 dark:border-gray-600 focus:outline-none"
      >
        <div className="flex items-center gap-2">
          <span className="text-2xl">📜</span>
          <h2 className="text-xl font-bold text-yellow-900 dark:text-yellow-300">
            PYQ Upload Rules
          </h2>
        </div>
        {isOpen ? (
          <ChevronUp className="text-yellow-900 dark:text-yellow-300" />
        ) : (
          <ChevronDown className="text-yellow-900 dark:text-yellow-300" />
        )}
      </button>

      {/* Animated Rules */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="rules"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <ul className="p-4 space-y-3">
              <li className="flex items-start gap-3 hover:bg-yellow-100/60 dark:hover:bg-gray-700/50 p-2 rounded transition">
                <span className="text-yellow-700 dark:text-yellow-300 text-lg">✅</span>
                <span className="text-gray-800 dark:text-gray-300">
                  Only upload PYQs related to approved subjects & categories.
                </span>
              </li>

              <li className="flex items-start gap-3 hover:bg-yellow-100/60 dark:hover:bg-gray-700/50 p-2 rounded transition">
                <span className="text-yellow-700 dark:text-yellow-300 text-lg">📏</span>
                <span className="text-gray-800 dark:text-gray-300">
                  Maximum file size: <strong>5MB</strong>.
                </span>
              </li>

              <li className="flex items-start gap-3 hover:bg-yellow-100/60 dark:hover:bg-gray-700/50 p-2 rounded transition">
                <span className="text-yellow-700 dark:text-yellow-300 text-lg">📄</span>
                <span className="text-gray-800 dark:text-gray-300">
                  Allowed file types: PDF, DOCX, DOC, TXT.
                </span>
              </li>

              <li className="flex items-start gap-3 hover:bg-yellow-100/60 dark:hover:bg-gray-700/50 p-2 rounded transition">
                <span className="text-yellow-700 dark:text-yellow-300 text-lg">📝</span>
                <span className="text-gray-800 dark:text-gray-300">
                  File names must follow the format: <em>"SubjectName - Year.pdf"</em>.
                  Example: <strong>Mathematics - 2023.pdf</strong>
                </span>
              </li>

              <li className="flex items-start gap-3 hover:bg-yellow-100/60 dark:hover:bg-gray-700/50 p-2 rounded transition">
                <span className="text-yellow-700 dark:text-yellow-300 text-lg">🚫</span>
                <span className="text-gray-800 dark:text-gray-300">
                  No duplicate uploads for the same year & subject.
                </span>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
