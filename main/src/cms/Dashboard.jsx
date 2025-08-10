import React, { useEffect, useState } from "react";
import { db } from "../api/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import StatsCards from "../components/admin/StatsCards";
import RecentUploadsTable from "../components/admin/RecentUploadsTable";
import QuickActions from "../components/admin/QuickActions";
import FloatingUploadButton from "../components/admin/FloatingUploadButton";
import Spinner from "../utils/Spinner"; // ✅ Your spinner component

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalResources: 0,
    totalUsers: 0,
    todaysUploads: 0,
  });
  const [recentUploads, setRecentUploads] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [uploadsLoading, setUploadsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const resourcesSnap = await getDocs(collection(db, "resources"));
        const usersSnap = await getDocs(collection(db, "users"));

        const today = new Date().toISOString().split("T")[0];
        let todayCount = 0;
        resourcesSnap.forEach((doc) => {
          const date = doc
            .data()
            .createdAt?.toDate()
            .toISOString()
            .split("T")[0];
          if (date === today) todayCount++;
        });

        setStats({
          totalResources: resourcesSnap.size,
          totalUsers: usersSnap.size,
          todaysUploads: todayCount,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    const fetchRecentUploads = async () => {
      setUploadsLoading(true);
      try {
        const q = query(
          collection(db, "resources"),
          orderBy("createdAt", "desc"),
          limit(5)
        );
        const recentSnap = await getDocs(q);
        setRecentUploads(
          recentSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (err) {
        console.error("Error fetching recent uploads:", err);
      } finally {
        setUploadsLoading(false);
      }
    };

    fetchStats();
    fetchRecentUploads();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Stats Section */}
      <div className="relative min-h-[100px]">
        {/* Loader */}
        <div
          className={`absolute inset-0 flex justify-center items-center transition-opacity duration-500 ${
            statsLoading ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <Spinner size={40} />
        </div>

        {/* Content */}
        <div
          className={`transition-opacity duration-500 delay-100 ${
            statsLoading ? "opacity-0" : "opacity-100"
          }`}
        >
          <StatsCards stats={stats} />
        </div>
      </div>

      <QuickActions />

      {/* Recent Uploads Section */}
      <div className="relative min-h-[200px]">
        {/* Loader */}
        <div
          className={`absolute inset-0 flex justify-center items-center transition-opacity duration-500 ${
            uploadsLoading ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <Spinner size={40} />
        </div>

        {/* Content */}
        <div
          className={`transition-opacity duration-500 delay-100 ${
            uploadsLoading ? "opacity-0" : "opacity-100"
          }`}
        >
          <RecentUploadsTable data={recentUploads} />
        </div>
      </div>

      <FloatingUploadButton />
    </div>
  );
};

export default Dashboard;
