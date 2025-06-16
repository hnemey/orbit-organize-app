
import React from 'react';
import { TabType } from '../types';
import SettingsDropdown from './Settings/SettingsDropdown';
import { useTheme } from '../contexts/ThemeContext';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  const tabs: { key: TabType; label: string }[] = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'habits', label: 'Habits' },
    { key: 'projects', label: 'Projects' },
    { key: 'calendar', label: 'Calendar' },
  ];

  return (
    <nav className="bg-gray-800 dark:bg-gray-900 border-b border-gray-700 dark:border-gray-600 w-full">
      <div className="w-full px-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-gray-700 dark:bg-gray-800 text-white border-b-2 border-blue-500'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700 dark:hover:bg-gray-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="flex items-center">
            <SettingsDropdown 
              isDarkMode={isDarkMode}
              onThemeToggle={toggleTheme}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TabNavigation;
