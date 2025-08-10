import React from "react";
import ResourceRow from "./ResourcesRow";

const ResourcesTable = ({
  resources = [],
  selectedIds = [],
  onEdit,
  onDelete,
  toggleSelect,
  toggleSelectAll,
}) => {
  // Check if all resources are selected
  const allSelected = resources.length > 0 && selectedIds.length === resources.length;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-800 text-left">
            {/* Select All checkbox */}
            <th className="p-3">
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
        <tbody>
          {resources.map((res) => {
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
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ResourcesTable;
