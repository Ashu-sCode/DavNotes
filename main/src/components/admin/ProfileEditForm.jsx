import React, { useState } from "react";
import { User, Phone } from "lucide-react";
import DOMPurify from "dompurify";
import { motion, AnimatePresence } from "framer-motion";

const ProfileEditForm = ({ profile, onCancel, onSave }) => {
  const [formData, setFormData] = useState(profile);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Optional: Basic phone validation
    if (name === "contactNumber" && value && !/^\+?\d{0,15}$/.test(value)) {
      setErrors((prev) => ({ ...prev, contactNumber: "Invalid phone number" }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Sanitize all string fields
    const sanitizedData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [
        key,
        typeof value === "string" ? DOMPurify.sanitize(value) : value,
      ])
    );

    // Final validation
    if (sanitizedData.fullName.trim() === "") {
      setErrors({ fullName: "Full name is required" });
      return;
    }
    if (errors.contactNumber) return;

    onSave(sanitizedData);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg space-y-6 transition-colors duration-300"
    >
      <h2 className="text-2xl font-semibold dark:text-white mb-4">Edit Profile</h2>

      {/* Full Name */}
      <label className="block">
        <span className="text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
          <User size={18} /> Full Name
        </span>
        <input
          type="text"
          name="fullName"
          value={formData.fullName || ""}
          onChange={handleChange}
          required
          placeholder="Enter your full name"
          className={`w-full mt-1 p-3 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300 ${
            errors.fullName ? "border-red-500 focus:ring-red-400" : ""
          }`}
        />
        <AnimatePresence>
          {errors.fullName && (
            <motion.p
              key="fullNameError"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-red-500 text-sm mt-1"
            >
              {errors.fullName}
            </motion.p>
          )}
        </AnimatePresence>
      </label>

      {/* Contact Number */}
      <label className="block">
        <span className="text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-2">
          <Phone size={18} /> Contact Number
        </span>
        <input
          type="tel"
          name="contactNumber"
          value={formData.contactNumber || ""}
          onChange={handleChange}
          placeholder="Enter your contact number"
          className={`w-full mt-1 p-3 border rounded-md dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300 ${
            errors.contactNumber ? "border-red-500 focus:ring-red-400" : ""
          }`}
        />
        <AnimatePresence>
          {errors.contactNumber && (
            <motion.p
              key="contactError"
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="text-red-500 text-sm mt-1"
            >
              {errors.contactNumber}
            </motion.p>
          )}
        </AnimatePresence>
      </label>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <motion.button
          type="submit"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-md font-semibold shadow-md transition-all duration-300"
        >
          Save Changes
        </motion.button>

        <motion.button
          type="button"
          onClick={onCancel}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex-1 px-6 py-3 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white transition-all duration-300"
        >
          Cancel
        </motion.button>
      </div>
    </motion.form>
  );
};

export default ProfileEditForm;
