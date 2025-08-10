import { useEffect, useState } from "react";
import { collection, doc, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "../../api/firebase";

const StatsCards = () => {
  const [stats, setStats] = useState({
    totalResources: 0,
    todaysUploads: 0,
    totalDownloads: 0,
    storageBytes: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const resourcesRef = collection(db, "resources");
    const statsDocRef = doc(db, "appStats", "global"); // your global stats doc

    // Listen for resource-related stats except downloads
    const unsubscribeResources = onSnapshot(resourcesRef, (snapshot) => {
      let totalResources = 0;
      let todaysUploads = 0;
      let totalBytes = 0;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      snapshot.forEach((doc) => {
        const data = doc.data();
        totalResources++;
        totalBytes += data.fileSize || 0;

        if (data.createdAt instanceof Timestamp) {
          const createdDate = data.createdAt.toDate();
          if (createdDate >= today) {
            todaysUploads++;
          }
        }
      });

      setStats((prev) => ({
        ...prev,
        totalResources,
        todaysUploads,
        storageBytes: totalBytes,
      }));

      setLoading(false);
    });

    // Listen for global download count from separate doc
    const unsubscribeStats = onSnapshot(statsDocRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setStats((prev) => ({
          ...prev,
          totalDownloads: data.totalDownloads || 0,
        }));
      }
    });

    return () => {
      unsubscribeResources();
      unsubscribeStats();
    };
  }, []);

  function formatBytes(bytes) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  const cards = [
    { title: "Total Resources", value: stats.totalResources },
    { title: "Today's Uploads", value: stats.todaysUploads },
    { title: "Total Downloads", value: stats.totalDownloads },
    { title: "Storage Used", value: formatBytes(stats.storageBytes) },
  ];

  return (
    <div className="grid grid-cols-1 dark:text-white md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
        >
          <h2 className="text-lg font-semibold">{card.title}</h2>
          {loading ? (
            <div className="h-8 w-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
          ) : (
            <p className="text-2xl font-bold transition-opacity duration-500">
              {card.value}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
