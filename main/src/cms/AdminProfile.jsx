import React from "react";
import { User, Mail, Phone, Archive, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

/**
 * StatCard - Reusable stat card component
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
 * ProfileDisplay - Shows profile info + stats
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
          className="mx-auto w-28 h-28 rounded-full bg-indigo-600 dark:bg-indigo-400 flex items-center justify-center text-white text-7xl font-bold select-none shadow-lg"
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
      <div className="w-full max-w-4xl flex flex-wrap justify-center gap-6 px-4">
        {/* Resources Uploaded */}
        <StatCard
          icon={Archive}
          label="Resources Uploaded"
          value={uploadedCount}
        />

        {/* View My Uploads Button */}
        <Link to="/my-uploads">
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-lg shadow-md cursor-pointer transition-all min-w-[200px]"
          >
            View My Uploads <ArrowRight size={16} />
          </motion.div>
        </Link>
      </div>
    </div>
  );
};

export default ProfileDisplay;
