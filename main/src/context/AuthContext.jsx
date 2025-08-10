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
  const [currentUser, setCurrentUser] = useState(null); // will hold merged user data
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
        const userData = userDoc.data();
        setCurrentUser({ ...user, ...userData });  // Merge auth user + Firestore data
        setRole(userData.role || "student");
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

  // 🔄 Auto-authenticate on auth state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Fetch Firestore user profile to get full data
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            setCurrentUser({ ...user, ...userData }); // merge firebase auth + firestore
            setRole(userData.role);
          } else {
            throw new Error("User data not found in Firestore.");
          }
        } catch (error) {
          console.error("Error during auth state sync:", error);
          toast.error("Auth error: Unable to fetch role.");
          setCurrentUser(user);  // fallback to firebase user object only
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
