
import React from 'react';
import { Task, Project } from '../../types';
import { formatDisplayTime } from '../../utils/dateUtils';

interface TodaysScheduleProps {
  tasks: Task[];
  projects: Project[];
  onTaskComplete: (taskId: string) => void;
  onTaskEdit: (task: Task) => void;
}

const TodaysSchedule: React.FC<TodaysScheduleProps> = ({
  tasks,
  projects,
  onTaskComplete,
  onTaskEdit
}) => {
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
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Today's Schedule</h2>
      
      {todaysTasks.length === 0 ? (
        <p className="text-gray-400">No scheduled tasks for today</p>
      ) : (
        <div className="space-y-3">
          {todaysTasks.map(task => (
            <div
              key={task.id}
              className="flex items-center space-x-4 p-3 bg-gray-700 rounded-lg border-l-4 hover:bg-gray-650 transition-colors cursor-pointer"
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
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className={`font-medium ${task.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                    {task.name}
                  </h3>
                  <span className="text-sm text-gray-300">
                    {task.scheduledTime && formatDisplayTime(task.scheduledTime)} ({task.estimatedMinutes}m)
                  </span>
                </div>
                <p className="text-sm text-gray-400">{getProjectName(task.projectId)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TodaysSchedule;
