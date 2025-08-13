import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  increment,
} from "firebase/firestore";
import { db } from "../api/firebase";

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

  const handleDownload = async (id, url) => {
    try {
      //   await updateDoc(doc(db, "resources", id), {
      //     downloads: increment(1)
      //   });

        // await updateDoc(doc(db, "appstats", "global"), {
        //   totalDownloads: increment(1)
        // });

      window.open(url, "_blank");
    } catch (err) {
      console.error("Download error:", err);
    }
  };

  const filteredResources =
    filterType === "all"
      ? resources
      : resources.filter((r) => r.category === filterType);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{subject} Resources</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <select
          className="border p-2 rounded"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Types</option>
          <option value="notes">Notes</option>
          <option value="pyq">PYQ</option>
          <option value="assignment">Assignments</option>
          <option value="syllabus">Syllabus</option>
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : filteredResources.length === 0 ? (
        <p>No resources available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((res) => (
            <div
              key={res.id}
              className="p-4 border rounded-lg shadow hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold mb-2">{res.title}</h2>
              <p className="text-sm text-gray-500 mb-3">{res.category}</p>
              <button
                onClick={() => handleDownload(res.id, res.fileUrl)}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
