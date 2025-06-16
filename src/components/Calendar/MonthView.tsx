import React from 'react';
import { Task, Project } from '../../types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isToday, isSameMonth } from 'date-fns';

interface MonthViewProps {
  currentDate: Date;
  tasks: Task[];
  projects: Project[];
  onTaskMove: (taskId: string, newDate: string) => void;
}

const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  tasks,
  projects,
  onTaskMove
}) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

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

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden h-[800px]">
      {/* Week day headers */}
      <div className="grid grid-cols-7 bg-gray-700 border-b border-gray-600">
        {weekDays.map(day => (
          <div key={day} className="p-4 text-center border-r last:border-r-0 border-gray-600">
            <span className="text-base font-medium text-gray-300">{day}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 h-full">
        {days.map(date => {
          const dayTasks = getTasksForDate(date);
          const isCurrentMonth = isSameMonth(date, currentDate);
          const isCurrentDay = isToday(date);

          return (
            <div
              key={format(date, 'yyyy-MM-dd')}
              className={`min-h-24 h-full border-r border-b border-gray-600 last:border-r-0 p-3 ${
                !isCurrentMonth ? 'bg-gray-900 text-gray-500' : 'bg-gray-800'
              } ${isCurrentDay ? 'bg-gray-700' : ''}`}
              onDrop={(e) => handleDrop(e, date)}
              onDragOver={handleDragOver}
            >
              <div className={`text-base font-medium mb-3 ${
                isCurrentDay ? 'text-blue-400' : isCurrentMonth ? 'text-white' : 'text-gray-500'
              }`}>
                {format(date, 'd')}
              </div>

              <div className="space-y-1">
                {dayTasks.slice(0, 4).map(task => (
                  <div
                    key={task.id}
                    className="text-sm p-2 rounded text-white truncate cursor-pointer"
                    style={{ backgroundColor: getProjectColor(task.projectId) }}
                    title={task.name}
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData('text/plain', task.id)}
                  >
                    {task.name}
                  </div>
                ))}
                {dayTasks.length > 4 && (
                  <div className="text-sm text-gray-400">
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

export default MonthView;
