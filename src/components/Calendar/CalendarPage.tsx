import React, { useState } from 'react';
import { Task, Project } from '../../types';
import CalendarHeader from './CalendarHeader';
import UnscheduledSidebar from './UnscheduledSidebar';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
import YearView from './YearView';
import TaskModal from '../TaskModal';

interface CalendarPageProps {
  tasks: Task[];
  projects: Project[];
  onTasksChange: (tasks: Task[]) => void;
}

const CalendarPage: React.FC<CalendarPageProps> = ({
  tasks,
  projects,
  onTasksChange
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day' | 'year'>('month');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  const handleTaskMove = (taskId: string, newDate: string, newTime?: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          scheduledDate: newDate,
          scheduledTime: newTime || task.scheduledTime
        };
      }
      return task;
    });
    onTasksChange(updatedTasks);
  };

  const handleTaskSave = (taskData: Partial<Task>) => {
    if (editingTask) {
      const updatedTasks = tasks.map(task =>
        task.id === editingTask.id ? { ...task, ...taskData } : task
      );
      onTasksChange(updatedTasks);
    } else {
      const newTask: Task = {
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: taskData.name || '',
        notes: taskData.notes || '',
        priority: taskData.priority || 'medium',
        urgency: taskData.urgency || 'medium',
        estimatedMinutes: taskData.estimatedMinutes || 30,
        completed: taskData.completed || false,
        projectId: taskData.projectId || projects[0]?.id || '',
        scheduledDate: taskData.scheduledDate,
        scheduledTime: taskData.scheduledTime,
        createdAt: new Date().toISOString()
      };
      onTasksChange([...tasks, newTask]);
    }
    setEditingTask(undefined);
    setIsTaskModalOpen(false);
  };

  const handleTaskDelete = () => {
    if (editingTask) {
      const updatedTasks = tasks.filter(task => task.id !== editingTask.id);
      onTasksChange(updatedTasks);
      setEditingTask(undefined);
      setIsTaskModalOpen(false);
    }
  };

  const handleToggleTask = (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    onTasksChange(updatedTasks);
  };

  const handleTaskClick = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const unscheduledTasks = tasks.filter(task => !task.scheduledDate);

  const renderCalendarView = () => {
    const commonProps = {
      currentDate,
      tasks,
      projects,
      onTaskMove: handleTaskMove,
      onTaskClick: handleTaskClick
    };

    switch (view) {
      case 'month':
        return <MonthView {...commonProps} />;
      case 'week':
        return <WeekView {...commonProps} />;
      case 'day':
        return <DayView {...commonProps} />;
      case 'year':
        return <YearView currentDate={currentDate} />;
      default:
        return <MonthView {...commonProps} />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <CalendarHeader
        currentDate={currentDate}
        onDateChange={setCurrentDate}
        view={view}
        onViewChange={setView}
      />

      <div className="flex gap-6 mt-6">
        <UnscheduledSidebar
          tasks={unscheduledTasks}
          projects={projects}
          onToggleTask={handleToggleTask}
          onTaskClick={handleTaskClick}
          onAddTask={() => setIsTaskModalOpen(true)}
        />

        {renderCalendarView()}
      </div>

      {isTaskModalOpen && (
        <TaskModal
          isOpen={isTaskModalOpen}
          task={editingTask}
          onClose={() => {
            setIsTaskModalOpen(false);
            setEditingTask(undefined);
          }}
          onSave={handleTaskSave}
          onDelete={editingTask ? handleTaskDelete : undefined}
          projects={projects}
        />
      )}
    </div>
  );
};

export default CalendarPage;
