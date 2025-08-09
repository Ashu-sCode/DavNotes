// src/context/AuthContext.jsx
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getIdTokenResult,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/api/firebase";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Secure Login
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const role = userDoc.data().role || "student";
        setCurrentUser(user);
        setRole(role);
        toast.success("Logged in successfully!");
      } else {
        throw new Error("User role not found in Firestore.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error.message || "Login failed. Please try again.");
      throw error;
    }
  };

  // i was doing login route issue .

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

  // 🔄 Auto-authenticate
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);

        try {
          const tokenResult = await getIdTokenResult(user, true);
          const userDoc = await getDoc(doc(db, "users", user.uid));

          if (userDoc.exists()) {
            const data = userDoc.data();
            if (!data.role) throw new Error("User role missing in Firestore.");
            setRole(data.role);
          } else {
            throw new Error("User data not found in Firestore.");
          }
        } catch (error) {
          console.error("Error during auth state sync:", error);
          toast.error("Auth error: Unable to fetch role.");
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

  // 🔁 Memoized context
  const contextValue = useMemo(() => ({
    currentUser,
    role,
    login,
    logout,
    loading,
    isAuthenticated: !!currentUser,
  }), [currentUser, role, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
