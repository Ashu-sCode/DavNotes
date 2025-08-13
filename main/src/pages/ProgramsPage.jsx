// src/pages/ProgramsPage.jsx
import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../api/firebase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ProgramCard from "../components/ProgramCard";

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
    <div className="max-w-6xl mx-auto px-4 py-8 pt-24">
      <h1 className="text-3xl md:text-4xl font-bold dark:text-green-100 mb-4">Courses</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Choose your course to explore semesters, subjects, and downloadable resources.
      </p>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-36 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse"
            />
          ))}
        </div>
      ) : filteredPrograms.length === 0 ? (
        <p className="text-gray-500">No programs found yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
