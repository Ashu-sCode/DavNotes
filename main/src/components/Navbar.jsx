// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import toast from "react-hot-toast";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../api/firebase";
import ThemeToggle from "./ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(""); // admin, uploader, or ""
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Listen for auth state changes and fetch role
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userRef);
          const userRole = userDoc.exists()
            ? (userDoc.data().role || "").trim().toLowerCase()
            : "";
          setRole(userRole);
          setUser(currentUser);
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      } else {
        setUser(null);
        setRole("");
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
    setRole("");
    navigate("/");
  };

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const navLinks = [
   
    { label: "Resources", to: "/programs" },  { label: "About", to: "/about" },{ label: "Contact", to: "/contact" },{ label: "Home", to: "/" },
    ...(role === "admin" ? [{ label: "Admin Dashboard", to: "/admin/dashboard" }] : []),
    ...(role === "uploader" ? [{ label: "Uploader Dashboard", to: "/uploader/dashboard" }] : []),
  ];

  return (
    <>
      {/* Navbar */}
      <nav className="bg-blue-600 dark:bg-gray-900 text-white shadow-md fixed w-full z-50 top-0 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="text-xl font-bold tracking-wide">
              <Link to="/" className="hover:text-gray-200 transition-colors">
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
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="hover:underline hover:text-gray-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
              onClick={toggleMenu}
            />

            {/* Slide-in Menu */}
            <motion.div
              key="mobileMenu"
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-16 right-0 h-[calc(100vh-4rem)] w-3/4 max-w-xs z-50 bg-blue-700 dark:bg-gray-800 shadow-lg md:hidden"
            >
              <motion.div
                className="flex flex-col px-6 py-6 gap-6 text-white font-medium text-base"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 1 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
                }}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span className="text-gray-200">Loading...</span>
                  </div>
                ) : (
                  <>
                    {navLinks.map((link) => (
                      <motion.div
                        key={link.to}
                        variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                        transition={{ duration: 0.3 }}
                      >
                        <Link to={link.to} onClick={toggleMenu} className="hover:underline hover:text-gray-300">
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}

                    {user && (
                      <motion.div
                        variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                        transition={{ duration: 0.3 }}
                      >
                        <button
                          onClick={() => {
                            toggleMenu();
                            handleLogout();
                          }}
                          className="flex items-center gap-2 text-red-300 hover:text-red-500 transition"
                        >
                          <LogOut size={18} /> Logout
                        </button>
                      </motion.div>
                    )}
                  </>
                )}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
