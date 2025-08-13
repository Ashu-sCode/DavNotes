// src/pages/SubjectsPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../api/firebase";
import SubjectCard from "../components/SubjectCard";
import { Search } from "lucide-react";

export default function SubjectsPage() {
  const { programName, semester } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const q = query(
          collection(db, "resources"),
          where("program", "==", programName),
          where("semester", "==", semester)
        );
        const snapshot = await getDocs(q);

        const subjectSet = new Set();
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.subject) subjectSet.add(data.subject);
        });

        setSubjects(Array.from(subjectSet).sort());
      } catch (error) {
        console.error("Error fetching subjects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [programName, semester]);

  const openSubject = (subject) => {
    navigate(`/programs/${programName}/semesters/${semester}/subjects/${encodeURIComponent(subject)}/resources`);
  };

  const filteredSubjects = subjects.filter((sub) =>
    sub.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 pt-24 pb-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 dark:text-gray-50">
          {programName} - Semester {semester}
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Choose a subject to explore resources.
        </p>
      </div>

      {/* Search bar */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-3 dark:text-white text-gray-300" size={18} />
        <input
          type="text"
          placeholder="Search subjects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 dark:text-white focus:ring-indigo-500"
        />
      </div>

      {/* Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-36 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse"
            />
          ))}
        </div>
      ) : filteredSubjects.length === 0 ? (
        <p className="text-gray-500">No subjects found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((sub) => (
            <SubjectCard
              key={sub}
              subject={sub}
              onClick={() => openSubject(sub)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
