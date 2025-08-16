// src/routes/PrivateRoute.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../api/firebase";

export default function PrivateRoute({ children, roles = [] }) {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/not-authorized", { replace: true });
        setLoading(false);
        return;
      }

      try {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));

        if (!userDoc.exists()) {
          navigate("/not-authorized", { replace: true });
          setLoading(false);
          return;
        }

        const { role: userRole } = userDoc.data();

        // Role check — exact match only
        if (roles.length > 0 && !roles.includes(userRole)) {
          navigate("/not-authorized", { replace: true });
          setLoading(false);
          return;
        }

        setLoading(false);
      } catch (error) {
        console.error("Error checking user role:", error);
        navigate("/not-authorized", { replace: true });
        setLoading(false);
      }
    });

    return unsub;
  }, [navigate, roles]);

  if (loading) {
    return <div className="p-6 text-center">Checking authentication...</div>;
  }

  return children;
}
