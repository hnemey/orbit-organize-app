
import React from 'react';
import { Task, Project } from '../../types';
import ProjectCard from './ProjectCard';

interface ProjectGridProps {
  projects: Project[];
  tasks: Task[];
  filterTasks: (tasks: Task[]) => Task[];
  onEditProject: (projectId: string, updates: Partial<Project>) => void;
  onDeleteProject: (projectId: string) => void;
  onAddTask: (projectId: string, task: Omit<Task, 'id'>) => void;
  onEditTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleTask: (taskId: string) => void;
  onTaskClick: (task: Task) => void;
}

const ProjectGrid: React.FC<ProjectGridProps> = ({
  projects,
  tasks,
  filterTasks,
  onEditProject,
  onDeleteProject,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleTask,
  onTaskClick
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {projects.map(project => {
        const projectTasks = tasks.filter(task => task.projectId === project.id);
        const filteredTasks = filterTasks(projectTasks);
        
        return (
          <ProjectCard
            key={project.id}
            project={project}
            tasks={filteredTasks}
            onEditProject={onEditProject}
            onDeleteProject={onDeleteProject}
            onAddTask={onAddTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onToggleTask={onToggleTask}
            onTaskClick={onTaskClick}
          />
        );
      })}

      {projects.length === 0 && (
        <div className="col-span-full text-center py-12 text-gray-400">
          No projects yet. Add your first project to get started!
        </div>
      )}
    </div>
  );
};

export default ProjectGrid;
