import React from "react";
import { User, Mail, Phone, Archive, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ProfileDisplay = ({ profile, uploadedCount, onEdit }) => {
  const firstLetter = profile.fullName ? profile.fullName.charAt(0).toUpperCase() : "?";

  return (
    <motion.div
      className="flex flex-col md:flex-row gap-6 items-center md:items-start"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Avatar Circle */}
      <motion.div
        className="w-32 h-32 rounded-full bg-indigo-600 dark:bg-indigo-400 flex items-center justify-center text-white text-6xl font-bold select-none shadow-lg"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {firstLetter}
      </motion.div>

      {/* Info Card */}
      <motion.div
        className="flex-1 space-y-4 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h1 className="text-3xl font-bold dark:text-white">{profile.fullName || "No Name Set"}</h1>

        <div className="space-y-2 text-gray-700 dark:text-gray-300">
          <p className="flex items-center gap-2">
            <Mail size={18} />
            {profile.email}
          </p>
          <p className="flex items-center gap-2">
            <Phone size={18} />
            {profile.contactNumber || "Not provided"}
          </p>
          <p className="flex items-center gap-2">
            <User size={18} />
            Role: <span className="font-semibold">{profile.role}</span>
          </p>

          {/* Uploaded Count + View Uploads */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-indigo-100 dark:bg-gray-800 px-4 py-2 rounded-lg shadow-inner">
              <Archive size={18} />
              <span className="font-semibold">
                <motion.span
                  key={uploadedCount}
                  initial={{ count: 0 }}
                  animate={{ count: uploadedCount }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  {uploadedCount}
                </motion.span>
              </span>
              <span className="ml-1 text-gray-600 dark:text-gray-300 text-sm">Uploads</span>
            </div>

            <Link to="/my-uploads">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300"
              >
                View My Uploads <ArrowRight size={16} />
              </motion.button>
            </Link>
          </div>
        </div>

        <motion.button
          onClick={onEdit}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded shadow-md transition-all duration-300"
        >
          Edit Profile
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default ProfileDisplay;
