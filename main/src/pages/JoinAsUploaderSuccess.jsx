import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function JoinAsUploaderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [countdown, setCountdown] = useState(12); // seconds left

  // Only allow access if navigated from form submission
  useEffect(() => {
    if (!location.state || !location.state.fromForm) {
      navigate("/", { replace: true });
    }
  }, [location.state, navigate]);

  // Countdown & auto-redirect
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const timer = setTimeout(() => navigate("/", { replace: true }), 12000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-lg text-center bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8"
        role="alert"
      >
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4"
        >
          Thank you for your request!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-gray-700 dark:text-gray-300 mb-4"
        >
          Your request has been submitted successfully. Our admin team will review it, and once verified, you will receive an email with access to the uploader panel.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-gray-700 dark:text-gray-300 mb-6"
        >
          Redirecting to homepage in <span className="font-semibold">{countdown}</span> seconds.
        </motion.p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
            style={{ width: `${((12 - countdown) / 12) * 100}%` }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          <Link
            to="/"
            className="inline-block mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go to Home Now
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
