
import React from 'react';
import { TaskFilter } from '../../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

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
      
      <Select value={filter} onValueChange={(value: TaskFilter) => onFilterChange(value)}>
        <SelectTrigger className="w-full bg-gray-700 border-gray-600 text-white">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-gray-700 border-gray-600">
          {filterOptions.map(option => (
            <SelectItem key={option.value} value={option.value} className="text-white hover:bg-gray-600">
              <div>
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-gray-400">{option.description}</div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ProjectSidebar;
