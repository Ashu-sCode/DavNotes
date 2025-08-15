// src/pages/NotAuthorized.jsx
import { Link } from "react-router-dom";

export default function NotAuthorized() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <h1 className="text-5xl font-bold text-red-500 mb-4">403</h1>
      <h2 className="text-2xl md:text-3xl font-semibold mb-2 dark:text-gray-100">
        Access Denied
      </h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-6">
        You don’t have permission to view this page.  
        Please contact an administrator if you think this is a mistake.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
