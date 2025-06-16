
import React from 'react';
import { TaskFilter } from '../../types';

interface ProjectSidebarProps {
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
}

const ProjectSidebar: React.FC<ProjectSidebarProps> = ({ filter, onFilterChange }) => {
  const filterOptions: { value: TaskFilter; label: string; description: string }[] = [
    { value: 'all', label: 'All Tasks', description: 'Show all tasks' },
    { value: 'today', label: 'Due Today', description: 'Tasks scheduled for today' },
    { value: 'week', label: 'Due This Week', description: 'Tasks due within 7 days' },
    { value: 'month', label: 'Due This Month', description: 'Tasks due within 30 days' },
    { value: 'no-date', label: 'No Due Date', description: 'Unscheduled tasks' }
  ];

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Filter Tasks</h3>
      
      <div className="space-y-2">
        {filterOptions.map(option => (
          <label key={option.value} className="flex items-start gap-3 cursor-pointer group">
            <input
              type="radio"
              name="taskFilter"
              value={option.value}
              checked={filter === option.value}
              onChange={(e) => onFilterChange(e.target.value as TaskFilter)}
              className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-500 focus:ring-2"
            />
            <div>
              <div className="text-white group-hover:text-blue-400 transition-colors">
                {option.label}
              </div>
              <div className="text-xs text-gray-400">
                {option.description}
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ProjectSidebar;
