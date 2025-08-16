import React, { useState, useEffect, useRef } from "react";
import { Search, XCircle } from "lucide-react";
import DOMPurify from "dompurify";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../api/firebase";

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
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

  // Debounce input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedTerm(searchTerm.trim()), 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Fetch suggestions from Firestore
  useEffect(() => {
    if (!debouncedTerm) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const resourcesRef = collection(db, "resources");
        const q = query(
          resourcesRef,
          orderBy("title"),
          where("title", ">=", debouncedTerm),
          where("title", "<=", debouncedTerm + "\uf8ff"),
          limit(5)
        );

        const snapshot = await getDocs(q);
        const titles = snapshot.docs
          .map((doc) => doc.data().title)
          .filter(Boolean);
        setSuggestions(titles);
        setShowSuggestions(titles.length > 0);
        setActiveIndex(-1);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [debouncedTerm]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterCategory("");
    setFilterProgram("");
    setFilterSubject("");
    setShowSuggestions(false);
    setActiveIndex(-1);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;

    if (e.key === "ArrowDown") {
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
      e.preventDefault();
    } else if (e.key === "Enter" && activeIndex >= 0) {
      handleSuggestionClick(suggestions[activeIndex]);
      e.preventDefault();
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  };

  const hasActiveFilters = searchTerm || filterCategory || filterProgram || filterSubject;

  // Highlight matched term
  const highlightMatch = (text, term) => {
    if (!term) return DOMPurify.sanitize(text);
    const regex = new RegExp(`(${term})`, "gi");
    const parts = text.split(regex);
    return parts
      .map((part, idx) =>
        regex.test(part)
          ? `<span class="bg-yellow-300 dark:bg-yellow-500 font-semibold">${DOMPurify.sanitize(part)}</span>`
          : DOMPurify.sanitize(part)
      )
      .join("");
  };

  return (
    <div
      ref={wrapperRef}
      className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg shadow-sm mb-6 transition-colors duration-300 relative"
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
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            autoComplete="off"
            aria-label="Search resources"
          />

          {/* Suggestions Dropdown */}
          {showSuggestions && (
            <ul
              role="listbox"
              className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 shadow-lg"
            >
              {suggestions.map((s, idx) => (
                <li
                  key={idx}
                  role="option"
                  aria-selected={idx === activeIndex}
                  onClick={() => handleSuggestionClick(s)}
                  className={`cursor-pointer px-4 py-2 transition ${
                    idx === activeIndex
                      ? "bg-indigo-600 text-white dark:bg-indigo-500"
                      : "hover:bg-indigo-100 hover:text-gray-900 dark:hover:bg-indigo-600 dark:hover:text-white"
                  }`}
                  dangerouslySetInnerHTML={{ __html: highlightMatch(s, searchTerm) }}
                />
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
