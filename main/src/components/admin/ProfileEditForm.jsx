import React, { useState } from "react";
import { User, Phone } from "lucide-react";

const ProfileEditForm = ({ profile, onCancel, onSave }) => {
  const [formData, setFormData] = useState(profile);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md space-y-6"
    >
      <h2 className="text-2xl font-semibold dark:text-white mb-4">Edit Profile</h2>

      {/* Full Name */}
      <label className="block">
        <span className="text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
          <User size={18} />
          Full Name
        </span>
        <input
          type="text"
          name="fullName"
          value={formData.fullName || ""}
          onChange={handleChange}
          required
          className="w-full mt-1 p-3 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter your full name"
        />
      </label>

      {/* Contact Number */}
      <label className="block">
        <span className="text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
          <Phone size={18} />
          Contact Number
        </span>
        <input
          type="tel"
          name="contactNumber"
          value={formData.contactNumber || ""}
          onChange={handleChange}
          className="w-full mt-1 p-3 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Enter your contact number"
        />
      </label>

      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <button
          type="submit"
          className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-semibold shadow-md transition"
        >
          Save Changes
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-3 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProfileEditForm;
