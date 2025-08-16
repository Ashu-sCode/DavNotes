// src/pages/ContactPage.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, User, MessageCircle } from "lucide-react";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_CONTACT;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simple XSS-safe sanitization
    const safeData = {
      name: formData.name.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
      email: formData.email.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
      message: formData.message.replace(/</g, "&lt;").replace(/>/g, "&gt;"),
    };

    emailjs
      .send(serviceID, templateID, safeData, publicKey)
      .then(() => {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      })
      .catch(() => {
        toast.error("Failed to send message. Try again later.");
      })
      .finally(() => setLoading(false));
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl md:text-5xl font-bold text-center mb-6 dark:text-gray-50 text-gray-900"
      >
        Contact Us
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mb-12 text-gray-600 dark:text-gray-300"
      >
        Have a question or suggestion? Reach out to us! We'll get back to you as soon as possible.
      </motion.p>

      <motion.form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 md:p-12 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Name */}
        <motion.div variants={inputVariants} className="relative">
          <User className="absolute top-3 left-3 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </motion.div>

        {/* Email */}
        <motion.div variants={inputVariants} className="relative">
          <Mail className="absolute top-3 left-3 text-gray-400 dark:text-gray-500" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
        </motion.div>

        {/* Message */}
        <motion.div variants={inputVariants} className="relative">
          <MessageCircle className="absolute top-3 left-3 text-gray-400 dark:text-gray-500" />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            required
            rows={5}
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition resize-none"
          />
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 transition ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {loading ? "Sending..." : "Send Message"}
        </motion.button>
      </motion.form>
    </div>
  );
}
