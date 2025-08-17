// components/Filters.jsx
import React, { useEffect, useState } from "react";
import { db } from "../../api/firebase";
import { collection, getDocs } from "firebase/firestore";
import DOMPurify from "dompurify";

export default function Filters({ onFilterChange }) {
  const [programs, setPrograms] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [search, setSearch] = useState("");

  // Fetch unique programs & semesters from Firestore
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        // Try to load from cache first
        const cachedPrograms = localStorage.getItem("filter-programs");
        const cachedSemesters = localStorage.getItem("filter-semesters");

        if (cachedPrograms) setPrograms(JSON.parse(cachedPrograms));
        if (cachedSemesters) setSemesters(JSON.parse(cachedSemesters));

        // Always fetch latest data in background
        const querySnapshot = await getDocs(collection(db, "resources"));
        const programSet = new Set();
        const semesterSet = new Set();

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.program) programSet.add(data.program);
          if (data.semester) semesterSet.add(data.semester);
        });

        const programsArr = [...programSet].sort();
        const semestersArr = [...semesterSet].sort((a, b) => Number(a) - Number(b));

        setPrograms(programsArr);
        setSemesters(semestersArr);

        localStorage.setItem("filter-programs", JSON.stringify(programsArr));
        localStorage.setItem("filter-semesters", JSON.stringify(semestersArr));
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    };

    fetchFilters();
  }, []);

  // Notify parent whenever filters change
  useEffect(() => {
    const sanitizedProgram = DOMPurify.sanitize(selectedProgram);
    const sanitizedSemester = DOMPurify.sanitize(selectedSemester);
    const sanitizedSearch = DOMPurify.sanitize(search);

    onFilterChange({
      program: sanitizedProgram,
      semester: sanitizedSemester,
      search: sanitizedSearch,
    });
  }, [selectedProgram, selectedSemester, search, onFilterChange]);

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mb-4">
      {/* Program Filter */}
      <select
        value={selectedProgram}
        onChange={(e) => setSelectedProgram(e.target.value)}
        className="p-2 border rounded-lg dark:bg-gray-800 dark:text-white"
      >
        <option value="">All Programs</option>
        {programs.map((program) => (
          <option key={program} value={program}>
            {program}
          </option>
        ))}
      </select>

      {/* Semester Filter */}
      <select
        value={selectedSemester}
        onChange={(e) => setSelectedSemester(e.target.value)}
        className="p-2 border rounded-lg dark:bg-gray-800 dark:text-white"
      >
        <option value="">All Semesters</option>
        {semesters.map((sem) => (
          <option key={sem} value={sem}>
            {sem}
          </option>
        ))}
      </select>

      {/* Search Bar */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by subject or title..."
        className="p-2 border rounded-lg flex-1 dark:bg-gray-800 dark:text-white"
        aria-label="Search resources"
      />
    </div>
  );
}
