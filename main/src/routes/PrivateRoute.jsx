// src/routes/PrivateRoute.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../api/firebase";
import Spinner from "../utils/Spinner";

export default function PrivateRoute({ children, roles = [] }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true; // to prevent memory leaks

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        if (isMounted) {
          setAuthorized(false);
          setLoading(false);
          navigate("/not-authorized", { replace: true });
        }
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) {
          if (isMounted) {
            setAuthorized(false);
            setLoading(false);
            navigate("/not-authorized", { replace: true });
          }
          return;
        }

        const { role: userRole } = userDoc.data();
        if (roles.length === 0 || roles.includes(userRole)) {
          if (isMounted) {
            setAuthorized(true);
            setLoading(false);
          }
        } else {
          if (isMounted) {
            setAuthorized(false);
            setLoading(false);
            navigate("/not-authorized", { replace: true });
          }
        }
      } catch (err) {
        console.error("Error checking user role:", err);
        if (isMounted) {
          setAuthorized(false);
          setLoading(false);
          navigate("/not-authorized", { replace: true });
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [navigate, roles]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
        <Spinner size={60} />
      </div>
    );
  }

  return authorized ? children : null;
}
