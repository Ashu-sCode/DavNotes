import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../api/firebase";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import UploadForm from "../components/UploadForm";
import Spinner from "../utils/Spinner";

const UploadResource = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false); // ✅ For UploadForm actions

  // Fetch user role
  useEffect(() => {
    const fetchUserRole = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      try {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));

        if (userDoc.exists()) {
          setUserRole(userDoc.data().role);
        }
      } catch (err) {
        console.error("Error fetching user role:", err);
        toast.error("Error checking permissions");
      } finally {
        setLoading(false);
      }
    };
    fetchUserRole();
  }, [currentUser]);

  // Redirect non-admin/uploader users
  useEffect(() => {
    if (
      !loading &&
      (!userRole || (userRole !== "admin" && userRole !== "uploader"))
    ) {
      toast.error("Access denied");
      navigate("/");
    }
  }, [userRole, loading, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh] transition-opacity duration-500 opacity-100 animate-fadeIn">
        <Spinner size={48} />
      </div>
    );
  }
  return (
    <div className="mt-18 text-gray-800 dark:text-gray-100 rounded-2xl shadow-lg p-6 transition-colors duration-300">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-10 mb-12 transition-opacity duration-500 animate-fadeIn">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-12 text-gray-800 dark:text-gray-100">
          📤 Upload a New Resource
        </h2>

        {formLoading ? (
          <div className="flex justify-center items-center min-h-[200px] transition-opacity duration-500 animate-fadeIn">
            <Spinner size={40} />
          </div>
        ) : (
          <div className="transition-opacity duration-500 animate-fadeIn">
            <UploadForm setFormLoading={setFormLoading} />
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadResource;
