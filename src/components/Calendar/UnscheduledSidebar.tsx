
import React from 'react';
import { Task, Project } from '../../types';

interface UnscheduledSidebarProps {
  tasks: Task[];
  projects: Project[];
  selectedProject: string;
  onProjectChange: (projectId: string) => void;
}

const UnscheduledSidebar: React.FC<UnscheduledSidebarProps> = ({
  tasks,
  projects,
  selectedProject,
  onProjectChange
}) => {
  const getProjectColor = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.color || '#3B82F6';
  };

  const getProjectName = (projectId: string) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'Unknown Project';
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    e.dataTransfer.setData('text/plain', task.id);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
      <div className="p-4 border-b border-gray-600">
        <h3 className="text-lg font-semibold text-white mb-3">Unscheduled Tasks</h3>
        
        <select
          value={selectedProject}
          onChange={(e) => onProjectChange(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Projects</option>
          {projects.map(project => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <div className="p-4 max-h-96 overflow-y-auto">
        <div className="space-y-3">
          {tasks.map(task => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task)}
              className="p-3 rounded-lg border border-gray-600 cursor-move hover:border-gray-500 hover:shadow-sm transition-all bg-gray-700"
            >
              <div className="font-medium text-white text-sm mb-2">
                {task.name}
              </div>
              <div className="text-sm text-gray-300 mb-2">
                {getProjectName(task.projectId)}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                  P Priority
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-400">
                  {task.estimatedMinutes}h {task.estimatedMinutes % 60}m
                </span>
              </div>
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-2">📅</div>
              <p className="font-medium">No unscheduled tasks</p>
              <p className="text-xs mt-1">
                {selectedProject === 'all' 
                  ? 'All tasks have been scheduled'
                  : 'No unscheduled tasks for this project'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UnscheduledSidebar;
