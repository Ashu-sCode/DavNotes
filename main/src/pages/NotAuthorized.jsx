// src/pages/NotAuthorized.jsx
import { Link } from "react-router-dom";

export default function NotAuthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-gray-50 dark:bg-gray-900">
      <h1 className="text-6xl md:text-7xl font-extrabold text-red-600 dark:text-red-500 mb-4 animate-pulse">
        403
      </h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Access Denied
      </h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
        You don’t have permission to view this page.  
        Please contact an administrator if you think this is a mistake.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 text-white rounded-lg font-medium transition-all duration-200"
      >
        Go Back Home
      </Link>
    </div>
  );
}
