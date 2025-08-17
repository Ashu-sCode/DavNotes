// src/pages/ProgramsPage.jsx
import { GraduationCap } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../api/firebase";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ProgramCard from "../components/cards/ProgramCard";
import DOMPurify from "dompurify";
import { motion, AnimatePresence } from "framer-motion";

const CACHE_KEY = "programs_cache_v1";
const CACHE_TTL = 1000 * 60 * 10; // 10 minutes

const ProgramsPage = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // ---- Load from cache on mount ----
  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL) {
          setPrograms(data);
          setLoading(false); // show cached immediately
        }
      } catch (err) {
        console.warn("Failed to parse cached programs", err);
      }
    }
  }, []);

  // ---- Firestore subscription ----
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "resources"),
      (snapshot) => {
        const programCounts = {};
        snapshot.forEach((doc) => {
          const rawProgram = (doc.data()?.program || "").trim();
          if (!rawProgram) return;

          const program = DOMPurify.sanitize(rawProgram);
          if (!program) return;

          programCounts[program] = (programCounts[program] || 0) + 1;
        });

        const sortedPrograms = Object.entries(programCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

        setPrograms(sortedPrograms);
        setLoading(false);

        // update cache
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ data: sortedPrograms, timestamp: Date.now() })
        );
      },
      (err) => {
        console.error("Error fetching programs:", err);
        toast.error("Failed to load programs. Please try again.");
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const openProgram = (programName) => {
    navigate(`/program/${encodeURIComponent(programName)}`);
  };

  const sanitizedSearch = useMemo(() => DOMPurify.sanitize(search), [search]);

  const filteredPrograms = useMemo(
    () =>
      programs.filter((p) =>
        p.name.toLowerCase().includes(sanitizedSearch.toLowerCase())
      ),
    [programs, sanitizedSearch]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
      {/* Header */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold dark:text-green-100 mb-2">
        Courses
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm sm:text-base md:text-lg">
        Choose your course to explore semesters, subjects, and downloadable resources.
      </p>

      {/* Search Bar */}
      <div className="mb-8 flex justify-center sm:justify-start">
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-80 md:w-96 px-4 py-2 rounded-lg border 
                     border-gray-300 dark:border-gray-700 
                     dark:bg-gray-800 dark:text-white 
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          aria-label="Search courses"
        />
      </div>

      {/* Loading state */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-48 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse shadow-sm"
            />
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
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6 text-sm sm:text-base">
            We couldn’t find any courses right now. Try refreshing or check back later.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-md"
          >
            Refresh
          </button>
        </div>
      ) : (
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredPrograms.map((p) => (
              <motion.div
                key={p.name}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ProgramCard
                  name={p.name}
                  count={p.count}
                  onClick={() => openProgram(p.name)}
                />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default ProgramsPage;
