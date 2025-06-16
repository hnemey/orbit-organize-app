
import React from 'react';
import { Plus } from 'lucide-react';
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
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Projects</h3>
        <button
          onClick={onAddProject}
          className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
        >
          <Plus size={16} />
          Add
        </button>
      </div>
      
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
