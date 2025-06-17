
import React, { useState } from 'react';
import { Task, Project, TimeFilter } from '@/types';
import { formatDisplayDate, isTaskOverdue, isTaskDueThisWeek } from '@/utils/dateUtils';
import { CheckSquare } from 'lucide-react';

interface TasksWidgetProps {
  tasks: Task[];
  projects: Project[];
  onTaskComplete: (taskId: string) => void;
  onTaskEdit: (task: Task) => void;
}

const TasksWidget: React.FC<TasksWidgetProps> = ({
  tasks,
  projects,
  onTaskComplete,
  onTaskEdit
}) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');

  const getProjectColor = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.color || '#6b7280';
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'Unknown';
  };

  const filterTasks = () => {
    let filtered = tasks.filter(task => !task.completed);

    const today = new Date().toISOString().split('T')[0];
    switch (timeFilter) {
      case 'today':
        filtered = filtered.filter(task => task.scheduledDate === today);
        break;
      case 'week':
        filtered = filtered.filter(task => isTaskDueThisWeek(task.scheduledDate));
        break;
      case 'overdue':
        filtered = filtered.filter(task => isTaskOverdue(task.scheduledDate));
        break;
      default:
        break;
    }

    return filtered.slice(0, 5); // Limit to 5 tasks for widget
  };

  const filteredTasks = filterTasks();

  return (
    <div className="bg-gray-800 rounded-lg p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-6 h-6 text-green-400" />
          <h2 className="text-xl font-semibold text-white">Tasks</h2>
        </div>
        
        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
          className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-1 text-sm"
        >
          <option value="all">All Tasks</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      <div className="space-y-3 overflow-y-auto max-h-40">
        {filteredTasks.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No tasks found</p>
        ) : (
          filteredTasks.map(task => (
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
                <h3 className="font-medium text-white truncate">{task.name}</h3>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>{getProjectName(task.projectId)}</span>
                  {task.scheduledDate && (
                    <span className={isTaskOverdue(task.scheduledDate) ? 'text-red-400' : ''}>
                      {formatDisplayDate(task.scheduledDate)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TasksWidget;
