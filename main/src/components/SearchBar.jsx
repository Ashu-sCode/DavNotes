import React from "react";
import { Search, XCircle } from "lucide-react";

const SearchBar = ({
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
  filterProgram,
  setFilterProgram,
  filterSubject,
  setFilterSubject,
  allCategories = [],
  allPrograms = [],
  allSubjects = [],
}) => {
  const hasActiveFilters =
    searchTerm || filterCategory || filterProgram || filterSubject;

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterCategory("");
    setFilterProgram("");
    setFilterSubject("");
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6 transition-colors duration-300">
      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
          />
          <input
            type="text"
            placeholder="Search by title, subject, program, category..."
            className="w-full pl-10 pr-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                       placeholder-gray-400 dark:placeholder-gray-500
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search resources"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-2 border rounded-md bg-white dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600 
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Categories</option>
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={filterProgram}
            onChange={(e) => setFilterProgram(e.target.value)}
            className="p-2 border rounded-md bg-white dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600 
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Programs</option>
            {allPrograms.map((prog) => (
              <option key={prog} value={prog}>{prog}</option>
            ))}
          </select>

          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="p-2 border rounded-md bg-white dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600 
                       focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Subjects</option>
            {allSubjects.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md
                       bg-red-500 text-white hover:bg-red-600 
                       dark:bg-red-600 dark:hover:bg-red-700 transition"
          >
            <XCircle size={16} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
