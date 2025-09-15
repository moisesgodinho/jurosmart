// components/ThemeSwitcher.js
'use client';

export default function ThemeSwitcher({ isDarkMode, toggleTheme }) {
  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      aria-label="Toggle Dark Mode"
    >
      {isDarkMode ? '☀️' : '🌙'}
    </button>
  );
}