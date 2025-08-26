// src/pages/LandingPage.jsx
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../api/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import useMeta from "../hooks/useMeta";

import { FileText, BookOpen, ClipboardList } from "lucide-react"; // icons

export default function LandingPage() {
  const [user, setUser] = useState(null);
  const [dashboardLink, setDashboardLink] = useState("/programs");
  const [loading, setLoading] = useState(true);

  const ogImage = `${window.location.origin}/.netlify/edge-functions/og?title=Welcome+to+DavNotes&type=home`;

  // ✅ Auth & User Role
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
          const { role } = userDoc.data();
          setDashboardLink(
            role === "admin"
              ? "/admin/dashboard"
              : role === "uploader"
              ? "/uploader/dashboard"
              : "/programs"
          );
        }
      } catch (err) {
        console.error("Failed to fetch user role:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const features = [
    {
      title: "Previous Year Question Papers",
      description:
        "Download semester-wise previous year question papers (PYQs) for BA, BCA, and other courses at DAV College. DavNotes makes it easy for students to access exam papers, practice tests, and solved papers to prepare effectively and score higher in exams.",
      icon: FileText,
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      title: "Study Notes",
      description:
        "Access well-structured and student-friendly notes for all subjects. Explore BCA and BA , etc... notes organized semester-wise, uploaded by verified students, to help you revise quickly and understand concepts with clarity.",
      icon: BookOpen,
      color:
        "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
    },
    {
      title: "Assignments & Syllabus",
      description:
        "Get updated semester-wise syllabus and assignments for your courses. DavNotes ensures that students always have the latest curriculum guidelines, project work, and academic tasks to stay on track throughout their degree.",
      icon: ClipboardList,
      color:
        "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",
    },
  ];

  // ✅ SEO Metadata via custom hook
  useMeta({
    title: "DavNotes | Previous Year Papers, Notes, Assignments & Syllabus",
    description:
      "Access free semester-wise resources for DAV College students, including previous year question papers (PYQs), detailed study notes, assignments, and updated syllabus. Organized and easy-to-download materials to help you prepare effectively for exams.",
    ogImage,
    url: window.location.href,
  });

  // ✅ Loading Screen
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <span className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full"></span>
      </div>
    );
  }

  return (
    <main className="min-h-screen  flex flex-col bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 text-center">
      {/* Hero Section */}
      <section className="flex-1 mt-6 flex flex-col justify-center items-center px-6 py-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-700 dark:text-blue-400 mb-6"
        >
          Welcome to DavNotes 📘
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mb-10"
        >
          A platform where you can find and download previous year question
          papers, notes, assignments, and syllabus for your semester.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            to={dashboardLink}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md text-lg font-medium transition"
          >
            {user ? "Go to Dashboard" : "Browse Resources"}
          </Link>
        </motion.div>
      </section>

      {/* Features Section (Redesigned) */}
      <section className="py-16 px-6 bg-gray-50 dark:bg-gray-900 text-left">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-blue-700 dark:text-blue-400 mb-12">
            What You’ll Find on DavNotes
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex flex-col items-start p-6 rounded-xl border border-gray-200 dark:border-gray-700 
                             bg-white dark:bg-gray-800 shadow-sm"
                >
                  <div
                    className={`w-12 h-12 flex items-center justify-center rounded-full mb-4 ${feature.color}`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
