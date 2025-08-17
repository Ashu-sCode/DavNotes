import { useEffect, useState, useMemo } from "react";
import { collection, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "../../api/firebase";

// Utility: format bytes to human-readable units
function formatBytes(bytes) {
  if (!bytes || bytes <= 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

const StatsCards = () => {
  const [stats, setStats] = useState({
    totalResources: 0,
    todaysUploads: 0,
    totalUsers: 0,
    storageBytes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const resourcesRef = collection(db, "resources");
    const usersRef = collection(db, "users");

    let unsubscribes = [];

    try {
      // Listen for resource-related stats
      const unsubscribeResources = onSnapshot(
        resourcesRef,
        (snapshot) => {
          let totalResources = 0;
          let todaysUploads = 0;
          let totalBytes = 0;

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          snapshot.forEach((doc) => {
            const data = doc.data() || {};
            totalResources++;
            totalBytes += Number(data.fileSize) || 0;

            if (data.createdAt instanceof Timestamp) {
              const createdDate = data.createdAt.toDate();
              if (createdDate >= today) todaysUploads++;
            }
          });

          setStats((prev) => ({
            ...prev,
            totalResources,
            todaysUploads,
            storageBytes: totalBytes,
          }));
        },
        (err) => {
          console.error("Error listening to resources:", err);
          setError("Failed to fetch resources");
        }
      );

      // Listen for total users
      const unsubscribeUsers = onSnapshot(
        usersRef,
        (snapshot) => {
          setStats((prev) => ({
            ...prev,
            totalUsers: snapshot.size,
          }));
          setLoading(false);
        },
        (err) => {
          console.error("Error listening to users:", err);
          setError("Failed to fetch users");
          setLoading(false);
        }
      );

      unsubscribes = [unsubscribeResources, unsubscribeUsers];
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("Something went wrong");
      setLoading(false);
    }

    return () => {
      unsubscribes.forEach((unsub) => unsub && unsub());
    };
  }, []);

  // Prepare cards (memoized so not recalculated every render)
  const cards = useMemo(
    () => [
      { title: "Total Resources", value: stats.totalResources },
      { title: "Today's Uploads", value: stats.todaysUploads },
      { title: "Total Users", value: stats.totalUsers },
      { title: "Storage Used", value: formatBytes(stats.storageBytes) },
    ],
    [stats]
  );

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 border border-red-200 rounded-lg">
        ⚠️ {error}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 dark:text-white">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
        >
          <h2 className="text-lg font-semibold">{card.title}</h2>
          {loading ? (
            <div className="h-8 w-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
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
