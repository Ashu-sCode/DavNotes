import React from "react";
import ResourceRow from "./ResourcesRow";

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
          {resources.map((res) => (
            <ResourceRow
              key={res.id}
              resource={res}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ResourcesTable;
