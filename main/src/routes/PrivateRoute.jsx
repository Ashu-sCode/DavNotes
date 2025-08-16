// src/routes/PrivateRoute.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../api/firebase";
import Spinner from "../utils/Spinner";

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
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) {
          navigate("/not-authorized", { replace: true });
          setLoading(false);
          return;
        }

        const { role: userRole } = userDoc.data();
        if (roles.length > 0 && !roles.includes(userRole)) {
          navigate("/not-authorized", { replace: true });
          setLoading(false);
          return;
        }

        // Everything okay → render children
        setLoading(false);
      } catch (err) {
        console.error("Error checking user role:", err);
        navigate("/not-authorized", { replace: true });
        setLoading(false);
      }
    });

    return unsub;
  }, [navigate, roles]);

  if (loading) {
    // Full-page spinner prevents flicker of protected page
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
        <Spinner size={60} />
      </div>
    );
  }

  return children;
}
