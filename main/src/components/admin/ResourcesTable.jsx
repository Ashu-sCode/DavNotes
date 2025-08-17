import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ResourceRow from "./ResourcesRow";

const PAGE_SIZE = 10;

const ResourcesTable = ({
  resources = [],
  selectedIds = [],
  onEdit,
  onDelete,
  toggleSelect,
  toggleSelectAll,
  loading = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const allSelected =
    resources.length > 0 &&
    selectedIds.length ===
      Math.min(PAGE_SIZE, resources.length - (currentPage - 1) * PAGE_SIZE);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedResources = resources.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );
  const totalPages = Math.ceil(resources.length / PAGE_SIZE);

  return (
    <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      <table className="min-w-full border-collapse">
        {/* Table Header */}
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800 text-left text-gray-700 dark:text-gray-300">
            <th className="p-3 w-12">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                aria-label="Select all resources"
                className="cursor-pointer"
              />
            </th>
            <th className="p-3">Title</th>
            <th className="p-3">Category</th>
            <th className="p-3">Program</th>
            <th className="p-3">Year</th>
            <th className="p-3">Subject</th>
            <th className="p-3">Size</th>
            <th className="p-3">Uploaded</th>
            <th className="p-3 text-right">Actions</th>
          </tr>
        </thead>

        {/* Table Body with page-change animation */}
        <AnimatePresence mode="wait">
          <motion.tbody
            key={currentPage} // 🔑 forces re-render when page changes
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {loading ? (
              [...Array(PAGE_SIZE)].map((_, idx) => (
                <tr
                  key={idx}
                  className="border-b border-gray-200 dark:border-gray-700"
                >
                  {[...Array(9)].map((_, cellIdx) => (
                    <td key={cellIdx} className="p-3">
                      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedResources.length === 0 ? (
              <tr>
                <td
                  colSpan="9"
                  className="p-8 text-center text-gray-500 dark:text-gray-400"
                >
                  No resources found.
                </td>
              </tr>
            ) : (
              paginatedResources.map((res) => {
                const isSelected = selectedIds.includes(res.id);
                return (
                  <ResourceRow
                    key={res.id}
                    resource={res}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    isSelected={isSelected}
                    toggleSelect={() => toggleSelect(res.id)}
                  />
                );
              })
            )}
          </motion.tbody>
        </AnimatePresence>
      </table>

      {/* Pagination */}
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          {/* Prev */}
          <motion.div className="inline-block">
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ y: -2 }} // lift up instead of resizing
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 
                   text-gray-700 dark:text-gray-300 
                   hover:bg-gray-300 dark:hover:bg-gray-600 
                   disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Prev
            </motion.button>
          </motion.div>

          {/* Page Numbers */}
          {Array.from({ length: totalPages })
            .map((_, i) => i + 1)
            .filter((page) => {
              return (
                page === 1 ||
                page === totalPages ||
                Math.abs(page - currentPage) <= 1
              );
            })
            .reduce((acc, page, idx, arr) => {
              if (idx > 0 && page - arr[idx - 1] > 1) acc.push("ellipsis");
              acc.push(page);
              return acc;
            }, [])
            .map((item, idx) =>
              item === "ellipsis" ? (
                <span key={`ellipsis-${idx}`} className="px-2">
                  ...
                </span>
              ) : (
                <motion.div key={item} className="inline-block">
                  <motion.button
                    onClick={() => setCurrentPage(item)}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ y: -2 }}
                    className={`px-3 py-1.5 rounded-lg transition 
                ${
                  currentPage === item
                    ? "bg-blue-600 text-white font-medium shadow-sm"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
                  >
                    {item}
                  </motion.button>
                </motion.div>
              )
            )}

          {/* Next */}
          <motion.div className="inline-block">
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ y: -2 }}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg bg-gray-200 dark:bg-gray-700 
                   text-gray-700 dark:text-gray-300 
                   hover:bg-gray-300 dark:hover:bg-gray-600 
                   disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </motion.button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ResourcesTable;
