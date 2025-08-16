import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../api/firebase";
import ProfileEditForm from "../components/admin/ProfileEditForm";
import { toast } from "react-hot-toast";
import FloatingUploadButton from "../components/admin/FAB/FloatingUploadButton";

import { User, Mail, Phone, Archive } from "lucide-react";

/**
 * StatCard - A reusable component to display a statistic with an icon, label, and value.
 */
const StatCard = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md transition transform hover:scale-105">
    <Icon className="text-indigo-600 dark:text-indigo-400" size={28} />
    <div>
      <p className="text-gray-500 dark:text-gray-300">{label}</p>
      <p className="text-xl font-semibold dark:text-white">{value}</p>
    </div>
  </div>
);

/**
 * ProfileDisplay - Displays user's profile information and stats.
 */
const ProfileDisplay = ({ profile, uploadedCount, onEdit }) => {
  const firstLetter = profile.fullName
    ? profile.fullName.charAt(0).toUpperCase()
    : "?";

  return (
    <div className="flex flex-col items-center mt-12 space-y-6 w-full">
      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-700 shadow-lg rounded-lg p-8 w-full max-w-md text-center transition-all">
        <div
          className="mx-auto w-28 h-28 rounded-full bg-indigo-600 dark:bg-indigo-400 flex items-center justify-center text-white text-7xl font-bold select-none"
          aria-label="Profile Initial"
        >
          {firstLetter}
        </div>
        <h1 className="mt-4 text-3xl font-bold dark:text-white">
          {profile.fullName || "No Name Set"}
        </h1>
        <p className="mt-1 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
          <Mail size={16} /> {profile.email}
        </p>
        <p className="mt-1 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
          <Phone size={16} /> {profile.contactNumber || "Not provided"}
        </p>
        <p className="mt-1 flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
          <User size={16} /> Role:{" "}
          <span className="font-semibold">{profile.role}</span>
        </p>

        <button
          onClick={onEdit}
          className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded shadow-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Edit Profile
        </button>
      </div>

      {/* Stats Grid */}
      <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-6 px-4">
        <StatCard icon={Archive} label="Resources Uploaded" value={uploadedCount} />
        {/* Add more stat cards if needed */}
      </div>
    </div>
  );
};

/**
 * ProfilePage - Main component to display and edit user profile.
 */
const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadedCount, setUploadedCount] = useState(0);

  /**
   * Fetches user profile from Firestore.
   * Initializes profile if it doesn't exist.
   */
  useEffect(() => {
    if (!currentUser) return;

    const fetchProfile = async () => {
      setLoading(true);

      try {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileData(data);
          setUploadedCount(data.uploadedCount || 0);
        } else {
          // Initialize new user profile
          const initProfile = {
            email: currentUser.email,
            role: "admin", // default role, adjust as per your app
            fullName: "",
            contactNumber: "",
            uploadedCount: 0,
            joinedAt: serverTimestamp(),
            lastLogin: serverTimestamp(),
          };
          await setDoc(docRef, initProfile);
          setProfileData(initProfile);
          setUploadedCount(0);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to fetch profile. Please refresh.");
      }

      setLoading(false);
    };

    fetchProfile();
  }, [currentUser]);

  /**
   * Handles profile updates.
   * Merges changes into existing Firestore document.
   */
  const handleSave = async (updatedData) => {
    if (!currentUser) return;
    setLoading(true);

    try {
      const docRef = doc(db, "users", currentUser.uid);
      await setDoc(docRef, { ...updatedData, email: currentUser.email }, { merge: true });
      setProfileData({ ...profileData, ...updatedData });
      setEditMode(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }

    setLoading(false);
  };

  if (loading) return <p className="p-4 text-center">Loading profile...</p>;
  if (!profileData) return <p className="p-4 text-center">No profile data found.</p>;

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 bg-gray-50 dark:bg-gray-800 transition-colors">
      {!editMode ? (
        <ProfileDisplay
          profile={profileData}
          uploadedCount={uploadedCount}
          onEdit={() => setEditMode(true)}
        />
      ) : (
        <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-transform">
          <ProfileEditForm
            profile={profileData}
            onCancel={() => setEditMode(false)}
            onSave={handleSave}
          />
        </div>
      )}

      {/* Floating Upload Button */}
      <FloatingUploadButton />
    </div>
  );
};

export default ProfilePage;
