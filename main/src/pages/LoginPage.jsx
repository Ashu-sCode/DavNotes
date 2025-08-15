import React, { useEffect, useState } from "react";
import { auth, db } from "../api/firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
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
    if (!email.trim() || !password.trim()) {
      toast.error("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      // Sign in
      const cred = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password.trim()
      );
      const userRef = doc(db, "users", cred.user.uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        toast.error("User record not found in Firestore.");
        await signOut(auth);
        return;
      }

      const userData = userDoc.data();
      console.log("Fetched user data:", userData);

      if (!userData?.role) {
        toast.error("No role assigned in Firestore.");
        await signOut(auth);
        return;
      }

      toast.success("✅ Logged in successfully!");

      if (userData.role.toLowerCase() === "admin") {
        navigate("/admin/dashboard");
      } else if (userData.role.toLowerCase() === "uploader") {
        navigate("/uploader/dashboard");
      } else {
        toast.error(`Unknown role: ${userData.role}`);
        await signOut(auth);
      }
    } catch (error) {
      const message =
        error.code === "auth/wrong-password"
          ? "Incorrect password."
          : error.code === "auth/user-not-found"
          ? "No account found with that email."
          : "Login failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out");
    } catch {
      toast.error("Logout failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-sm border border-gray-200 dark:border-gray-700">
        {isLoggedIn ? (
          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Welcome back!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Logged in as{" "}
              <span className="font-medium text-blue-600 dark:text-blue-400">
                {userEmail}
              </span>
            </p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition shadow-md"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white text-center">
              Admin Login
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
              Please enter your credentials
            </p>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none pr-10"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow transition disabled:opacity-50 flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
