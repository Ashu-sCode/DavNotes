// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../api/firebase";

export default function Footer() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  return (
    <footer className="w-full bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between text-sm">
        {/* Copyright */}
        <p className="mb-2 sm:mb-0">
          © {new Date().getFullYear()} Notes Portal. All rights reserved.
        </p>

        {/* Links */}
        <div className="flex flex-wrap gap-4 items-center">
          <Link
            to="/about"
            className="hover:underline hover:text-blue-600 dark:hover:text-blue-400"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="hover:underline hover:text-blue-600 dark:hover:text-blue-400"
          >
            Contact
          </Link>

          {!user && (
            <Link
              to="/join-as-uploader"
              className="px-4 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-50 dark:hover:bg-gray-800 transition"
            >
              Become a Contributor 🚀
            </Link>
          )}

          <Link
            to="/admin/login"
            className="font-medium hover:underline hover:text-blue-600 dark:hover:text-blue-400"
          >
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
