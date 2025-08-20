// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../api/firebase";

export default function Footer() {
  const [user, setUser] = useState(null);

  // Listen for auth changes to conditionally render links
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        {/* Copyright */}
        <p className="text-center sm:text-left">
          © {currentYear} Notes Portal. All rights reserved.
        </p>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-center sm:justify-end gap-3 sm:gap-4 items-center">
          <Link
            to="/about"
            className="hover:underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="hover:underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Contact
          </Link>

          {/* Only show contributor link if user is not logged in */}
          {!user && (
            <Link
              to="/join-as-uploader"
              className="px-3 py-1.5 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
            >
              Become a Contributor 🚀
            </Link>
          )}

          <Link
            to="/admin/login"
            className=" hover:underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Admin/Uploaders
          </Link>
        </div>
      </div>
    </footer>
  );
}
