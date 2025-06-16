
import React, { useState } from 'react';
import { Project, Task, TaskFilter } from '../../types';
import ProjectGrid from './ProjectGrid';
import ProjectSidebar from './ProjectSidebar';
import AddProjectModal from './AddProjectModal';

interface ProjectsPageProps {
  projects: Project[];
  tasks: Task[];
  onProjectsChange: (projects: Project[]) => void;
  onTasksChange: (tasks: Task[]) => void;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({
  projects,
  tasks,
  onProjectsChange,
  onTasksChange
}) => {
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);

  const handleAddProject = (projectData: Omit<Project, 'id'>) => {
    const newProject: Project = {
      ...projectData,
      id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    onProjectsChange([...projects, newProject]);
  };

  const handleEditProject = (projectId: string, updates: Partial<Project>) => {
    const updatedProjects = projects.map(project =>
      project.id === projectId ? { ...project, ...updates } : project
    );
    onProjectsChange(updatedProjects);
  };

  const handleDeleteProject = (projectId: string) => {
    const updatedProjects = projects.filter(project => project.id !== projectId);
    const updatedTasks = tasks.filter(task => task.projectId !== projectId);
    onProjectsChange(updatedProjects);
    onTasksChange(updatedTasks);
  };

  const handleAddTask = (taskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...taskData,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    onTasksChange([...tasks, newTask]);
  };

  const handleEditTask = (taskId: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    onTasksChange(updatedTasks);
  };

  const handleDeleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    onTasksChange(updatedTasks);
  };

  const handleToggleTask = (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    onTasksChange(updatedTasks);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Projects</h1>
        <button
          onClick={() => setIsAddProjectModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Project
        </button>
      </div>

      <div className="flex gap-8">
        <div className="flex-1">
          <ProjectGrid
            projects={projects}
            tasks={tasks}
            filter={filter}
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProject}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onToggleTask={handleToggleTask}
          />
        </div>

        <div className="w-80">
          <ProjectSidebar
            filter={filter}
            onFilterChange={setFilter}
          />
        </div>
      </div>

      <AddProjectModal
        isOpen={isAddProjectModalOpen}
        onClose={() => setIsAddProjectModalOpen(false)}
        onAdd={handleAddProject}
      />
    </div>
  );
};

export default ProjectsPage;
