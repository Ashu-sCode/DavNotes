import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import toast from "react-hot-toast";
import clsx from "clsx";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../api/firebase";
import { ThemeContext } from "../context/ThemeContext";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUploader, setIsUploader] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userRef);

          if (userDoc.exists()) {
            const role = (userDoc.data().role || "").trim().toLowerCase();

            console.log("Fetched user role:", role);

            if (role === "admin") {
              setIsAdmin(true);
              setIsUploader(false);
            } else if (role === "uploader") {
              setIsUploader(true);
              setIsAdmin(false);
            } else {
              setIsAdmin(false);
              setIsUploader(false);
            }
          } else {
            console.warn("No user role found for UID:", currentUser.uid);
            setIsAdmin(false);
            setIsUploader(false);
          }

          setUser(currentUser);
        } catch (error) {
          console.error("Error fetching user role:", error);
          setIsAdmin(false);
          setIsUploader(false);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
        setIsUploader(false);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    toast.success("Logged out successfully.");
    setUser(null);
    setIsAdmin(false);
    setIsUploader(false);
    navigate("/");
  };

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const NavLinks = ({ isAdmin, isUploader, onClick }) => (
    <>
      <Link
        to="/"
        onClick={onClick}
        className="hover:underline hover:text-gray-300"
      >
        Home
      </Link>
      <Link
        to="/programs"
        onClick={onClick}
        className="hover:underline hover:text-gray-300"
      >
        Resources
      </Link>
      {isAdmin && (
        <Link
          to="/admin/dashboard"
          onClick={onClick}
          className="hover:underline hover:text-gray-300"
        >
          Admin Dashboard
        </Link>
      )}
      {isUploader && (
        <Link
          to="/uploader/dashboard"
          onClick={onClick}
          className="hover:underline hover:text-gray-300"
        >
          Uploader Dashboard
        </Link>
      )}
    </>
  );

  return (
    <>
      {/* Navbar */}
      <nav className="bg-blue-600 dark:bg-gray-900 text-white dark:text-gray-100 shadow-md fixed w-full z-50 top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="text-xl font-bold tracking-wide">
              <Link
                to="/"
                className="hover:text-gray-200 dark:hover:text-gray-300 transition"
              >
                DavNotes
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-6 text-sm font-medium items-center">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span className="text-gray-200">Loading...</span>
                </div>
              ) : (
                <>
                  <NavLinks isAdmin={isAdmin} isUploader={isUploader} />
                  <ThemeToggle />
                  {user && (
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-1 text-red-300 hover:text-red-500 transition font-medium"
                    >
                      <LogOut size={18} /> Logout
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden flex items-center gap-4">
              <ThemeToggle />
              <button onClick={toggleMenu} aria-label="Toggle Menu">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Background Blur with Fade */}
      <div
        className={clsx(
          "fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ease-in-out",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={toggleMenu}
      />

      {/* Slide-in + Fade Mobile Menu */}
      <div
        className={clsx(
          "fixed top-16 right-0 h-[calc(100vh-4rem)] w-3/4 max-w-xs z-50 bg-blue-700 dark:bg-gray-800 shadow-lg transform transition-all duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        )}
      >
        <div className="flex flex-col px-6 py-6 gap-6 text-white font-medium text-base">
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span className="text-gray-200">Loading...</span>
            </div>
          ) : (
            <>
              <NavLinks
                isAdmin={isAdmin}
                isUploader={isUploader}
                onClick={toggleMenu}
              />
              {user && (
                <button
                  onClick={() => {
                    toggleMenu();
                    handleLogout();
                  }}
                  className="flex items-center gap-2 text-red-300 hover:text-red-500 transition"
                >
                  <LogOut size={18} /> Logout
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
