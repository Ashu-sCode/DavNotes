import React from "react";
import { Search } from "lucide-react";

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="flex items-center gap-3 mb-6">
      <Search size={24} className="text-gray-500 dark:text-gray-300" />
      <input
        type="text"
        placeholder="Search by title, subject, program, category..."
        className="w-full p-3 border rounded-md dark:bg-gray-800 dark:text-white"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search resources"
      />
    </div>
  );
};

export default SearchBar;
