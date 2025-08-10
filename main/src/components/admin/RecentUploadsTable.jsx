import React from "react";

const RecentUploadsTable = ({ data = [], loading }) => {
  // Show only recent 5 uploads for dashboard widget
  const recentUploads = data.slice(0, 5);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow overflow-x-auto transition-colors duration-300 ease-in-out">
      <h2 className="text-xl dark:text-white font-semibold mb-4">
        Recent Uploads
      </h2>

      <table className="min-w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-300 dark:border-gray-600 dark:text-white">
            <th
              scope="col"
              className="px-3 py-2 text-sm font-medium whitespace-nowrap"
            >
              Category
            </th>
            <th
              scope="col"
              className="px-3 py-2 text-sm font-medium whitespace-nowrap"
            >
              Program
            </th>
            <th
              scope="col"
              className="px-3 py-2 text-sm font-medium whitespace-nowrap"
            >
              Uploaded By
            </th>
            <th
              scope="col"
              className="px-3 py-2 text-sm font-medium whitespace-nowrap"
            >
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            // Skeleton Loader Rows with varied widths
            [...Array(5)].map((_, i) => (
              <tr
                key={i}
                className="border-b border-gray-200 dark:border-gray-700"
              >
                <td className="px-3 py-2">
                  <div className="h-4 w-20 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                </td>
                <td className="px-3 py-2">
                  <div className="h-4 w-24 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                </td>
                <td className="px-3 py-2">
                  <div className="h-4 w-28 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                </td>
                <td className="px-3 py-2">
                  <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                </td>
              </tr>
            ))
          ) : recentUploads.length === 0 ? (
            <tr>
              <td
                colSpan="4"
                className="p-8 text-center text-gray-500 dark:text-gray-400"
              >
                <div className="mb-2 text-4xl select-none">📂</div>
                No uploads yet.
              </td>
            </tr>
          ) : (
            recentUploads.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-200 dark:border-gray-700 dark:text-white
                           hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <td
                  className="px-3 py-2 whitespace-nowrap truncate max-w-[150px]"
                  title={item.category}
                >
                  {item.category}
                </td>
                <td
                  className="px-3 py-2 whitespace-nowrap truncate max-w-[150px]"
                  title={item.program}
                >
                  {item.program}
                </td>
                <td
                  className="px-3 py-2 whitespace-nowrap truncate max-w-[150px]"
                  title={item.fullName || item.uploadedBy}
                >
                  {item.fullName || item.uploadedBy}
                </td>
                <td
                  className="px-3 py-2 whitespace-nowrap"
                  title={item.createdAt?.toDate().toLocaleString()}
                >
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

      {/* View All Link if more than 5 uploads */}
      {data.length > 5 && !loading && (
        <div className="mt-4 text-right">
          <a
            href="/admin/uploads"
            className="text-indigo-600 hover:underline text-sm font-medium"
          >
            View all uploads &rarr;
          </a>
        </div>
      )}
    </div>
  );
};

export default RecentUploadsTable;
