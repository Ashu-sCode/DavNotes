// src/components/FetchSubjects.jsx
import React, { useEffect, useState } from "react";
import { db } from "../../api/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function FetchSubjects({ program, semester, value, onChange }) {
  const [subjects, setSubjects] = useState([]);
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const [inputValue, setInputValue] = useState(value || "");
  const [showDropdown, setShowDropdown] = useState(false);

  // ✅ Fetch subjects whenever program/semester changes
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!program || !semester) {
        setSubjects([]);
        setInputValue(""); // reset subject if program/semester not chosen
        onChange("");      // also reset parent state
        return;
      }

      try {
        

        const q = query(
          collection(db, "resources"),
          where("program", "==", program),
          where("semester", "==", semester)
        );

        const querySnapshot = await getDocs(q);

        const subjectSet = new Set();
        querySnapshot.forEach((doc) => {
          const subj = doc.data().subject;
          if (subj) subjectSet.add(subj);
        });

        setSubjects(Array.from(subjectSet).sort());
        setInputValue(""); // reset field whenever new program/semester is chosen
        onChange("");
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchSubjects();
  }, [program, semester]);

  // ✅ Handle typing & filter subjects
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);

    if (val.trim() === "") {
      setFilteredSubjects([]);
      setShowDropdown(false);
      onChange("");
      return;
    }

    const filtered = subjects.filter((subj) =>
      subj.toLowerCase().includes(val.toLowerCase())
    );

    setFilteredSubjects(filtered);
    setShowDropdown(true);

    onChange(val);
  };

  // ✅ Select subject from dropdown
  const handleSelect = (subject) => {
    setInputValue(subject);
    onChange(subject);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Enter or select subject"
        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-800 dark:text-white"
      />

      {showDropdown && filteredSubjects.length > 0 && (
        <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md max-h-48 overflow-y-auto shadow-md">
          {filteredSubjects.map((subject, idx) => (
            <li
              key={idx}
              onClick={() => handleSelect(subject)}
              className="p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {subject}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
