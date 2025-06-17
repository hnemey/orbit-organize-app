
import React, { useState } from 'react';
import { TabType, Habit, Project, Task } from '@/types';
import TabNavigation from '@/components/TabNavigation';
import HabitsPage from '@/components/Habits/HabitsPage';
import ProjectsPage from '@/components/Projects/ProjectsPage';
import CalendarPage from '@/components/Calendar/CalendarPage';
import SettingsDropdown from '@/components/Settings/SettingsDropdown';
import UserProfile from '@/components/Auth/UserProfile';
import { useTheme } from '@/contexts/ThemeContext';

const AuthenticatedApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const { isDarkMode, toggleTheme } = useTheme();
  
  // State for habits, projects, and tasks
  const [habits, setHabits] = useState<Habit[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <div className="p-8 text-white">
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
          <p className="text-gray-300">Welcome to your productivity dashboard!</p>
        </div>;
      case 'habits':
        return <HabitsPage habits={habits} onHabitsChange={setHabits} />;
      case 'projects':
        return <ProjectsPage 
          projects={projects} 
          tasks={tasks}
          onProjectsChange={setProjects}
          onTasksChange={setTasks}
        />;
      case 'calendar':
        return <CalendarPage 
          tasks={tasks}
          projects={projects}
          onTasksChange={setTasks}
        />;
      default:
        return <div className="p-8 text-white">
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
          <p className="text-gray-300">Welcome to your productivity dashboard!</p>
        </div>;
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
