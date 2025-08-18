import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../api/firebase";
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [cooldown, setCooldown] = useState(0);

  const navigate = useNavigate();

  // Track auth state and redirect if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User already logged in, fetch role to redirect
        const userRef = doc(db, "users", user.uid);
        getDoc(userRef).then((docSnap) => {
          if (docSnap.exists() && docSnap.data()?.role) {
            const role = docSnap.data().role.toLowerCase();
            if (role === "admin") navigate("/admin/dashboard", { replace: true });
            else if (role === "uploader") navigate("/uploader/dashboard", { replace: true });
            else toast.error(`Unknown role: ${docSnap.data().role}`);
          } else {
            toast.error("User record not found or no role assigned.");
          }
        });
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Handle Firebase auth errors
  const handleAuthError = (error) => {
    let message;
    switch (error.code) {
      case "auth/wrong-password":
        message = "Incorrect password.";
        break;
      case "auth/user-not-found":
        message = "No account found with that email.";
        break;
      case "auth/invalid-email":
        message = "Invalid email format.";
        break;
      case "auth/invalid-credential":
        message = "Invalid email or password.";
        break;
      default:
        message = "Login failed. Please try again.";
    }
    setLoginError(message);
  };

  const incrementAttempts = () => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    if (newAttempts >= 5) {
      setCooldown(30);
      setAttempts(0);
      toast.error("Too many failed attempts. Try again in 30 seconds.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (cooldown > 0) {
      toast.error(`Too many attempts. Please wait ${cooldown}s.`);
      return;
    }

    if (!email.trim() || !password.trim()) {
      setLoginError("Email and password are required.");
      return;
    }

    setLoading(true);
    setLoginError("");

    let cred;
    try {
      cred = await signInWithEmailAndPassword(auth, email.trim(), password.trim());
    } catch (error) {
      handleAuthError(error);
      incrementAttempts();
      setPassword("");
      setLoading(false);
      return;
    }

    let userDoc;
    try {
      const userRef = doc(db, "users", cred.user.uid);
      userDoc = await getDoc(userRef);
    } catch {
      setLoginError("Failed to fetch user info. Please try again.");
      await signOut(auth);
      setLoading(false);
      return;
    }

    if (!userDoc.exists()) {
      setLoginError("User record not found in Firestore.");
      await signOut(auth);
      setLoading(false);
      return;
    }

    const userData = userDoc.data();
    if (!userData?.role) {
      setLoginError("No role assigned in Firestore.");
      await signOut(auth);
      setLoading(false);
      return;
    }

    toast.success("✅ Logged in successfully!");
    setAttempts(0);

    const role = userData.role.toLowerCase();
    if (role === "admin") navigate("/admin/dashboard", { replace: true });
    else if (role === "uploader") navigate("/uploader/dashboard", { replace: true });
    else {
      setLoginError(`Unknown role: ${userData.role}`);
      await signOut(auth);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-sm border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white text-center">
          Admin Login
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
          Please enter your credentials
        </p>

        {loginError && (
          <p className="text-red-600 dark:text-red-400 text-sm text-center mb-2">
            {loginError}
          </p>
        )}
        {cooldown > 0 && (
          <p className="text-yellow-600 dark:text-yellow-400 text-sm text-center mb-2">
            Too many attempts. Try again in {cooldown}s
          </p>
        )}

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
              disabled={loading || cooldown > 0}
              required
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
                disabled={loading || cooldown > 0}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {attempts >= 2 && (
              <p className="text-yellow-600 mt-4 dark:text-yellow-400 text-sm text-center mb-2">
                Having trouble logging in? Password resets must be requested from the admin.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || cooldown > 0}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
