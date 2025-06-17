
import React from 'react';
import { Calendar } from 'lucide-react';
import { formatDisplayDate, formatDisplayTime } from '@/utils/dateUtils';
import { Task, Project } from '@/types';

interface TodaysCalendarProps {
  tasks: Task[];
  projects: Project[];
  onTaskComplete: (taskId: string) => void;
  onTaskEdit: (task: Task) => void;
}

const TodaysCalendar: React.FC<TodaysCalendarProps> = ({
  tasks,
  projects,
  onTaskComplete,
  onTaskEdit
}) => {
  const today = new Date();
  const todayFormatted = formatDisplayDate(today.toISOString().split('T')[0]);
  
  const todaysTasks = tasks
    .filter(task => {
      const today = new Date().toISOString().split('T')[0];
      return task.scheduledDate === today && task.scheduledTime;
    })
    .sort((a, b) => (a.scheduledTime || '').localeCompare(b.scheduledTime || ''));

  const getProjectColor = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.color || '#6b7280';
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'Unknown';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-6 h-6 text-blue-400" />
        <h2 className="text-xl font-semibold text-white">Today's Schedule</h2>
      </div>
      
      <div className="text-gray-300 mb-4">
        {todayFormatted}
      </div>
      
      {/* Calendar content area */}
      <div className="space-y-3">
        {todaysTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No events scheduled for today
          </div>
        ) : (
          <div className="space-y-3">
            {todaysTasks.map(task => (
              <div
                key={task.id}
                className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg border-l-4 hover:bg-gray-650 transition-colors cursor-pointer"
                style={{ borderLeftColor: getProjectColor(task.projectId) }}
                onClick={() => onTaskEdit(task)}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={(e) => {
                    e.stopPropagation();
                    onTaskComplete(task.id);
                  }}
                  className="w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col">
                    <h3 className={`font-medium text-sm ${task.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                      {task.name}
                    </h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-400">{getProjectName(task.projectId)}</span>
                      <span className="text-xs text-gray-300">
                        {task.scheduledTime && formatDisplayTime(task.scheduledTime)} ({task.estimatedMinutes}m)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TodaysCalendar;
