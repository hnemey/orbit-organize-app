
import React, { useState } from 'react';
import { Project, Task } from '../../types';
import ProjectSidebar from './ProjectSidebar';
import ProjectGrid from './ProjectGrid';
import TaskModal from '../TaskModal';
import { filterTasks } from '../../utils/dateUtils';

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
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();

  const handleProjectSelect = (projectId: string | null) => {
    setSelectedProject(projectId);
  };

  const handleAddProject = (newProject: Project) => {
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
    onProjectsChange(updatedProjects);

    const updatedTasks = tasks.filter(task => task.projectId !== projectId);
    onTasksChange(updatedTasks);

    setSelectedProject(null);
  };

  const handleAddTask = (projectId: string, newTask: Omit<Task, 'id'>) => {
    const task: Task = {
      ...newTask,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    onTasksChange([...tasks, task]);
  };

  const handleEditTask = (taskId: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, ...updates } : task
    );
    onTasksChange(updatedTasks);
    setEditingTask(undefined);
    setIsTaskModalOpen(false);
  };

  const handleTaskDelete = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    onTasksChange(updatedTasks);
    setEditingTask(undefined);
    setIsTaskModalOpen(false);
  };

  const handleToggleTask = (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    onTasksChange(updatedTasks);
  };

  const handleTaskClick = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const filteredTasks = selectedProject
    ? tasks.filter(task => task.projectId === selectedProject)
    : tasks;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-8">Projects</h1>

      <div className="flex gap-8">
        <ProjectSidebar
          selectedProject={selectedProject}
          onProjectSelect={handleProjectSelect}
          onAddProject={() => {}}
        />

        <ProjectGrid
          projects={projects}
          tasks={filteredTasks}
          filterTasks={filterTasks}
          onEditProject={handleEditProject}
          onDeleteProject={handleDeleteProject}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleTaskDelete}
          onToggleTask={handleToggleTask}
          onTaskClick={handleTaskClick}
        />
      </div>

      {isTaskModalOpen && editingTask && (
        <TaskModal
          isOpen={isTaskModalOpen}
          task={editingTask}
          onClose={() => {
            setIsTaskModalOpen(false);
            setEditingTask(undefined);
          }}
          onSave={(taskData) => handleEditTask(editingTask.id, taskData)}
          onDelete={() => handleTaskDelete(editingTask.id)}
          projects={projects}
        />
      )}
    </div>
  );
};

export default ProjectsPage;
