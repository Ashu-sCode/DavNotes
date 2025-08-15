import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "../../api/firebase";
import { Link } from "react-router-dom";
import FloatingUploadButton from "../../components/admin/FAB/FloatingUploadButton";
import ProfileFab from "../../components/admin/FAB/ProfileFab";

import { useAuth } from "../../context/AuthContext";

export default function DashboardPage() {
  const { currentUser } = useAuth(); // Get logged in user
  const [stats, setStats] = useState({
    myTotalResources: 0,
    myTodaysUploads: 0,
    myStorageBytes: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const resourcesRef = collection(db, "resources");
    const q = query(resourcesRef, where("uploadedBy", "==", currentUser.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let total = 0;
      let todayCount = 0;
      let totalBytes = 0;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      snapshot.forEach((doc) => {
        const data = doc.data();
        total++;
        totalBytes += data.fileSize || 0;

        if (data.createdAt instanceof Timestamp) {
          const createdDate = data.createdAt.toDate();
          if (createdDate >= today) {
            todayCount++;
          }
        }
      });

      setStats({
        myTotalResources: total,
        myTodaysUploads: todayCount,
        myStorageBytes: totalBytes,
      });

      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  function formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  const cards = [
    { title: "My Total Uploads", value: stats.myTotalResources },
    { title: "Today's Uploads", value: stats.myTodaysUploads },
    { title: "Storage Used", value: formatBytes(stats.myStorageBytes) },
  ];

  return (
    <div className="p-6 space-y-8 mt-18">
      {/* Upload Rules */}
      <section className="bg-yellow-50 dark:bg-gray-800 p-4 rounded-lg border border-yellow-300 dark:border-gray-700">
        <h2 className="text-xl font-bold text-yellow-800 dark:text-yellow-300 mb-2">
          📜 Upload Rules
        </h2>
        <ul className="list-disc pl-5 text-gray-700 dark:text-gray-300 space-y-1">
          <li>Only upload files related to approved subjects & categories.</li>
          <li>Maximum file size: <strong>5MB</strong>.</li>
          <li>Allowed file types: PDF, DOCX, DOC, TXT.</li>
          <li>File names should be clear and descriptive for eg, "SubjectName - Year for Pyq.pdf".</li>
          <li>No duplicate uploads.</li>
        </ul>
      </section>

      {/* Stats */}
      <section>
        <h2 className="text-xl font-semibold mb-4 dark:text-white">📊 My Upload Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
            >
              <h3 className="text-lg font-semibold">{card.title}</h3>
              {loading ? (
                <div className="h-8 w-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
              ) : (
                <p className="text-2xl font-bold">{card.value}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Actions */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link
          to="/upload"
          className="block bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg shadow-md text-center transition"
        >
          📤 View Uploads
        </Link>
          <ProfileFab />
        <FloatingUploadButton />
      </section>
    </div>
  );
}
