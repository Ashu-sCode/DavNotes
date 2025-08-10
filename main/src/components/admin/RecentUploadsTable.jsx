import { useState, useEffect } from "react";

const RecentUploadsTable = ({ data, loading }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow overflow-x-auto transition-colors duration-300 ease-in-out">
      <h2 className="text-xl dark:text-white font-semibold mb-4">
        Recent Uploads
      </h2>

      <table className="min-w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-300 dark:border-gray-600 dark:text-white">
            <th scope="col" className="p-2 whitespace-nowrap">Category</th>
            <th scope="col" className="p-2 whitespace-nowrap">Program</th>
            <th scope="col" className="p-2 whitespace-nowrap">Uploaded By</th>
            <th scope="col" className="p-2 whitespace-nowrap">Date</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            // Skeleton Loader Rows
            [...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-gray-200 dark:border-gray-700">
                <td className="p-2">
                  <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                </td>
                <td className="p-2">
                  <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                </td>
                <td className="p-2">
                  <div className="h-4 w-28 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                </td>
                <td className="p-2">
                  <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                </td>
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan="4"
                className="p-4 text-center text-gray-500 dark:text-gray-400"
              >
                No uploads yet.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-200 dark:border-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <td className="p-2 whitespace-nowrap">{item.category}</td>
                <td className="p-2 whitespace-nowrap">{item.program}</td>
                <td className="p-2 whitespace-nowrap">{item.uploadedBy}</td>
                <td className="p-2 whitespace-nowrap">
                  {item.createdAt?.toDate().toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecentUploadsTable;
