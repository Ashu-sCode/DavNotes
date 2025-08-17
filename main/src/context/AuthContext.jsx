import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/api/firebase";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null); // "admin" | "uploader" | "student"
  const [loading, setLoading] = useState(true);

  // 🔐 Login
  const login = async (email, password) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        throw new Error("User role not found in Firestore.");
      }

      const userData = userDoc.data();
      setCurrentUser({ ...user, ...userData });
      setRole(userData.role || "student");

      toast.success("Logged in successfully!");
      return userData.role;
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error.message || "Login failed. Please try again.");
      throw error;
    }
  };

  // 🚪 Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setRole(null);
      toast.success("Logged out successfully.");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed.");
    }
  };

  // 🔄 Sync auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (!userDoc.exists()) {
            throw new Error("User data not found in Firestore.");
          }

          const userData = userDoc.data();
          setCurrentUser({ ...user, ...userData });
          setRole(userData.role || null);
        } catch (error) {
          console.error("Error during auth sync:", error);
          toast.error("Auth error: Unable to fetch role.");
          setCurrentUser(user); // fallback
          setRole(null);
        }
      } else {
        setCurrentUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🛡 Context value
  const contextValue = useMemo(
    () => ({
      currentUser,
      role,
      login,
      logout,
      loading,
      isAuthenticated: !!currentUser,
      isAdmin: role === "admin",
      isUploader: role === "uploader",
    }),
    [currentUser, role, loading]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
