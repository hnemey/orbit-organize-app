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
    <nav className="bg-card border-b border-border w-full transition-colors duration-300">
      <div className="w-full px-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`px-6 py-4 text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-accent text-foreground border-b-2 border-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
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
