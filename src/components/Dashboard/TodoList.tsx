
import React, { useState } from 'react';
import { Task, Project, TimeFilter } from '../../types';
import { formatDisplayDate, isTaskOverdue, isTaskDueThisWeek } from '../../utils/dateUtils';

interface TodoListProps {
  tasks: Task[];
  projects: Project[];
  onTaskComplete: (taskId: string) => void;
  onTaskEdit: (task: Task) => void;
}

const TodoList: React.FC<TodoListProps> = ({
  tasks,
  projects,
  onTaskComplete,
  onTaskEdit
}) => {
  const [selectedProject, setSelectedProject] = useState<string>('all');
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

    // Project filter
    if (selectedProject !== 'all') {
      filtered = filtered.filter(task => task.projectId === selectedProject);
    }

    // Time filter
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

    return filtered;
  };

  const filteredTasks = filterTasks();

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Todo List</h2>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm"
        >
          <option value="all">All Projects</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>{project.name}</option>
          ))}
        </select>

        <select
          value={timeFilter}
          onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
          className="bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 text-sm"
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <p className="text-gray-400">No tasks found</p>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map(task => (
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
                  <h3 className="font-medium text-white">{task.name}</h3>
                  <span className="text-sm text-gray-300">{task.estimatedMinutes}m</span>
                </div>
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
          ))}
        </div>
      )}
    </div>
  );
};

export default TodoList;
