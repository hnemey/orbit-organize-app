
import React, { useState } from 'react';
import { TabType } from '@/types';
import TabNavigation from '@/components/TabNavigation';
import Index from '@/pages/Index';
import HabitsPage from '@/components/Habits/HabitsPage';
import ProjectsPage from '@/components/Projects/ProjectsPage';
import CalendarPage from '@/components/Calendar/CalendarPage';
import SettingsDropdown from '@/components/Settings/SettingsDropdown';
import UserProfile from '@/components/Auth/UserProfile';
import { useTheme } from '@/contexts/ThemeContext';

const AuthenticatedApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const { isDarkMode, toggleTheme } = useTheme();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Index />;
      case 'habits':
        return <HabitsPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'calendar':
        return <CalendarPage />;
      default:
        return <Index />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className="flex flex-col h-screen">
        {/* Header */}
        <header className="bg-gray-800 dark:bg-gray-900 text-white px-6 py-4 flex items-center justify-between border-b border-gray-700">
          <h1 className="text-xl font-semibold">Productivity Dashboard</h1>
          <div className="flex items-center space-x-4">
            <SettingsDropdown 
              isDarkMode={isDarkMode} 
              onThemeToggle={toggleTheme} 
            />
            <UserProfile />
          </div>
        </header>

        {/* Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AuthenticatedApp;
