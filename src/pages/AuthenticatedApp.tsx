
import React, { useState, useEffect } from 'react';
import { TabType, Habit, Project, Task } from '@/types';
import TabNavigation from '@/components/TabNavigation';
import HabitsPage from '@/components/Habits/HabitsPage';
import ProjectsPage from '@/components/Projects/ProjectsPage';
import CalendarPage from '@/components/Calendar/CalendarPage';
import SettingsDropdown from '@/components/Settings/SettingsDropdown';
import MainDashboard from '@/components/Dashboard/MainDashboard';
import { useTheme } from '@/contexts/ThemeContext';
import { loadHabits, saveHabits, loadProjects, saveProjects, loadTasks, saveTasks } from '@/utils/storage';

const AuthenticatedApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const { isDarkMode, toggleTheme } = useTheme();
  
  // State for habits, projects, and tasks
  const [habits, setHabits] = useState<Habit[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    console.log('Loading data from localStorage...');
    const loadedHabits = loadHabits();
    const loadedProjects = loadProjects();
    const loadedTasks = loadTasks();
    
    console.log('Loaded habits:', loadedHabits);
    console.log('Loaded projects:', loadedProjects);
    console.log('Loaded tasks:', loadedTasks);
    
    setHabits(loadedHabits);
    setProjects(loadedProjects);
    setTasks(loadedTasks);
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    if (habits.length > 0) {
      saveHabits(habits);
    }
  }, [habits]);

  useEffect(() => {
    if (projects.length > 0) {
      saveProjects(projects);
    }
  }, [projects]);

  useEffect(() => {
    if (tasks.length > 0) {
      saveTasks(tasks);
    }
  }, [tasks]);

  const handleTaskComplete = (taskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleTaskEdit = (task: Task) => {
    console.log('Edit task:', task);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <MainDashboard 
            tasks={tasks}
            projects={projects}
            habits={habits}
            onTaskComplete={handleTaskComplete}
            onTaskEdit={handleTaskEdit}
          />
        );
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
        return (
          <MainDashboard 
            tasks={tasks}
            projects={projects}
            habits={habits}
            onTaskComplete={handleTaskComplete}
            onTaskEdit={handleTaskEdit}
          />
        );
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
