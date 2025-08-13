import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../api/firebase";
import ResourceCard from "../components/ResourceCard";

export default function ResourcesPage() {
  const { programName, semester, subject } = useParams();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");

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
        setResources(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching resources:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, [programName, semester, subject]);

  const handleDownload = (id, url) => {
    window.open(url, "_blank");
  };

  const filteredResources =
    filterType === "all"
      ? resources
      : resources.filter((r) => r.category === filterType);

  const categories = [
    { key: "all", label: "All" },
    { key: "notes", label: "Notes" },
    { key: "pyq", label: "PYQ" },
    { key: "assignment", label: "Assignments" },
    { key: "syllabus", label: "Syllabus" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 pt-24 pb-8">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-gray-50">
        {subject} Resources
      </h1>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-3 mb-6">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setFilterType(cat.key)}
            className={`px-4 py-2 rounded-full border transition-all ${
              filterType === cat.key
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ResourceCard key={i} skeleton />
          ))}
        </div>
      ) : filteredResources.length === 0 ? (
        <p className="text-gray-500">No resources available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => (
            <ResourceCard
              key={res.id}
              resource={res}
              onDownload={handleDownload}
            />
          ))}
        </div>
      )}
    </div>
  );
}
