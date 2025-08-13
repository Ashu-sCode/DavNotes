// src/pages/SemestersPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../api/firebase";
import { GraduationCap } from "lucide-react"; // nice icon
import SemesterCard from "../components/SemesterCard";

export default function SemestersPage() {
  const { programName } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [semesters, setSemesters] = useState([]);

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const q = query(
          collection(db, "resources"),
          where("program", "==", programName)
        );
        const snapshot = await getDocs(q);

        const semesterSet = new Set();
        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.semester) semesterSet.add(data.semester);
        });

        const semesterList = Array.from(semesterSet).sort(
          (a, b) => Number(a) - Number(b)
        );

        setSemesters(semesterList);
      } catch (error) {
        console.error("Error fetching semesters:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSemesters();
  }, [programName]);

  const openSemester = (semester) => {
    navigate(`/programs/${programName}/semesters/${semester}/subjects`);
  };



  return (
    <div className="max-w-6xl mx-auto px-4 pt-24 pb-8">
      {/* Header Section */}
      <div className="relative h-48 rounded-xl overflow-hidden mb-8">
        <img
          src={`/images/${programName.toLowerCase().replace(/\s+/g, "-")}.jpg`}
          alt={programName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            {programName} - Semesters
          </h1>
          <p className="text-gray-200 mt-2">
            Choose a semester to explore subjects and resources.
          </p>
        </div>
      </div>

      {/* Grid Section */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-36 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse"
            />
          ))}
        </div>
      ) : semesters.length === 0 ? (
        <p className="text-gray-500">No semesters found for this program.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {semesters.map((sem) => (
            <SemesterCard
              key={sem}
              semester={sem}
              icon={<GraduationCap size={28} />}
              onClick={() => openSemester(sem)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
