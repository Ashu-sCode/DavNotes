import { BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../api/firebase";
import ResourceCard from "../components/cards/ResourceCard";
import { motion, AnimatePresence } from "framer-motion";
import DOMPurify from "dompurify";

export default function ResourcesPage() {
  const { programName, semester, subject } = useParams();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const navigate = useNavigate();

  const categories = [
    { key: "all", label: "All" },
    { key: "notes", label: "Notes" },
    { key: "pyq", label: "PYQ" },
    { key: "assignment", label: "Assignments" },
    { key: "syllabus", label: "Syllabus" },
  ];

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "resources"),
          where("program", "==", programName),
          where("semester", "==", semester),
          where("subject", "==", subject)
        );
        const snap = await getDocs(q);
        const fetched = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setResources(fetched);
      } catch (err) {
        console.error("Error fetching resources:", err);
        alert("Failed to load resources. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [programName, semester, subject]);

  const handleDownload = (id, url) => {
    window.open(url, "_blank");
  };

  const sanitizedFilterType = DOMPurify.sanitize(filterType);

  const filteredResources =
    sanitizedFilterType === "all"
      ? resources
      : resources.filter((r) => r.category === sanitizedFilterType);

  const categoryLabel =
    categories.find((cat) => cat.key === sanitizedFilterType)?.label || "resources";

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pt-24 pb-8">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-50">
        {DOMPurify.sanitize(subject)} Resources
      </h1>

      {/* Filter Pills */}
      <div className="flex flex-wrap justify-start gap-3 mb-6">
        {categories.map((cat) => {
          const isActive = sanitizedFilterType === cat.key;
          return (
            <button
              key={cat.key}
              onClick={() => setFilterType(cat.key)}
              className={`px-4 py-2 rounded-full border text-sm transition-all flex-1 min-w-[90px] text-center ${
                isActive
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              aria-pressed={isActive}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ResourceCard key={i} skeleton />
          ))}
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20">
          <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-6">
            <BookOpen className="w-10 h-10 text-indigo-600 dark:text-indigo-300" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            No {categoryLabel.toLowerCase()} found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">
            {sanitizedFilterType === "all"
              ? "There are no resources for this subject yet. Try checking back later."
              : `There are no ${categoryLabel.toLowerCase()} available for this subject yet.`}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Go Back
          </button>
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={sanitizedFilterType} // triggers re-animation on filter change
        >
          <AnimatePresence>
            {filteredResources.map((res) => (
              <motion.div
                key={res.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <ResourceCard
                  resource={{
                    ...res,
                    subject: DOMPurify.sanitize(res.subject),
                    category: DOMPurify.sanitize(res.category),
                    title: DOMPurify.sanitize(res.title),
                  }}
                  onDownload={handleDownload}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
