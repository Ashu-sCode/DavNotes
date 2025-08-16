import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../api/firebase";
import { Link } from "react-router-dom";
import FloatingUploadButton from "../../components/admin/FAB/FloatingUploadButton";
import ProfileFab from "../../components/admin/FAB/ProfileFab";
import { useAuth } from "../../context/AuthContext";
import RulesCard from "../../components/cards/RulesCard";

export default function DashboardPage() {
  const { currentUser } = useAuth();
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
      
      {/* Stats */}
      <section>
        <h2 className="text-xl font-semibold mb-4 dark:text-white">
          📊 My Upload Stats
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 dark:text-white gap-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-md transition"
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

      {/* Upload Rules */}
      <RulesCard />


      {/* Actions */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link
          to="/upload"
          className="block bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg shadow-md text-center transition"
        >
          📤 Upload New Resource
        </Link>
        <Link
          to="/my-uploads"
          className="block bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg shadow-md text-center transition"
        >
          📂 View My Uploads
        </Link>
      </section>

      {/* Floating Buttons - fixed position */}
      <ProfileFab />
      <FloatingUploadButton />
    </div>
  );
}
