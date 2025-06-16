import React, { useEffect, useRef } from 'react';
import { Task, Project } from '../../types';
import { format, startOfWeek, addDays, isToday } from 'date-fns';

interface WeekViewProps {
  currentDate: Date;
  tasks: Task[];
  projects: Project[];
  onTaskMove: (taskId: string, newDate: string, newTime?: string) => void;
  onTaskClick?: (task: Task) => void;
}

const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  tasks,
  projects,
  onTaskMove,
  onTaskClick
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Scroll to 6AM on component mount
  useEffect(() => {
    if (scrollContainerRef.current) {
      const sixAmSlot = 12 * 2;
      const slotHeight = 24;
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
    <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 overflow-hidden h-[600px] flex flex-col">
      {/* Week day headers */}
      <div className="grid grid-cols-8 bg-gray-700 border-b border-gray-600">
        <div className="p-3 border-r border-gray-600">
          <div className="text-xs font-medium text-gray-300">Time</div>
        </div>
        {weekDays.map(day => (
          <div key={format(day, 'yyyy-MM-dd')} className="p-3 text-center border-r last:border-r-0 border-gray-600">
            <div className="text-xs font-medium text-gray-300">{format(day, 'EEE')}</div>
            <div className={`text-sm font-semibold mt-1 ${
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
            <div key={i} className="grid grid-cols-8 border-b border-gray-600 hover:bg-gray-700 h-6">
              <div className="p-1 border-r border-gray-600 text-xs text-gray-300 font-medium flex items-center">
                {displayTime}
              </div>
              
              {weekDays.map(date => {
                const isCurrentDay = isToday(date);
                return (
                  <div
                    key={format(date, 'yyyy-MM-dd')}
                    className={`border-r border-gray-600 last:border-r-0 p-1 ${
                      isCurrentDay ? 'bg-gray-700' : 'bg-gray-800'
                    }`}
                    onDrop={(e) => handleDrop(e, date, time24)}
                    onDragOver={handleDragOver}
                  />
                );
              })}
            </div>
          );
        })}

        {/* Overlay tasks as positioned elements */}
        {weekDays.map((date, dayIndex) => {
          const dayTasks = getTasksForDate(date);
          const columnWidth = `calc((100% - 12.5%) / 7)`;
          const leftOffset = `calc(12.5% + ${dayIndex} * ${columnWidth})`;

          return dayTasks.map(task => {
            const { top, height } = getTaskLayout(task);
            return (
              <div
                key={`${task.id}-${format(date, 'yyyy-MM-dd')}`}
                className="absolute px-1 py-1 rounded text-xs font-medium text-white cursor-pointer border-l-2 flex items-center hover:opacity-80 transition-opacity"
                style={{ 
                  backgroundColor: getProjectColor(task.projectId),
                  borderLeftColor: getProjectColor(task.projectId),
                  top: `${top}px`,
                  height: `${height}px`,
                  minHeight: '24px',
                  left: leftOffset,
                  width: columnWidth,
                  marginLeft: '2px',
                  marginRight: '2px'
                }}
                title={`${task.name} - ${task.estimatedMinutes} minutes`}
                draggable
                onDragStart={(e) => e.dataTransfer.setData('text/plain', task.id)}
                onClick={() => onTaskClick?.(task)}
              >
                <span className="truncate">{task.name}</span>
              </div>
            );
          });
        })}
      </div>
    </div>
  );
};

export default WeekView;
