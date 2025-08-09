import React, { useEffect, useState } from "react";
import { auth } from "../api/firebase"; // Adjust path as per your structure
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserEmail(user.email);
      } else {
        setIsLoggedIn(false);
        setUserEmail("");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // toast.success("Logged in successfully!");
      navigate("/admin/dashboard");
    } catch (error) {
      toast.error("Login failed: " + error.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      toast.success("You are already logged in!");
    }
  }, [isLoggedIn]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out");
    } catch (error) {
      toast.error("Logout error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800 px-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        {isLoggedIn ? (
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
              You are already logged in as{" "}
              <span className="text-blue-500">{userEmail}</span>
            </p>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center">
              Admin Login
            </h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="DAV Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded dark:bg-gray-700 dark:text-white"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Login
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
