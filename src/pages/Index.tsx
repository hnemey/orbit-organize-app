
import React, { useState, useEffect } from 'react';
import TabNavigation from '../components/TabNavigation';
import DailyCalendar from '../components/Dashboard/DailyCalendar';
import TodoList from '../components/Dashboard/TodoList';
import HabitProgressChart from '../components/Dashboard/HabitProgressChart';
import Timer from '../components/Dashboard/Timer';
import HabitsPage from '../components/Habits/HabitsPage';
import ProjectsPage from '../components/Projects/ProjectsPage';
import CalendarPage from '../components/Calendar/CalendarPage';
import TaskModal from '../components/TaskModal';
import { TabType, Habit, Task, Project } from '../types';
import { loadHabits, saveHabits, loadProjects, saveProjects, loadTasks, saveTasks } from '../utils/storage';

const Index = () => {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [habits, setHabits] = useState<Habit[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  // Load data on mount
  useEffect(() => {
    setHabits(loadHabits());
    setProjects(loadProjects());
    setTasks(loadTasks());
  }, []);

  // Save data when state changes
  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const handleTaskComplete = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const handleTaskEdit = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskSave = (taskData: Omit<Task, 'id'>) => {
    if (editingTask) {
      // Update existing task
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id ? { ...taskData, id: editingTask.id } : task
      ));
    } else {
      // Create new task
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      };
      setTasks(prev => [...prev, newTask]);
    }
    setEditingTask(undefined);
  };

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(undefined);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="min-h-screen w-full px-4 py-8">
            <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
            
            {/* 3-column grid layout */}
            <div className="grid grid-cols-3 gap-8 h-full">
              {/* First column - Daily Calendar */}
              <div className="col-span-1">
                <DailyCalendar
                  tasks={tasks}
                  projects={projects}
                  onTaskComplete={handleTaskComplete}
                  onTaskEdit={handleTaskEdit}
                />
              </div>

              {/* Second and third columns - Stacked components */}
              <div className="col-span-2 space-y-8">
                {/* Todo List spans both columns */}
                <TodoList
                  tasks={tasks}
                  projects={projects}
                  onTaskComplete={handleTaskComplete}
                  onTaskEdit={handleTaskEdit}
                />

                {/* Daily Habit Progress spans both columns */}
                <HabitProgressChart habits={habits} />

                {/* Timer spans both columns */}
                <Timer />
              </div>
            </div>
          </div>
        );
      case 'habits':
        return (
          <HabitsPage
            habits={habits}
            onHabitsChange={setHabits}
          />
        );
      case 'projects':
        return (
          <ProjectsPage
            projects={projects}
            tasks={tasks}
            onProjectsChange={setProjects}
            onTasksChange={setTasks}
          />
        );
      case 'calendar':
        return (
          <CalendarPage
            tasks={tasks}
            projects={projects}
            onTasksChange={setTasks}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 w-full">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {renderContent()}

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={handleCloseTaskModal}
        onSave={handleTaskSave}
        task={editingTask}
        projects={projects}
      />

      {/* Floating Action Button - only show on dashboard */}
      {activeTab === 'dashboard' && (
        <button
          onClick={() => setIsTaskModalOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Index;
