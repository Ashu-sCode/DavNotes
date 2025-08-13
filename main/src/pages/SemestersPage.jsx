import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../api/firebase";
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
        snapshot.forEach(doc => {
          const data = doc.data();
          if (data.semester) semesterSet.add(data.semester);
        });

        // Convert to sorted array
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
      <h1 className="text-3xl font-bold  dark:text-gray-50 mb-4">
        {programName} - Semesters
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Choose a semester to explore subjects.
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
      ) : semesters.length === 0 ? (
        <p className="text-gray-500">No semesters found for this program.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {semesters.map((sem) => (
            <SemesterCard
              key={sem}
              semester={sem}
              onClick={() => openSemester(sem)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
