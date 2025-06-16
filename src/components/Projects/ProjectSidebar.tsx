
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
      <h3 className="text-lg font-semibold text-white mb-4">Projects</h3>
      
      <div className="space-y-2">
        <button
          onClick={onAddProject}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
        >
          <Plus size={16} />
          Add Project
        </button>
      </div>
    </div>
  );
};

export default ProjectSidebar;
