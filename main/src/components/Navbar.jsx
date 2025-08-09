import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import toast from "react-hot-toast";
import clsx from "clsx";
import { ThemeContext } from "../context/ThemeContext";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ Loader state
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsAdmin(true); // Assume all logged-in users are admin
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false); // ✅ Stop loader after check
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
    toast.success("Logged out successfully.");
    setUser(null);
    setIsAdmin(false);
    navigate("/");
  };

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <>
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

            {/* Desktop Nav */}
            <div className="hidden md:flex gap-6 text-sm font-medium items-center">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span className="text-gray-200">Loading...</span>
                </div>
              ) : (
                <>
                  <Link to="/" className="hover:underline hover:text-gray-200">
                    Home
                  </Link>
                  <Link to="/notes" className="hover:underline hover:text-gray-200">
                    Notes
                  </Link>
                  <Link to="/assignments" className="hover:underline hover:text-gray-200">
                    Assignments
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="hover:underline hover:text-gray-200"
                    >
                      Admin
                    </Link>
                  )}
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

            {/* Mobile Toggle */}
            <div className="md:hidden flex items-center gap-4">
              <ThemeToggle />
              <button onClick={toggleMenu} aria-label="Toggle Menu">
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Background Blur */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleMenu}
        />
      )}

      {/* Slide-in Mobile Menu */}
      <div
        className={clsx(
          "fixed top-0 right-0 h-screen w-1/2 z-50 bg-blue-700 dark:bg-gray-800 shadow-lg transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full",
          "md:hidden"
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
              <Link to="/" onClick={toggleMenu} className="hover:text-gray-300">
                Home
              </Link>
              <Link to="/notes" onClick={toggleMenu} className="hover:text-gray-300">
                Notes
              </Link>
              <Link
                to="/assignments"
                onClick={toggleMenu}
                className="hover:text-gray-300"
              >
                Assignments
              </Link>
              {isAdmin && (
                <Link
                  to="/admin/dashboard"
                  onClick={toggleMenu}
                  className="hover:text-gray-300"
                >
                  Admin
                </Link>
              )}
              <ThemeToggle />
              {user && (
                <button
                  onClick={() => {
                    toggleMenu();
                    handleLogout();
                  }}
                  className="flex items-center gap-2 text-red-300 hover:text-red-500"
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
