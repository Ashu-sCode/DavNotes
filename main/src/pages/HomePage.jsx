// src/pages/LandingPage.jsx
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../api/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function LandingPage() {
  const [user, setUser] = useState(null);
  const [dashboardLink, setDashboardLink] = useState("/programs");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setDashboardLink("/programs");
        setLoading(false);
        return;
      }

      setUser(currentUser);

      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const { role } = userDoc.data(); // ← get role directly

          if (role === "admin") setDashboardLink("/admin/dashboard");
          else if (role === "uploader") setDashboardLink("/uploader/dashboard");
          else setDashboardLink("/programs"); // fallback if role unknown
        } else {
          setDashboardLink("/programs"); // fallback if no user doc
        }
      } catch (err) {
        console.error("Failed to fetch user role:", err);
        setDashboardLink("/programs");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const features = [
    {
      title: "📄 Previous Year Papers",
      description: "Access PYQs semester-wise to prepare better for exams.",
    },
    {
      title: "📝 Notes",
      description: "Find organized notes uploaded by fellow students.",
    },
    {
      title: "📚 Assignments & Syllabus",
      description:
        "Get access to syllabus and assignments for quick reference.",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <span className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-6 flex flex-col bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 text-center">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center px-6 py-16">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-700 dark:text-blue-400 mb-6"
        >
          Welcome to DavNotes 📘
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mb-10"
        >
          A platform where you can find and download previous year question
          papers, notes, assignments, and syllabus for your semester.
        </motion.p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={dashboardLink}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md text-lg font-medium transition"
          >
            {user ? "Go to Dashboard" : "Browse Resources"}
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white dark:bg-gray-900">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="p-6 rounded-xl shadow-md bg-gray-50 dark:bg-gray-800 hover:scale-105 transform transition"
            >
              <h2 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">
                {feature.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
