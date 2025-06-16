
import React, { useState } from 'react';
import { Task, Project } from '../../types';
import { addDays, addMonths, addYears, startOfMonth, addWeeks } from 'date-fns';
import CalendarHeader from './CalendarHeader';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';
import YearView from './YearView';
import UnscheduledSidebar from './UnscheduledSidebar';

interface CalendarPageProps {
  tasks: Task[];
  projects: Project[];
  onTasksChange: (tasks: Task[]) => void;
}

type ViewType = 'month' | 'week' | 'day' | 'year';

const CalendarPage: React.FC<CalendarPageProps> = ({ 
  tasks, 
  projects, 
  onTasksChange 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewType>('month');
  const [selectedProject, setSelectedProject] = useState<string>('all');

  const handleTaskMove = (taskId: string, newDate: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId 
        ? { ...task, scheduledDate: newDate, scheduledTime: undefined }
        : task
    );
    onTasksChange(updatedTasks);
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const multiplier = direction === 'next' ? 1 : -1;
    
    switch (view) {
      case 'day':
        setCurrentDate(prev => addDays(prev, multiplier));
        break;
      case 'week':
        setCurrentDate(prev => addWeeks(prev, multiplier));
        break;
      case 'month':
        setCurrentDate(prev => addMonths(prev, multiplier));
        break;
      case 'year':
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
    return tasks.filter(task => task.scheduledDate);
  };

  const renderCalendarView = () => {
    const scheduledTasks = getScheduledTasks();
    
    switch (view) {
      case 'year':
        return (
          <YearView
            currentDate={currentDate}
            tasks={scheduledTasks}
            projects={projects}
            onMonthClick={(month) => {
              setCurrentDate(startOfMonth(new Date(currentDate.getFullYear(), month)));
              setView('month');
            }}
          />
        );
      case 'week':
        return (
          <WeekView
            currentDate={currentDate}
            tasks={scheduledTasks}
            projects={projects}
            onTaskMove={handleTaskMove}
          />
        );
      case 'day':
        return (
          <DayView
            currentDate={currentDate}
            tasks={scheduledTasks}
            projects={projects}
            onTaskMove={handleTaskMove}
          />
        );
      default:
        return (
          <MonthView
            currentDate={currentDate}
            tasks={scheduledTasks}
            projects={projects}
            onTaskMove={handleTaskMove}
          />
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto min-h-screen">
      <div className="px-4 py-8">
        <CalendarHeader
          currentDate={currentDate}
          view={view}
          onViewChange={setView}
          onNavigate={navigateDate}
          onToday={goToToday}
        />

        <div className="flex gap-6 h-full">
          {/* Show calendar for day and week views on the left */}
          {(view === 'day' || view === 'week') && (
            <div className="flex-1">
              {renderCalendarView()}
            </div>
          )}

          {/* Show unscheduled sidebar for day and week views on the right */}
          {(view === 'day' || view === 'week') && (
            <div className="w-80 h-full">
              <UnscheduledSidebar
                tasks={getUnscheduledTasks()}
                projects={projects}
                selectedProject={selectedProject}
                onProjectChange={setSelectedProject}
              />
            </div>
          )}

          {/* Show calendar for month view on the left, sidebar on the right */}
          {view === 'month' && (
            <>
              <div className="flex-1">
                {renderCalendarView()}
              </div>
              <div className="w-80 h-full">
                <UnscheduledSidebar
                  tasks={getUnscheduledTasks()}
                  projects={projects}
                  selectedProject={selectedProject}
                  onProjectChange={setSelectedProject}
                />
              </div>
            </>
          )}

          {/* Show only calendar for year view - no sidebar */}
          {view === 'year' && (
            <div className="flex-1">
              {renderCalendarView()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
