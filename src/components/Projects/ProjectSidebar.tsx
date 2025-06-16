
import React from 'react';
import { Project } from '../../types';

interface ProjectSidebarProps {
  selectedProject: string | null;
  onProjectSelect: (projectId: string | null) => void;
  onAddProject: () => void;
}

const ProjectSidebar: React.FC<ProjectSidebarProps> = ({
  selectedProject,
  onProjectSelect,
  onAddProject
}) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Projects</h3>
      
      <div className="space-y-2">
        <button
          onClick={() => onProjectSelect(null)}
          className={`w-full text-left px-3 py-2 rounded transition-colors ${
            selectedProject === null
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          All Projects
        </button>
      </div>
    </div>
  );
};

export default ProjectSidebar;
