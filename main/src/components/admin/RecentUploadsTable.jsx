import React from "react";
import { motion } from "framer-motion";

const RecentUploadsTable = ({ data = [], loading }) => {
  const recentUploads = data.slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg overflow-x-auto transition-colors duration-300 ease-in-out">
      <h2 className="text-xl dark:text-white font-semibold mb-6 text-center">
        Recent Uploads
      </h2>

      <table className="min-w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-300 dark:border-gray-600 dark:text-white">
            {["Category", "Program", "Uploaded By", "Date"].map((header) => (
              <th
                key={header}
                className="px-3 py-2 text-sm font-medium whitespace-nowrap text-center"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading
            ? [...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-gray-200 dark:border-gray-700">
                  {[...Array(4)].map((__, idx) => (
                    <td key={idx} className="px-3 py-2 text-center">
                      <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded mx-auto animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))
            : recentUploads.length === 0
            ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-500 dark:text-gray-400">
                  <div className="mb-2 text-4xl select-none">📂</div>
                  No uploads yet.
                </td>
              </tr>
            )
            : recentUploads.map((item) => (
                <motion.tr
                  key={item.id}
                  className="border-b border-gray-200 dark:border-gray-700 dark:text-white cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <td className="px-3 py-2 text-center truncate max-w-[150px]" title={item.category}>
                    {item.category}
                  </td>
                  <td className="px-3 py-2 text-center truncate max-w-[150px]" title={item.program}>
                    {item.program}
                  </td>
                  <td className="px-3 py-2 text-center truncate max-w-[150px]" title={item.fullName || item.uploadedBy}>
                    {item.fullName || item.uploadedBy}
                  </td>
                  <td className="px-3 py-2 text-center" title={item.createdAt?.toDate().toLocaleString()}>
                    {item.createdAt?.toDate().toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </motion.tr>
              ))}
        </tbody>
      </table>

      {data.length > 5 && !loading && (
        <div className="mt-4 flex justify-center">
          <a
            href="/admin/uploads"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
          >
            View all uploads &rarr;
          </a>
        </div>
      )}
    </div>
  );
};

export default RecentUploadsTable;
