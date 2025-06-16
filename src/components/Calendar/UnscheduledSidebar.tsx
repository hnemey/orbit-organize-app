
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

  return (
    <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold text-white mb-3">Unscheduled Tasks</h3>
        
        <select
          value={selectedProject}
          onChange={(e) => onProjectChange(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
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
        <div className="space-y-2">
          {tasks.map(task => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task)}
              className="p-3 rounded border-l-4 cursor-move hover:bg-gray-700 transition-colors bg-gray-800 border border-gray-600"
              style={{ borderLeftColor: getProjectColor(task.projectId) }}
            >
              <div className="font-medium text-white text-sm mb-1">
                {task.name}
              </div>
              <div className="text-xs text-gray-400 space-y-1">
                <div>{getProjectName(task.projectId)}</div>
                <div>{task.estimatedMinutes} minutes</div>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    task.priority === 'high' ? 'bg-red-900 text-red-300' :
                    task.priority === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-green-900 text-green-300'
                  }`}>
                    {task.priority}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    task.urgency === 'high' ? 'bg-red-900 text-red-300' :
                    task.urgency === 'medium' ? 'bg-yellow-900 text-yellow-300' :
                    'bg-green-900 text-green-300'
                  }`}>
                    {task.urgency}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-2">📅</div>
              <p>No unscheduled tasks</p>
              <p className="text-xs">
                {selectedProject === 'all' 
                  ? 'All tasks have been scheduled'
                  : 'No unscheduled tasks for this project'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-700 bg-gray-700">
        <div className="text-xs text-gray-400">
          💡 Drag tasks to the calendar to schedule them
        </div>
      </div>
    </div>
  );
};

export default UnscheduledSidebar;
