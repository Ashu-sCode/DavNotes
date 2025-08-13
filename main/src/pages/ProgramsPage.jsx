import { GraduationCap } from "lucide-react"; // icon
import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../api/firebase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ProgramCard from "../components/cards/ProgramCard";

const ProgramsPage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(
      collection(db, "resources"),
      (snapshot) => {
        const programCounts = {};
        snapshot.forEach((doc) => {
          const program = (doc.data().program || "").trim();
          if (!program) return;
          programCounts[program] = (programCounts[program] || 0) + 1;
        });

        const sortedPrograms = Object.entries(programCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

        setPrograms(sortedPrograms);
        setLoading(false);
      },
      (err) => {
        console.error("Error listening to programs:", err);
        toast.error("Failed to load programs. Please try again.");
        setLoading(false);
      }
    );
    return () => unsub();
  }, []);

  const openProgram = (programName) => {
    navigate(`/program/${encodeURIComponent(programName)}`);
  };

  const filteredPrograms = programs.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
      <h1 className="text-3xl md:text-4xl font-bold dark:text-green-100 mb-4">Courses</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Choose your course to explore semesters, subjects, and downloadable resources.
      </p>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Grid or Empty State */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-48 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      ) : filteredPrograms.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20">
          <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mb-6">
            <GraduationCap className="w-10 h-10 text-indigo-600 dark:text-indigo-300" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
            No courses available
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">
            We couldn’t find any courses right now. Try refreshing or check back later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Refresh
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPrograms.map((p) => (
            <ProgramCard
              key={p.name}
              name={p.name}
              count={p.count}
              onClick={() => openProgram(p.name)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgramsPage;
