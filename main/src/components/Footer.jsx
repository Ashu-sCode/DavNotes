// src/components/Footer.jsx
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className=" w-full bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between text-sm">
        {/* Copyright */}
        <p className="mb-2 sm:mb-0">© {new Date().getFullYear()} Notes Portal</p>

        {/* Links */}
        <div className="flex gap-4">
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
