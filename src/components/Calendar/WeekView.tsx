import React, { useEffect, useRef } from 'react';
import { Task, Project } from '../../types';
import { format, startOfWeek, addDays, isToday } from 'date-fns';

interface WeekViewProps {
  currentDate: Date;
  tasks: Task[];
  projects: Project[];
  onTaskMove: (taskId: string, newDate: string, newTime?: string) => void;
}

const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  tasks,
  projects,
  onTaskMove
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Scroll to 6AM on component mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      // 6AM is the 12th slot (index 12 * 2 = 24 in 30-minute intervals)
      const sixAmSlot = 12 * 2; // 6AM in 30-minute slots
      const slotHeight = 32; // Approximate height of each time slot
      scrollContainerRef.current.scrollTop = sixAmSlot * slotHeight;
    }
  }, []);

  const getTasksForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return tasks.filter(task => task.scheduledDate === dateStr);
  };

  const getProjectColor = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.color || '#3B82F6';
  };

  const handleDrop = (e: React.DragEvent, date: Date, timeSlot?: string) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    const dateStr = format(date, 'yyyy-MM-dd');
    onTaskMove(taskId, dateStr, timeSlot);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden h-[1200px] flex flex-col">
      {/* Week day headers */}
      <div className="grid grid-cols-8 bg-gray-700 border-b border-gray-600">
        <div className="p-4 border-r border-gray-600">
          <div className="text-sm font-medium text-gray-300">Time</div>
        </div>
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

      {/* Week grid with time slots - scrollable through all 24 hours */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto"
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

          return (
            <div key={i} className="grid grid-cols-8 border-b border-gray-600 hover:bg-gray-700 h-8">
              {/* Time column */}
              <div className="p-1 border-r border-gray-600 text-xs text-gray-300 font-medium flex items-center">
                {displayTime}
              </div>
              
              {/* Day columns */}
              {weekDays.map(date => {
                const dayTasks = getTasksForDate(date).filter(task => {
                  if (!task.scheduledTime) return time24 === '09:00'; // Default unscheduled tasks to 9 AM
                  return task.scheduledTime.startsWith(time24.substring(0, 2));
                });
                const isCurrentDay = isToday(date);

                return (
                  <div
                    key={format(date, 'yyyy-MM-dd')}
                    className={`border-r border-gray-600 last:border-r-0 p-1 ${
                      isCurrentDay ? 'bg-gray-700' : 'bg-gray-800'
                    }`}
                    onDrop={(e) => handleDrop(e, date, time24)}
                    onDragOver={handleDragOver}
                  >
                    <div className="space-y-1">
                      {dayTasks.slice(0, 1).map(task => (
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
                      {dayTasks.length > 1 && (
                        <div className="text-xs text-gray-400">
                          +{dayTasks.length - 1}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekView;
