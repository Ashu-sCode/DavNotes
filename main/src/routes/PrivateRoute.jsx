// src/routes/PrivateRoute.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../api/firebase";

export default function PrivateRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate("/admin/login");
      }
      setLoading(false);
    });
    return unsub;
  }, [navigate]);

  if (loading) {
    return <div className="p-6 text-center">Checking authentication...</div>;
  }

  return children;
}
