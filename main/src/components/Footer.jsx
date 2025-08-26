// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../api/firebase";

const currentYear = new Date().getFullYear(); // ✅ lifted outside for minor perf

export default function Footer() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  const footerLinks = [
    { to: "/about", label: "About", aria: "About Page" },
    { to: "/contact", label: "Contact", aria: "Contact Page" },
    { to: "/admin/login", label: "Admin/Uploaders", aria: "Admin and Uploader Login" },
  ];

  return (
    <footer className="w-full bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
        
        {/* Copyright */}
        <p className="text-center sm:text-left">
          © {currentYear} DavNotes. All rights reserved.
        </p>

        {/* Footer Links */}
        <div className="flex flex-wrap justify-center sm:justify-end gap-3 sm:gap-4 items-center">
          {footerLinks.map(({ to, label, aria }) => (
            <Link
              key={to}
              to={to}
              aria-label={aria}
              className="hover:underline hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {label}
            </Link>
          ))}

          {/* Contributor CTA only if user not logged in */}
          {!user && (
            <Link
              to="/join-as-uploader"
              aria-label="Join as a Contributor"
              className="px-3 py-1.5 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors"
            >
              Become a Contributor 🚀
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
