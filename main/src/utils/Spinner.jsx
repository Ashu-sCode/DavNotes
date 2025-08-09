// components/Spinner.jsx
import React from "react";
import { Loader2 } from "lucide-react";

export default function Spinner({ size = 32, className = "" }) {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      role="status"
    >
      <Loader2
        className="animate-spin text-blue-600 dark:text-blue-400"
        size={size}
      />
    </div>
  );
}
