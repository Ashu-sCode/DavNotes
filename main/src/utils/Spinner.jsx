// components/Spinner.jsx
import React from "react";

export default function Spinner({ size = 48, className = "" }) {
  return (
    <div
      className={`flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      role="status"
    >
      <svg
        viewBox="0 0 64 64"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Notebook cover */}
        <rect
          x="2"
          y="8"
          width="60"
          height="48"
          rx="4"
          fill="white"
          stroke="gray"
          strokeWidth="2"
        />
        {/* Spine */}
        <rect x="30" y="8" width="4" height="48" fill="gray" />

        {/* Static left page lines */}
        {Array.from({ length: 5 }).map((_, i) => (
          <line
            key={i}
            x1="6"
            y1={14 + i * 8}
            x2="28"
            y2={14 + i * 8}
            stroke="lightgray"
            strokeWidth="1"
          />
        ))}

        {/* Static right page lines */}
        {Array.from({ length: 5 }).map((_, i) => (
          <line
            key={i}
            x1="36"
            y1={14 + i * 8}
            x2="58"
            y2={14 + i * 8}
            stroke="lightgray"
            strokeWidth="1"
          />
        ))}

        {/* Flipping pages */}
        <g>
          <rect
            className="page page1"
            x="32"
            y="8"
            width="28"
            height="48"
            rx="2"
            fill="white"
            stroke="lightgray"
            strokeWidth="1"
          />
          <rect
            className="page page2"
            x="32"
            y="8"
            width="28"
            height="48"
            rx="2"
            fill="white"
            stroke="lightgray"
            strokeWidth="1"
          />
          <rect
            className="page page3"
            x="32"
            y="8"
            width="28"
            height="48"
            rx="2"
            fill="white"
            stroke="lightgray"
            strokeWidth="1"
          />
        </g>
      </svg>

      <style jsx>{`
        @keyframes flipPage {
          0% {
            transform: rotateY(0deg);
            opacity: 1;
          }
          40% {
            transform: rotateY(-160deg);
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
          100% {
            transform: rotateY(-160deg);
            opacity: 0;
          }
        }

        .page {
          transform-origin: left center;
        }
        .page1 {
          animation: flipPage 1.5s ease-in-out infinite;
        }
        .page2 {
          animation: flipPage 1.5s ease-in-out infinite;
          animation-delay: 0.5s;
        }
        .page3 {
          animation: flipPage 1.5s ease-in-out infinite;
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
}
