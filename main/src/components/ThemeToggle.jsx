import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <motion.button
      onClick={toggleTheme}
      aria-label="Toggle Theme"
      title="Toggle Light/Dark Mode"
      className="p-2 rounded-full cursor-pointer transition-colors duration-300
                
                 focus:outline-non
                 text-gray-200 dark:text-yellow-400"
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.1 }}
      animate={{ rotate: theme === "dark" ? 360 : 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </motion.button>
  );
}
