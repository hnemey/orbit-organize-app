
import React, { useState } from 'react';
import { Task, Project } from '../../types';
import { addDays, startOfWeek, format, addMonths, addYears, startOfMonth } from 'date-fns';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import MonthlyView from './MonthlyView';
import YearlyView from './YearlyView';
import UnscheduledSidebar from './UnscheduledSidebar';

interface CalendarPageProps {
  tasks: Task[];
  projects: Project[];
  onTasksChange: (tasks: Task[]) => void;
}

type ViewType = 'daily' | 'weekly' | 'monthly' | 'yearly';

const CalendarPage: React.FC<CalendarPageProps> = ({ tasks, projects, onTasksChange }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>('weekly');
  const [selectedProject, setSelectedProject] = useState<string>('all');

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    onTasksChange(updatedTasks);
  };

  const handleTaskMove = (taskId: string, newDate: string, newTime: string) => {
    handleTaskUpdate(taskId, {
      scheduledDate: newDate,
      scheduledTime: newTime
    });
  };

  const handleTaskUnschedule = (taskId: string) => {
    handleTaskUpdate(taskId, {
      scheduledDate: undefined,
      scheduledTime: undefined
    });
  };

  const getViewDates = () => {
    if (view === 'weekly') {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    } else if (view === 'daily') {
      return [currentDate];
    }
    return [];
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const multiplier = direction === 'next' ? 1 : -1;
    
    switch (view) {
      case 'daily':
        setCurrentDate(prev => addDays(prev, multiplier));
        break;
      case 'weekly':
        setCurrentDate(prev => addDays(prev, multiplier * 7));
        break;
      case 'monthly':
        setCurrentDate(prev => addMonths(prev, multiplier));
        break;
      case 'yearly':
        setCurrentDate(prev => addYears(prev, multiplier));
        break;
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getUnscheduledTasks = () => {
    let unscheduled = tasks.filter(task => !task.scheduledDate && !task.completed);
    
    if (selectedProject !== 'all') {
      unscheduled = unscheduled.filter(task => task.projectId === selectedProject);
    }
    
    return unscheduled;
  };

  const getScheduledTasks = () => {
    if (view === 'monthly' || view === 'yearly') {
      return tasks.filter(task => task.scheduledDate);
    }
    
    const dates = getViewDates();
    return tasks.filter(task => {
      if (!task.scheduledDate) return false;
      return dates.some(date => format(date, 'yyyy-MM-dd') === task.scheduledDate);
    });
  };

  const renderCalendarView = () => {
    if (view === 'monthly') {
      return (
        <MonthlyView
          currentDate={currentDate}
          tasks={getScheduledTasks()}
          projects={projects}
          onTaskMove={handleTaskMove}
          onTaskUpdate={handleTaskUpdate}
          onTaskUnschedule={handleTaskUnschedule}
        />
      );
    }
    
    if (view === 'yearly') {
      return (
        <YearlyView
          currentDate={currentDate}
          tasks={getScheduledTasks()}
          projects={projects}
          onMonthClick={(month) => {
            setCurrentDate(startOfMonth(new Date(currentDate.getFullYear(), month)));
            setView('monthly');
          }}
        />
      );
    }

    return (
      <CalendarGrid
        dates={getViewDates()}
        tasks={getScheduledTasks()}
        projects={projects}
        onTaskMove={handleTaskMove}
        onTaskUpdate={handleTaskUpdate}
        onTaskUnschedule={handleTaskUnschedule}
      />
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onNavigate={navigateDate}
        onGoToToday={goToToday}
      />

      <div className="flex gap-6">
        <div className="flex-1">
          {renderCalendarView()}
        </div>

        <div className="w-80">
          <UnscheduledSidebar
            tasks={getUnscheduledTasks()}
            projects={projects}
            selectedProject={selectedProject}
            onProjectChange={setSelectedProject}
            onTaskMove={handleTaskMove}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
