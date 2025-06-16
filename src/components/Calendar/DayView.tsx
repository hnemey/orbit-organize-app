
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

  // Generate time slots from 00:00 to 23:00
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  return (
    <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header with day and date */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900">
              {format(currentDate, 'EEEE, MMMM d, yyyy')}
            </h2>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500 uppercase tracking-wide">
              {format(currentDate, 'EEE')}
            </div>
            <div className={`text-2xl font-bold ${isToday(currentDate) ? 'text-blue-600' : 'text-gray-900'}`}>
              {format(currentDate, 'd')}
            </div>
          </div>
        </div>
      </div>

      {/* Time column header */}
      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700">Time</h3>
      </div>

      {/* Time grid */}
      <div 
        className="overflow-y-auto max-h-96"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {timeSlots.map((timeSlot) => {
          const tasksAtTime = dayTasks.filter(task => {
            if (!task.scheduledTime) return timeSlot === '09:00'; // Default unscheduled tasks to 9 AM
            return task.scheduledTime.startsWith(timeSlot.substring(0, 2));
          });

          return (
            <div key={timeSlot} className="flex border-b border-gray-100 hover:bg-gray-50">
              {/* Time column */}
              <div className="w-20 px-4 py-3 text-sm text-gray-500 font-medium border-r border-gray-100">
                {timeSlot}
              </div>
              
              {/* Task area */}
              <div className="flex-1 px-4 py-3 min-h-12">
                {tasksAtTime.map(task => (
                  <div
                    key={task.id}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-white mb-1 mr-2 cursor-pointer"
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
