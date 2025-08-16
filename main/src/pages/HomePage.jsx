// LandingPage.jsx
import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../api/firebase";
import { Link } from "react-router-dom";

export default function HomePage() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 text-center">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col justify-center items-center px-6 py-16">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-700 dark:text-blue-400 mb-6">
          Welcome to DavNotes 📘
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mb-10">
          A platform where you can find and download previous year question
          papers, notes, assignments, and syllabus for your semester.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/resources"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md text-lg font-medium transition"
          >
            Browse Resources
          </Link>

          {!user && (
            <Link
              to="/join-as-uploader"
              className="px-6 py-3 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg text-lg font-medium hover:bg-blue-50 dark:hover:bg-gray-800 transition"
            >
              Join as Uploader 🚀
            </Link>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-white dark:bg-gray-900">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="p-6 rounded-xl shadow-md bg-gray-50 dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">
              📄 Previous Year Papers
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Access PYQs semester-wise to prepare better for exams.
            </p>
          </div>
          <div className="p-6 rounded-xl shadow-md bg-gray-50 dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">
              📝 Notes
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Find organized notes uploaded by fellow students.
            </p>
          </div>
          <div className="p-6 rounded-xl shadow-md bg-gray-50 dark:bg-gray-800">
            <h2 className="text-xl font-semibold mb-2 text-blue-600 dark:text-blue-400">
              📚 Assignments & Syllabus
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Get access to syllabus and assignments for quick reference.
            </p>
          </div>
        </div>
      </section>

   
    </div>
  );
}
