import React from 'react';
import { Cloud, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <header className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-400 to-blue-500 dark:from-blue-900 dark:to-blue-800 text-white shadow-md transition-colors duration-300">
      <div className="flex items-center space-x-2">
        <Cloud className="h-8 w-8" />
        <h1 className="text-2xl font-bold">WeatherView</h1>
      </div>
      
      <button 
        onClick={toggleTheme}
        className="p-2 rounded-full hover:bg-blue-600/30 dark:hover:bg-blue-700/50 transition-colors duration-200"
        aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
      >
        {theme === 'light' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
      </button>
    </header>
  );
}