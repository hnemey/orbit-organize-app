
import React, { useState } from 'react';
import { Task, Project } from '../../types';
import { format } from 'date-fns';
import TaskBlock from './TaskBlock';

interface CalendarGridProps {
  dates: Date[];
  tasks: Task[];
  projects: Project[];
  timeWindowStart: number;
  onTaskMove: (taskId: string, newDate: string, newTime: string) => void;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
  onTaskUnschedule: (taskId: string) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  dates,
  tasks,
  projects,
  timeWindowStart,
  onTaskMove,
  onTaskUpdate,
  onTaskUnschedule
}) => {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dropZone, setDropZone] = useState<{ date: string; time: string } | null>(null);

  const getTimeSlots = () => {
    const slots = [];
    for (let i = 0; i < 6; i++) {
      const hour = timeWindowStart + i;
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const getTasksForSlot = (date: Date, timeSlot: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return tasks.filter(task => {
      if (task.scheduledDate !== dateStr || !task.scheduledTime) return false;
      const taskHour = parseInt(task.scheduledTime.split(':')[0]);
      const taskMinute = parseInt(task.scheduledTime.split(':')[1]);
      const slotHour = parseInt(timeSlot.split(':')[0]);
      const slotMinute = parseInt(timeSlot.split(':')[1]);
      
      // Task starts in this slot
      return taskHour === slotHour && taskMinute === slotMinute;
    });
  };

  const getProjectColor = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.color || '#3B82F6';
  };

  const handleDragStart = (task: Task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent, date: string, time: string) => {
    e.preventDefault();
    setDropZone({ date, time });
  };

  const handleDragLeave = () => {
    setDropZone(null);
  };

  const handleDrop = (e: React.DragEvent, date: string, time: string) => {
    e.preventDefault();
    if (draggedTask) {
      onTaskMove(draggedTask.id, date, time);
    }
    setDraggedTask(null);
    setDropZone(null);
  };

  const formatTimeSlot = (timeSlot: string) => {
    const [hour, minute] = timeSlot.split(':').map(Number);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return minute === 0 ? `${displayHour} ${ampm}` : `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
  };

  const timeSlots = getTimeSlots();

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden">
      <div className="grid grid-cols-[100px_1fr] max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="bg-gray-700 p-3 border-b border-gray-600 sticky top-0 z-10">
          <span className="text-sm font-medium text-gray-300">Time</span>
        </div>
        <div className="grid grid-cols-subgrid bg-gray-700 border-b border-gray-600 sticky top-0 z-10">
          {dates.map(date => (
            <div
              key={format(date, 'yyyy-MM-dd')}
              className={`p-3 text-center border-l border-gray-600 ${dates.length === 1 ? 'col-span-full' : ''}`}
            >
              <div className="text-sm font-medium text-white">
                {format(date, 'EEE')}
              </div>
              <div className="text-xs text-gray-300">
                {format(date, 'MMM d')}
              </div>
            </div>
          ))}
        </div>

        {/* Time slots */}
        {timeSlots.map(timeSlot => (
          <React.Fragment key={timeSlot}>
            <div className="p-2 border-b border-gray-700 bg-gray-750">
              <span className="text-xs text-gray-400">
                {formatTimeSlot(timeSlot)}
              </span>
            </div>
            <div className={`grid border-b border-gray-700 ${dates.length === 1 ? 'grid-cols-1' : `grid-cols-${dates.length}`}`}>
              {dates.map(date => {
                const dateStr = format(date, 'yyyy-MM-dd');
                const slotTasks = getTasksForSlot(date, timeSlot);
                const isDropZone = dropZone?.date === dateStr && dropZone?.time === timeSlot;

                return (
                  <div
                    key={`${dateStr}-${timeSlot}`}
                    className={`min-h-16 border-l border-gray-600 p-1 relative ${
                      isDropZone ? 'bg-blue-600 bg-opacity-20' : ''
                    }`}
                    onDragOver={(e) => handleDragOver(e, dateStr, timeSlot)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, dateStr, timeSlot)}
                  >
                    {slotTasks.map(task => (
                      <TaskBlock
                        key={task.id}
                        task={task}
                        projectColor={getProjectColor(task.projectId)}
                        onDragStart={() => handleDragStart(task)}
                        onEdit={(updates) => onTaskUpdate(task.id, updates)}
                        onUnschedule={() => onTaskUnschedule(task.id)}
                      />
                    ))}
                  </div>
                );
              })}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;
