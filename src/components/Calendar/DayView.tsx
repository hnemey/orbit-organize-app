
import React from 'react';
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
  const dateStr = format(currentDate, 'yyyy-MM-dd');
  const dayTasks = tasks.filter(task => task.scheduledDate === dateStr);

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

  // Generate 30-minute time slots from 6:00 AM to 6:00 PM (12 hours)
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = Math.floor(i / 2) + 6; // Start at 6 AM
    const minute = (i % 2) * 30;
    const time24 = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    
    // Convert to 12-hour format for display
    const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayTime = minute === 0 ? `${hour12} ${ampm}` : '';
    
    return { time24, displayTime };
  });

  return (
    <div className="flex-1 bg-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden h-[1200px]">
      {/* Header with day and date */}
      <div className="bg-gray-700 px-10 py-8 border-b border-gray-600">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-medium text-white">
              {format(currentDate, 'EEEE, MMMM d, yyyy')}
            </h2>
          </div>
          <div className="text-right">
            <div className="text-lg text-gray-400 uppercase tracking-wide">
              {format(currentDate, 'EEE')}
            </div>
            <div className={`text-4xl font-bold ${isToday(currentDate) ? 'text-blue-400' : 'text-white'}`}>
              {format(currentDate, 'd')}
            </div>
          </div>
        </div>
      </div>

      {/* Time column header */}
      <div className="bg-gray-700 px-10 py-6 border-b border-gray-600">
        <h3 className="text-lg font-medium text-gray-300">Time</h3>
      </div>

      {/* Time grid */}
      <div 
        className="overflow-y-auto h-full"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {timeSlots.map((slot, index) => {
          const tasksAtTime = dayTasks.filter(task => {
            if (!task.scheduledTime) return slot.time24 === '09:00'; // Default unscheduled tasks to 9 AM
            return task.scheduledTime.startsWith(slot.time24.substring(0, 2));
          });

          return (
            <div key={index} className="flex border-b border-gray-600 hover:bg-gray-700">
              {/* Time column */}
              <div className="w-32 px-8 py-4 text-lg text-gray-300 font-medium border-r border-gray-600">
                {slot.displayTime}
              </div>
              
              {/* Task area */}
              <div className="flex-1 px-8 py-4 min-h-16">
                {tasksAtTime.map(task => (
                  <div
                    key={task.id}
                    className="inline-flex items-center px-5 py-3 rounded-full text-lg font-medium text-white mb-3 mr-4 cursor-pointer"
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
