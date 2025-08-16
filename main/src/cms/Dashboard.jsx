import React, { useEffect, useState } from "react";
import { db } from "../api/firebase";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  getCountFromServer,
} from "firebase/firestore";
import StatsCards from "../components/admin/StatsCards";
import RecentUploadsTable from "../components/admin/RecentUploadsTable";
import QuickActions from "../components/admin/QuickActions";
import FloatingUploadButton from "../components/admin/FAB/FloatingUploadButton";
import ProfileFab from "../components/admin/FAB/ProfileFab";
import { toast } from "react-hot-toast";

// ----------------------------
// Skeleton Components
// ----------------------------
const StatsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"
      ></div>
    ))}
  </div>
);

const TableSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        className="h-10 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"
      ></div>
    ))}
  </div>
);

// ----------------------------
// Dashboard Component
// ----------------------------
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalResources: 0,
    totalUsers: 0,
    todaysUploads: 0,
  });
  const [recentUploads, setRecentUploads] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [uploadsLoading, setUploadsLoading] = useState(true);

  // ------------------------------
  // Fetch stats using Firestore count aggregation
  // ------------------------------
  useEffect(() => {
    const fetchStats = async () => {
      setStatsLoading(true);
      try {
        const resourcesCountSnap = await getCountFromServer(
          collection(db, "resources")
        );
        const usersCountSnap = await getCountFromServer(
          collection(db, "users")
        );

        // TODO: Replace 0 with proper daily uploads count (via query or cloud function)
        setStats({
          totalResources: resourcesCountSnap.data().count,
          totalUsers: usersCountSnap.data().count,
          todaysUploads: 0,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
        toast.error("Failed to load stats.");
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // ------------------------------
  // Fetch recent uploads (real-time)
  // ------------------------------
  useEffect(() => {
    setUploadsLoading(true);
    try {
      const q = query(
        collection(db, "resources"),
        orderBy("createdAt", "desc"),
        limit(5)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          setRecentUploads(
            snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );
          setUploadsLoading(false);
        },
        (error) => {
          console.error("Error fetching recent uploads:", error);
          toast.error("Failed to load recent uploads.");
          setUploadsLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error(err);
      setUploadsLoading(false);
      toast.error("Failed to fetch recent uploads.");
    }
  }, []);

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <h1 className="text-3xl font-bold dark:text-white">Admin Dashboard</h1>

      {/* Stats Section */}
      <div>
        {statsLoading ? <StatsSkeleton /> : <StatsCards stats={stats} />}
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Recent Uploads Section */}
      <div>
        {uploadsLoading ? (
          <TableSkeleton />
        ) : (
          <RecentUploadsTable data={recentUploads} />
        )}
      </div>

      {/* Floating FABs */}
      <ProfileFab />
      <FloatingUploadButton />
    </div>
  );
};

export default Dashboard;
