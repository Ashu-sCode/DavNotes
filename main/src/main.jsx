// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "@/context/AuthContext"; // 👈 import
import { Toaster } from "react-hot-toast"; // ✅ Import Toaster
import { ThemeProvider } from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        {" "}
         <App />
        <Toaster position="top-center" reverseOrder={false} />{" "}
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
