import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "../api/firebase";
import ProfileEditForm from "../components/admin/ProfileEditForm";
import { toast } from "react-hot-toast";
import FloatingUploadButton from "../components/admin/FAB/FloatingUploadButton";

import { User, Mail, Phone, Archive } from "lucide-react";

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3 bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
    <Icon className="text-indigo-600 dark:text-indigo-400" size={28} />
    <div>
      <p className="text-gray-500 dark:text-gray-300">{label}</p>
      <p className="text-xl font-semibold dark:text-white">{value}</p>
    </div>
  </div>
);

const ProfileDisplay = ({ profile, uploadedCount, onEdit }) => {
  const firstLetter = profile.fullName
    ? profile.fullName.charAt(0).toUpperCase()
    : "?";

  return (
    <div className="flex flex-col items-center  mt-12 space-y-6">
      {/* Profile Card */}
      <div className="bg-white dark:bg-gray-700 shadow-lg rounded-lg p-8 w-full max-w-md text-center">
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
          className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded shadow-md transition"
        >
          Edit Profile
        </button>
      </div>

      {/* Stats Grid */}
      <div className="w-full max-w-4xl  grid grid-cols-1 sm:grid-cols-2 gap-6 px-4">
        <StatCard
          icon={Archive}
          label="Resources Uploaded"
          value={uploadedCount}
        />
        {/* You can add more stat cards here if needed */}
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const { currentUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadedCount, setUploadedCount] = useState(0);

  useEffect(() => {
    if (!currentUser) return;

    const fetchProfileAndCount = async () => {
      setLoading(true);
      
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfileData(data);

        // Instead of querying resources, get uploadedCount directly from user doc
        setUploadedCount(data.uploadedCount || 0); // fallback to 0 if undefined
      } else {
        const initProfile = {
          email: currentUser.email,
          role: "admin",
          fullName: "",
          contactNumber: "",
          uploadedCount: 0, // initialize here too
          joinedAt: serverTimestamp(),
          lastLogin: serverTimestamp(),
        };
        await setDoc(docRef, initProfile);
        setProfileData(initProfile);
        setUploadedCount(0);
      }
      setLoading(false);
    };

    fetchProfileAndCount();
  }, [currentUser]);

  const handleSave = async (updatedData) => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const docRef = doc(db, "users", currentUser.uid);
      await setDoc(
        docRef,
        { ...updatedData, email: currentUser.email },
        { merge: true }
      );
      setProfileData(updatedData);
      setEditMode(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      // console.error("Error updating profile:", error);
      toast.error("Failed to update profile.");
    }
    setLoading(false);
  };

  if (loading) return <p className="p-4 text-center">Loading profile...</p>;
  if (!profileData)
    return <p className="p-4 text-center">No profile data found.</p>;

  return (
    <div className="min-h-screen flex flex-col items-center py-8 px-4 bg-gray-50 dark:bg-gray-800">
      {!editMode ? (
        <ProfileDisplay
          profile={profileData}
          uploadedCount={uploadedCount}
          onEdit={() => setEditMode(true)}
        />
      ) : (
        <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <ProfileEditForm
            profile={profileData}
            onCancel={() => setEditMode(false)}
            onSave={handleSave}
          />
        </div>
      )}
      <FloatingUploadButton />
    </div>
  );
};

export default ProfilePage;
