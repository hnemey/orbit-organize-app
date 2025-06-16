
import React from 'react';
import { Task, Project } from '../../types';
import { format, isToday } from 'date-fns';

interface DailyCalendarProps {
  tasks: Task[];
  projects: Project[];
  onTaskComplete: (taskId: string) => void;
  onTaskEdit: (task: Task) => void;
}

const DailyCalendar: React.FC<DailyCalendarProps> = ({
  tasks,
  projects,
  onTaskComplete,
  onTaskEdit
}) => {
  const today = new Date();
  const dateStr = format(today, 'yyyy-MM-dd');
  const dayTasks = tasks.filter(task => task.scheduledDate === dateStr);

  const getProjectColor = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.color || '#3B82F6';
  };

  // Calculate task positions and heights
  const getTaskLayout = (task: Task) => {
    const startHour = task.scheduledTime ? parseInt(task.scheduledTime.split(':')[0]) : 9;
    const startMinute = task.scheduledTime ? parseInt(task.scheduledTime.split(':')[1]) : 0;
    const startSlot = startHour * 2 + (startMinute >= 30 ? 1 : 0);
    
    const durationSlots = Math.ceil(task.estimatedMinutes / 30);
    const height = Math.max(durationSlots * 16, 16); // 16px per slot, minimum 16px
    const top = startSlot * 16;
    
    return { top, height };
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Today's Calendar</h2>
        <div className="text-right">
          <div className="text-xs text-gray-400 uppercase tracking-wide">
            {format(today, 'EEE')}
          </div>
          <div className="text-xl font-bold text-blue-400">
            {format(today, 'd')}
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-300 mb-4">
        {format(today, 'EEEE, MMMM d, yyyy')}
      </div>

      {/* Time grid - showing 6AM to 10PM */}
      <div className="relative overflow-y-auto max-h-96">
        {Array.from({ length: 32 }, (_, i) => {
          const hour = Math.floor((i + 12) / 2); // Start from 6AM (6 + 6 = 12 slots from midnight)
          const minute = ((i + 12) % 2) * 30;
          
          if (hour >= 22) return null; // Stop at 10PM
          
          const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
          const ampm = hour >= 12 ? 'PM' : 'AM';
          const displayTime = minute === 0 ? `${hour12} ${ampm}` : '';

          return (
            <div key={i} className="flex border-b border-gray-600 h-4">
              <div className="w-16 px-1 text-xs text-gray-300 font-medium border-r border-gray-600 flex items-center">
                {displayTime}
              </div>
              <div className="flex-1 px-1 relative" />
            </div>
          );
        })}

        {/* Overlay tasks as positioned elements */}
        {dayTasks.map(task => {
          const { top, height } = getTaskLayout(task);
          return (
            <div
              key={task.id}
              className="absolute left-16 right-0 mx-1 px-2 py-1 rounded text-xs font-medium text-white cursor-pointer border-l-2 flex items-center hover:opacity-80 transition-opacity"
              style={{ 
                backgroundColor: getProjectColor(task.projectId),
                borderLeftColor: getProjectColor(task.projectId),
                top: `${Math.max(top - 192, 0)}px`, // Adjust for 6AM start (12 slots * 16px)
                height: `${height}px`,
                minHeight: '16px'
              }}
              title={`${task.name} - ${task.estimatedMinutes} minutes`}
              onClick={() => onTaskEdit(task)}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={(e) => {
                  e.stopPropagation();
                  onTaskComplete(task.id);
                }}
                className="w-3 h-3 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500 mr-2"
              />
              <span className="truncate">{task.name}</span>
            </div>
          );
        })}
      </div>

      {dayTasks.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <div className="text-3xl mb-2">📅</div>
          <p className="font-medium">No tasks scheduled for today</p>
        </div>
      )}
    </div>
  );
};

export default DailyCalendar;
