// src/pages/ProgramsPage.jsx
import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../api/firebase"; // adjust path if needed
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ProgramCard from "../components/ProgramCard";

const ProgramsPage = () => {
  const [programs, setPrograms] = useState([]); // { name, count }
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(
      collection(db, "resources"),
      (snapshot) => {
        const counts = new Map();
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          const program = (data.program || "").trim();
          if (!program) return; // skip empty
          counts.set(program, (counts.get(program) || 0) + 1);
        });

        const arr = Array.from(counts.entries()).map(([name, count]) => ({
          name,
          count,
        }));

        // Sort by count desc then name
        arr.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

        setPrograms(arr);
        setLoading(false);
      },
      (err) => {
        console.error("Error listening programs:", err);
        toast.error("Failed to load programs. Check Firestore rules.");
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  const openProgram = (programName) => {
    const encoded = encodeURIComponent(programName);
    navigate(`/program/${encoded}`); // next step: semesters page for program
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pt-24">
      <h1 className="text-3xl md:text-4xl font-bold dark:text-green-100 mb-4">Programs</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Choose your program to explore semesters, subjects and downloadable resources.
      </p>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-36 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse"
            />
          ))}
        </div>
      ) : programs.length === 0 ? (
        <p className="text-gray-500">No programs found yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {programs.map((p) => (
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
