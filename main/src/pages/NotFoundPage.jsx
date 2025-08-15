import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-gray-100 dark:bg-gray-900">
      <h1 className="text-8xl font-extrabold text-blue-600 dark:text-blue-400">
        404
      </h1>
      <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">
        Oops! The page you’re looking for doesn’t exist.
      </p>
      <Link
        to="/"
        className="mt-6 px-6 py-3 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:ring focus:ring-blue-300 dark:focus:ring-blue-800 transition"
      >
        Go Back Home
      </Link>
    </div>
  );
}
