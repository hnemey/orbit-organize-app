import React, { useState } from 'react';
import { Task, Project } from '../../types';
import CalendarHeader from './CalendarHeader';
import UnscheduledSidebar from './UnscheduledSidebar';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
import YearView from './YearView';
import TaskModal from '../TaskModal';
import { addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, addYears, subYears } from 'date-fns';

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
  const [selectedProject, setSelectedProject] = useState('all');

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      switch (view) {
        case 'month':
          setCurrentDate(subMonths(currentDate, 1));
          break;
        case 'week':
          setCurrentDate(subWeeks(currentDate, 1));
          break;
        case 'day':
          setCurrentDate(subDays(currentDate, 1));
          break;
        case 'year':
          setCurrentDate(subYears(currentDate, 1));
          break;
      }
    } else {
      switch (view) {
        case 'month':
          setCurrentDate(addMonths(currentDate, 1));
          break;
        case 'week':
          setCurrentDate(addWeeks(currentDate, 1));
          break;
        case 'day':
          setCurrentDate(addDays(currentDate, 1));
          break;
        case 'year':
          setCurrentDate(addYears(currentDate, 1));
          break;
      }
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

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

  const handleTaskUnschedule = (taskId: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          scheduledDate: undefined,
          scheduledTime: undefined
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

  const handleTaskClick = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleMonthClick = (monthIndex: number) => {
    const newDate = new Date(currentDate.getFullYear(), monthIndex, 1);
    setCurrentDate(newDate);
    setView('month');
  };

  const unscheduledTasks = tasks.filter(task => !task.scheduledDate);
  const filteredUnscheduledTasks = selectedProject === 'all' 
    ? unscheduledTasks 
    : unscheduledTasks.filter(task => task.projectId === selectedProject);

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
        return <YearView 
          currentDate={currentDate} 
          tasks={tasks}
          projects={projects}
          onMonthClick={handleMonthClick}
        />;
      default:
        return <MonthView {...commonProps} />;
    }
  };

  return (
    <div className="max-w-full mx-auto px-4 py-8">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onNavigate={handleNavigate}
        onToday={handleToday}
      />

      <div className="flex gap-6 mt-6">
        <UnscheduledSidebar
          tasks={filteredUnscheduledTasks}
          projects={projects}
          selectedProject={selectedProject}
          onProjectChange={setSelectedProject}
          onTaskUnschedule={handleTaskUnschedule}
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
