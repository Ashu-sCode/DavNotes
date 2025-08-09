import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../api/firebase";

const StatsCards = ({ stats }) => {
  const [storageBytes, setStorageBytes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStorageUsage() {
      setLoading(true);
      let total = 0;

      const snapshot = await getDocs(collection(db, "resources"));

      snapshot.forEach((doc) => {
        const data = doc.data();
        total += data.fileSize || 0;
      });

      setStorageBytes(total);
      setLoading(false);
    }

    fetchStorageUsage();
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
    { title: "Total Users", value: stats.totalUsers },
    { title: "Today's Uploads", value: stats.todaysUploads },
    { title: "Storage Used", value: loading ? "Loading..." : formatBytes(storageBytes) },
  ];

  return (
    <div className="grid grid-cols-1 dark:text-white md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
        >
          <h2 className="text-lg font-semibold">{card.title}</h2>
          <p className="text-2xl font-bold">{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
