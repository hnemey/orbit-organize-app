
import React from 'react';
import { Task, Project } from '../../types';
import { format, startOfWeek, addDays, isToday, isSameDay } from 'date-fns';

interface WeekViewProps {
  currentDate: Date;
  tasks: Task[];
  projects: Project[];
  onTaskMove: (taskId: string, newDate: string) => void;
}

const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  tasks,
  projects,
  onTaskMove
}) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getTasksForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return tasks.filter(task => task.scheduledDate === dateStr);
  };

  const getProjectColor = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.color || '#3B82F6';
  };

  const handleDrop = (e: React.DragEvent, date: Date) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    const dateStr = format(date, 'yyyy-MM-dd');
    onTaskMove(taskId, dateStr);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden">
      {/* Week day headers */}
      <div className="grid grid-cols-7 bg-gray-700 border-b border-gray-600">
        {weekDays.map(day => (
          <div key={format(day, 'yyyy-MM-dd')} className="p-4 text-center border-r last:border-r-0 border-gray-600">
            <div className="text-sm font-medium text-gray-300">{format(day, 'EEE')}</div>
            <div className={`text-lg font-semibold mt-1 ${
              isToday(day) ? 'text-blue-400' : 'text-white'
            }`}>
              {format(day, 'd')}
            </div>
          </div>
        ))}
      </div>

      {/* Week grid */}
      <div className="grid grid-cols-7 h-96">
        {weekDays.map(date => {
          const dayTasks = getTasksForDate(date);
          const isCurrentDay = isToday(date);

          return (
            <div
              key={format(date, 'yyyy-MM-dd')}
              className={`border-r border-gray-600 last:border-r-0 p-2 ${
                isCurrentDay ? 'bg-gray-700' : 'bg-gray-800'
              }`}
              onDrop={(e) => handleDrop(e, date)}
              onDragOver={handleDragOver}
            >
              <div className="space-y-1">
                {dayTasks.slice(0, 4).map(task => (
                  <div
                    key={task.id}
                    className="text-xs p-1 rounded text-white truncate cursor-pointer"
                    style={{ backgroundColor: getProjectColor(task.projectId) }}
                    title={task.name}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('text/plain', task.id)}
                  >
                    {task.name}
                  </div>
                ))}
                {dayTasks.length > 4 && (
                  <div className="text-xs text-gray-400">
                    +{dayTasks.length - 4} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekView;
