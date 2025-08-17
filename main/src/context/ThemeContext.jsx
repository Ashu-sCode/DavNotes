import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const getInitialTheme = () => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) return storedTheme;

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    const isDark = theme === "dark";

    // Add a smooth transition class temporarily
    root.classList.add("theme-transition");
    root.classList.toggle("dark", isDark);
    localStorage.setItem("theme", theme);

    // Remove transition class after animation ends
    const timeout = setTimeout(() => {
      root.classList.remove("theme-transition");
    }, 300); // match the CSS transition duration

    return () => clearTimeout(timeout);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
