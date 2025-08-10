import React, { useState, useEffect, useRef } from "react";
import { Search, XCircle } from "lucide-react";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../api/firebase"; // your firebase config file

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
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

  // Debounce input so we don’t query on every keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm.trim());
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Firestore live fetch for autocomplete suggestions based on debouncedTerm
  useEffect(() => {
    if (debouncedTerm === "") {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    async function fetchSuggestions() {
      try {
        // Firestore collection ref
        const resourcesRef = collection(db, "resources");

        // Prefix query for titles starting with debouncedTerm (case insensitive trick)
        const q = query(
          resourcesRef,
          orderBy("title"),
          where("title", ">=", debouncedTerm),
          where("title", "<=", debouncedTerm + "\uf8ff"),
          limit(5)
        );

        const querySnapshot = await getDocs(q);
        const titles = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.title) {
            titles.push(data.title);
          }
        });

        setSuggestions(titles);
        setShowSuggestions(titles.length > 0);
      } catch (error) {
        console.error("Error fetching autocomplete suggestions:", error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }

    fetchSuggestions();
  }, [debouncedTerm]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterCategory("");
    setFilterProgram("");
    setFilterSubject("");
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
  };

  const hasActiveFilters =
    searchTerm || filterCategory || filterProgram || filterSubject;

  return (
    <div
      className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6 transition-colors duration-300 relative"
      ref={wrapperRef}
    >
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
            onFocus={() => {
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            autoComplete="off"
          />

          {/* Suggestions dropdown */}
          {showSuggestions && (
            <ul className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 shadow-lg">
              {suggestions.map((suggestion, idx) => (
                <li
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="cursor-pointer px-4 py-2 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
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
              <option key={cat} value={cat}>
                {cat}
              </option>
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
              <option key={prog} value={prog}>
                {prog}
              </option>
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
              <option key={sub} value={sub}>
                {sub}
              </option>
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
