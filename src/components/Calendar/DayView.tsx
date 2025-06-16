
import React, { useEffect, useRef } from 'react';
import { Task, Project } from '../../types';
import { format, isToday } from 'date-fns';

interface DayViewProps {
  currentDate: Date;
  tasks: Task[];
  projects: Project[];
  onTaskMove: (taskId: string, newDate: string, newTime?: string) => void;
  onTaskClick?: (task: Task) => void;
}

const DayView: React.FC<DayViewProps> = ({
  currentDate,
  tasks,
  projects,
  onTaskMove,
  onTaskClick
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dateStr = format(currentDate, 'yyyy-MM-dd');
  const dayTasks = tasks.filter(task => task.scheduledDate === dateStr);

  // Scroll to 6AM on component mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      const sixAmSlot = 12 * 2;
      const slotHeight = 24;
      scrollContainerRef.current.scrollTop = sixAmSlot * slotHeight;
    }
  }, []);

  const getProjectColor = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.color || '#3B82F6';
  };

  const handleDrop = (e: React.DragEvent, timeSlot?: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    onTaskMove(taskId, dateStr, timeSlot);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Calculate task positions and heights
  const getTaskLayout = (task: Task) => {
    const startHour = task.scheduledTime ? parseInt(task.scheduledTime.split(':')[0]) : 9;
    const startMinute = task.scheduledTime ? parseInt(task.scheduledTime.split(':')[1]) : 0;
    const startSlot = startHour * 2 + (startMinute >= 30 ? 1 : 0);
    
    const durationSlots = Math.ceil(task.estimatedMinutes / 30);
    const height = durationSlots * 24; // 24px per slot
    const top = startSlot * 24;
    
    return { top, height };
  };

  return (
    <div className="flex-1 bg-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden h-[800px] flex flex-col">
      {/* Header with day and date */}
      <div className="bg-gray-700 px-4 py-3 border-b border-gray-600">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-white">
              {format(currentDate, 'EEEE, MMMM d, yyyy')}
            </h2>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-400 uppercase tracking-wide">
              {format(currentDate, 'EEE')}
            </div>
            <div className={`text-xl font-bold ${isToday(currentDate) ? 'text-blue-400' : 'text-white'}`}>
              {format(currentDate, 'd')}
            </div>
          </div>
        </div>
      </div>

      {/* Time column header */}
      <div className="bg-gray-700 px-4 py-2 border-b border-gray-600">
        <h3 className="text-xs font-medium text-gray-300">Time</h3>
      </div>

      {/* Time grid - scrollable through all 24 hours */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto relative"
      >
        {/* Background time slots */}
        {Array.from({ length: 48 }, (_, i) => {
          const hour = Math.floor(i / 2);
          const minute = (i % 2) * 30;
          const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          
          const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
          const ampm = hour >= 12 ? 'PM' : 'AM';
          const displayTime = minute === 0 ? `${hour12} ${ampm}` : '';

          return (
            <div key={i} className="flex border-b border-gray-600 hover:bg-gray-700 h-6">
              <div className="w-20 px-2 py-1 text-xs text-gray-300 font-medium border-r border-gray-600 flex items-center">
                {displayTime}
              </div>
              <div 
                className="flex-1 px-2 py-1"
                onDrop={(e) => handleDrop(e, time24)}
                onDragOver={handleDragOver}
              />
            </div>
          );
        })}

        {/* Overlay tasks as positioned elements */}
        {dayTasks.map(task => {
          const { top, height } = getTaskLayout(task);
          return (
            <div
              key={task.id}
              className="absolute left-20 right-0 mx-2 px-2 py-1 rounded text-xs font-medium text-white cursor-pointer border-l-4 flex items-center hover:opacity-80 transition-opacity"
              style={{ 
                backgroundColor: getProjectColor(task.projectId),
                borderLeftColor: getProjectColor(task.projectId),
                top: `${top}px`,
                height: `${height}px`,
                minHeight: '24px'
              }}
              title={`${task.name} - ${task.estimatedMinutes} minutes`}
              draggable
              onDragStart={(e) => e.dataTransfer.setData('text/plain', task.id)}
              onClick={() => onTaskClick?.(task)}
            >
              <span className="truncate">{task.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DayView;
