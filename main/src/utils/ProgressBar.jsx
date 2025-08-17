import { useState, useEffect, useRef } from "react";

// src/utils/ProgressBar.jsx
export default function ProgressBar({ progress }) {
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner">
      <div
        className="h-3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
