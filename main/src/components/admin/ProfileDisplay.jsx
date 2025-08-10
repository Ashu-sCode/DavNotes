import React from "react";
import { User, Mail, Phone, Archive } from "lucide-react";

const ProfileDisplay = ({ profile, uploadedCount, onEdit }) => {
  const firstLetter = profile.fullName ? profile.fullName.charAt(0).toUpperCase() : "?";

  return (
    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
      {/* Avatar Circle */}
      <div className="w-32 h-32 rounded-full bg-indigo-600 dark:bg-indigo-400 flex items-center justify-center text-white text-6xl font-bold select-none">
        {firstLetter}
      </div>

      {/* Info Card */}
      <div className="flex-1 space-y-4 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md">
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
          <p className="flex items-center gap-2 ">
            <Archive size={18} />
            Resources Uploaded: <span className="font-semibold">{uploadedCount}</span>
          </p>
        </div>

        <button
          onClick={onEdit}
          className="mt-6 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded shadow-md transition"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileDisplay;
