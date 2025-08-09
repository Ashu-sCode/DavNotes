import React, { useEffect, useState } from "react";
import { db } from "../api/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import StatsCards from "../components/admin/StatsCards";
import RecentUploadsTable from "../components/admin/RecentUploadsTable";
import QuickActions from "../components/admin/QuickActions";
import FloatingUploadButton from "../components/admin/FloatingUploadButton";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalResources: 0,
    totalUsers: 0,
    todaysUploads: 0,
  });
  const [recentUploads, setRecentUploads] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch total resources
      const resourcesSnap = await getDocs(collection(db, "resources"));
      const usersSnap = await getDocs(collection(db, "users"));

      const today = new Date().toISOString().split("T")[0];
      let todayCount = 0;
      resourcesSnap.forEach((doc) => {
        const date = doc.data().createdAt?.toDate().toISOString().split("T")[0];
        if (date === today) todayCount++;
      });

      setStats({
        totalResources: resourcesSnap.size,
        totalUsers: usersSnap.size,
        todaysUploads: todayCount,
      });

      // Fetch recent uploads
      const q = query(collection(db, "resources"), orderBy("createdAt", "desc"), limit(5));
      const recentSnap = await getDocs(q);
      setRecentUploads(recentSnap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <StatsCards stats={stats} />
      <QuickActions />
      <RecentUploadsTable data={recentUploads} />
      <FloatingUploadButton/>
    </div>
  );
};

export default Dashboard;
