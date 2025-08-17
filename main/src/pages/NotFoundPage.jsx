// src/pages/NotFoundPage.jsx
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-gray-100 dark:bg-gray-900">
      <h1 className="text-8xl md:text-9xl font-extrabold text-blue-600 dark:text-blue-400 animate-pulse">
        404
      </h1>
      <p className="mt-4 text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-md">
        Oops! The page you’re looking for doesn’t exist.
      </p>

      {/* Optional illustration */}
      <div className="mt-6 w-64 h-40 bg-blue-100 dark:bg-blue-800 rounded-lg flex items-center justify-center">
        <span className="text-blue-600 dark:text-blue-200 font-semibold">
          🌐 Page Not Found
        </span>
      </div>

      <Link
        to="/"
        className="mt-6 px-6 py-3 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-800 transition-all duration-200"
      >
        Go Back Home
      </Link>
    </div>
  );
}
