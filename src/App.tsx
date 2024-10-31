import React from 'react';
import { useDarkMode } from './hooks/useDarkMode';
import SupabaseViewer from './components/SupabaseViewer';
import ThemeToggle from './components/ThemeToggle';

const App = () => {
  const [darkMode, setDarkMode] = useDarkMode();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`min-h-screen p-4 ${darkMode ? 'dark bg-dark-bg text-dark-text' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Supabase JSON Viewer</h1>
          <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        </div>
        <SupabaseViewer darkMode={darkMode} />
      </div>
    </div>
  );
};

export default App;