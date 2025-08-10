import React from "react";
import ResourceRow from "./ResourcesRow";
import { motion, AnimatePresence } from "framer-motion";

const ResourcesTable = ({ resources, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800 text-left">
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
        <tbody>
          <AnimatePresence>
            {resources.map((res) => (
              <motion.tr
                key={res.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <ResourceRow
                  resource={res}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
};

export default ResourcesTable;
