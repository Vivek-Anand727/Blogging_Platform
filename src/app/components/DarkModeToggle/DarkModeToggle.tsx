"use client"

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const DarkModeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const storedMode = localStorage.getItem("darkMode");
    if (storedMode === "true") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      if (newMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("darkMode", "true");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("darkMode", "false");
      }
      return newMode;
    });
  };

  return (
    <div
      className="flex items-center space-x-3 cursor-pointer"
      onClick={toggleDarkMode}
    >
      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {isDarkMode ? "Dark Mode" : "Light Mode"}
      </span>
      <div className="relative w-12 h-6 flex items-center bg-gray-600 dark:bg-gray-300 rounded-full p-1 transition-all">
        <div
          className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-all ${
            isDarkMode ? "translate-x-6" : "translate-x-0"
          }`}
        />
      </div>
    </div>
  );
};

export default DarkModeToggle;
