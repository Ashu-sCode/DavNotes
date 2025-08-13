import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../api/firebase";
import SubjectCard from "../components/SubjectCard";

export default function SubjectsPage() {
  const { programName, semester } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);

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

  return (
    <div className="max-w-6xl mx-auto px-4 pt-24 pb-8">
      <h1 className="text-3xl font-bold mb-4 dark:text-gray-50">
        {programName} - Semester {semester} - Subjects
      </h1>
      <p className="text-gray-600 dark:text-gray-200 mb-6">
        Choose a subject to explore resources by year.
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
      ) : subjects.length === 0 ? (
        <p className="text-gray-500">No subjects found for this semester.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((sub) => (
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
