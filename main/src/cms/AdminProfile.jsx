// main/src/cms/AdminProfile.jsx
import React, { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../api/firebase";
import { useAuth } from "../context/AuthContext";
import ProfileDisplay from "../components/admin/ProfileDisplay";
import ProfileEditForm from "../components/admin/ProfileEditForm";
import { motion, AnimatePresence } from "framer-motion";

// Skeleton Loader component
const ProfileSkeleton = () => (
  <div className="p-6 animate-pulse space-y-6">
    <div className="h-8 w-48 bg-gray-300 dark:bg-gray-700 rounded"></div>
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
      <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-6 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-6 w-56 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
      <div className="h-10 w-28 bg-gray-300 dark:bg-gray-700 rounded mt-6"></div>
    </div>
  </div>
);

const AdminProfile = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [uploadedCount, setUploadedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const fetchProfile = async () => {
      try {
        const profileRef = doc(db, "users", currentUser.uid);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          setProfile(profileSnap.data());
        }

        const resRef = collection(db, "resources");
        const q = query(resRef, where("uploadedBy", "==", currentUser.uid));
        const snapshot = await getDocs(q);
        setUploadedCount(snapshot.size);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [currentUser]);

  const handleSave = async (updatedProfile) => {
    try {
      const profileRef = doc(db, "users", currentUser.uid);
      await updateDoc(profileRef, updatedProfile);
      setProfile(updatedProfile);
      setEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        No profile data found.
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 dark:text-white">Admin Profile</h1>

      <AnimatePresence mode="wait">
        {editing ? (
          <ProfileEditForm
            key="editForm"
            profile={profile}
            onCancel={() => setEditing(false)}
            onSave={handleSave}
          />
        ) : (
          <motion.div
            key="profileDisplay"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            <ProfileDisplay
              profile={profile}
              uploadedCount={uploadedCount}
              onEdit={() => setEditing(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProfile;
