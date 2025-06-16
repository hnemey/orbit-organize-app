
import React, { useState } from 'react';
import { Task, Project } from '../../types';
import { addDays, startOfWeek, format } from 'date-fns';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import UnscheduledSidebar from './UnscheduledSidebar';

interface CalendarPageProps {
  tasks: Task[];
  projects: Project[];
  onTasksChange: (tasks: Task[]) => void;
}

type ViewType = 'week' | 'day';

const CalendarPage: React.FC<CalendarPageProps> = ({ tasks, projects, onTasksChange }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>('week');
  const [timeWindowStart, setTimeWindowStart] = useState(8); // 8 AM
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
    if (view === 'week') {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      return Array.from({ length: 7 }, (_, i) => addDays(start, i));
    } else {
      return [currentDate];
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const days = view === 'week' ? 7 : 1;
    setCurrentDate(prev => addDays(prev, direction === 'next' ? days : -days));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const adjustTimeWindow = (direction: 'up' | 'down') => {
    setTimeWindowStart(prev => {
      const newStart = direction === 'up' ? prev - 2 : prev + 2;
      return Math.max(0, Math.min(12, newStart)); // 0 AM to 12 PM (so we can show 12 hours from there)
    });
  };

  const getUnscheduledTasks = () => {
    let unscheduled = tasks.filter(task => !task.scheduledDate && !task.completed);
    
    if (selectedProject !== 'all') {
      unscheduled = unscheduled.filter(task => task.projectId === selectedProject);
    }
    
    return unscheduled;
  };

  const getScheduledTasks = () => {
    const dates = getViewDates();
    return tasks.filter(task => {
      if (!task.scheduledDate) return false;
      return dates.some(date => format(date, 'yyyy-MM-dd') === task.scheduledDate);
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onNavigate={navigateDate}
        onGoToToday={goToToday}
        timeWindowStart={timeWindowStart}
        onTimeWindowChange={adjustTimeWindow}
      />

      <div className="flex gap-6">
        <div className="flex-1">
          <CalendarGrid
            dates={getViewDates()}
            tasks={getScheduledTasks()}
            projects={projects}
            timeWindowStart={timeWindowStart}
            onTaskMove={handleTaskMove}
            onTaskUpdate={handleTaskUpdate}
            onTaskUnschedule={handleTaskUnschedule}
          />
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
