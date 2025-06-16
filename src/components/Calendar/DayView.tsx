
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

  const timeSlots = Array.from({ length: 24 }, (_, i) => i);

  return (
    <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white">
          {format(currentDate, 'EEEE, MMMM d, yyyy')}
          {isToday(currentDate) && (
            <span className="ml-2 text-sm bg-blue-600 text-white px-2 py-1 rounded">Today</span>
          )}
        </h2>
      </div>

      <div
        className="p-4 min-h-96"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <div className="space-y-4">
          {timeSlots.map(hour => (
            <div key={hour} className="flex items-start gap-4 min-h-12">
              <div className="w-16 text-sm text-gray-400 font-medium">
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </div>
              <div className="flex-1 border-l border-gray-700 pl-4">
                {dayTasks
                  .filter(task => {
                    const taskHour = task.scheduledTime ? parseInt(task.scheduledTime.split(':')[0]) : 9;
                    return taskHour === hour;
                  })
                  .map(task => (
                    <div
                      key={task.id}
                      className="text-sm p-2 rounded text-white mb-2 cursor-pointer"
                      style={{ backgroundColor: getProjectColor(task.projectId) }}
                      title={task.name}
                      draggable
                      onDragStart={(e) => e.dataTransfer.setData('text/plain', task.id)}
                    >
                      {task.name}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DayView;
