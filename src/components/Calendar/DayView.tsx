
import React, { useEffect, useRef } from 'react';
import { Task, Project } from '../../types';
import { format, isToday } from 'date-fns';

interface DayViewProps {
  currentDate: Date;
  tasks: Task[];
  projects: Project[];
  onTaskMove: (taskId: string, newDate: string) => void;
}

const DayView: React.FC<DayViewProps> = ({
  currentDate,
  tasks,
  projects,
  onTaskMove
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dateStr = format(currentDate, 'yyyy-MM-dd');
  const dayTasks = tasks.filter(task => task.scheduledDate === dateStr);

  // Scroll to 6AM on component mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      // 6AM is the 12th slot (index 12 * 2 = 24 in 30-minute intervals)
      const sixAmSlot = 12 * 2; // 6AM in 30-minute slots
      const slotHeight = 32; // Approximate height of each time slot
      scrollContainerRef.current.scrollTop = sixAmSlot * slotHeight;
    }
  }, []);

  const getProjectColor = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.color || '#3B82F6';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    onTaskMove(taskId, dateStr);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex-1 bg-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden h-[1200px] flex flex-col">
      {/* Header with day and date */}
      <div className="bg-gray-700 px-6 py-4 border-b border-gray-600">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-medium text-white">
              {format(currentDate, 'EEEE, MMMM d, yyyy')}
            </h2>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400 uppercase tracking-wide">
              {format(currentDate, 'EEE')}
            </div>
            <div className={`text-2xl font-bold ${isToday(currentDate) ? 'text-blue-400' : 'text-white'}`}>
              {format(currentDate, 'd')}
            </div>
          </div>
        </div>
      </div>

      {/* Time column header */}
      <div className="bg-gray-700 px-6 py-3 border-b border-gray-600">
        <h3 className="text-sm font-medium text-gray-300">Time</h3>
      </div>

      {/* Time grid - scrollable through all 24 hours */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {/* Generate all 48 time slots for full 24 hours */}
        {Array.from({ length: 48 }, (_, i) => {
          const hour = Math.floor(i / 2);
          const minute = (i % 2) * 30;
          const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          
          // Convert to 12-hour format for display
          const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
          const ampm = hour >= 12 ? 'PM' : 'AM';
          const displayTime = minute === 0 ? `${hour12} ${ampm}` : '';

          const tasksAtTime = dayTasks.filter(task => {
            if (!task.scheduledTime) return time24 === '09:00'; // Default unscheduled tasks to 9 AM
            return task.scheduledTime.startsWith(time24.substring(0, 2));
          });

          return (
            <div key={i} className="flex border-b border-gray-600 hover:bg-gray-700 h-8">
              {/* Time column */}
              <div className="w-24 px-3 py-1 text-xs text-gray-300 font-medium border-r border-gray-600 flex items-center">
                {displayTime}
              </div>
              
              {/* Task area */}
              <div className="flex-1 px-3 py-1 flex items-center">
                {tasksAtTime.map(task => (
                  <div
                    key={task.id}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white mb-1 mr-2 cursor-pointer"
                    style={{ backgroundColor: getProjectColor(task.projectId) }}
                    title={`${task.name} - ${task.estimatedMinutes} minutes`}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('text/plain', task.id)}
                  >
                    {task.name}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DayView;
