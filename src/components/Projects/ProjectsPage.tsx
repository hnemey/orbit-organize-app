
import React, { useState } from 'react';
import { Task, Project, TaskFilter } from '../../types';
import { isTaskDueThisWeek, isTaskOverdue } from '../../utils/dateUtils';
import ProjectGrid from './ProjectGrid';
import ProjectSidebar from './ProjectSidebar';
import AddProjectModal from './AddProjectModal';
import TaskModal from '../TaskModal';

interface ProjectsPageProps {
  tasks: Task[];
  projects: Project[];
  onTasksChange: (tasks: Task[]) => void;
  onProjectsChange: (projects: Project[]) => void;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({
  tasks,
  projects,
  onTasksChange,
  onProjectsChange
}) => {
  const [filter, setFilter] = useState<TaskFilter>('all');
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const filterTasks = (projectTasks: Task[]): Task[] => {
    const today = new Date().toISOString().split('T')[0];
    
    switch (filter) {
      case 'today':
        return projectTasks.filter(task => task.scheduledDate === today);
      case 'week':
        return projectTasks.filter(task => isTaskDueThisWeek(task.scheduledDate));
      case 'month':
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
        const monthLimit = thirtyDaysFromNow.toISOString().split('T')[0];
        return projectTasks.filter(task => 
          task.scheduledDate && task.scheduledDate <= monthLimit
        );
      case 'no-date':
        return projectTasks.filter(task => !task.scheduledDate);
      default:
        return projectTasks;
    }
  };

  const handleAddProject = (name: string, color: string) => {
    const newProject: Project = {
      id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      color,
      notes: ''
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
    // Delete project and its tasks
    const updatedProjects = projects.filter(project => project.id !== projectId);
    const updatedTasks = tasks.filter(task => task.projectId !== projectId);
    onProjectsChange(updatedProjects);
    onTasksChange(updatedTasks);
  };

  const handleAddTask = (projectId: string, task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      projectId
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

  const handleTaskClick = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskModalSave = (taskData: Omit<Task, 'id'>) => {
    if (editingTask) {
      handleEditTask(editingTask.id, taskData);
    }
    setEditingTask(null);
    setIsTaskModalOpen(false);
  };

  const handleTaskModalClose = () => {
    setEditingTask(null);
    setIsTaskModalOpen(false);
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

      <div className="flex gap-6">
        <div className="flex-1">
          <ProjectGrid
            projects={projects}
            tasks={tasks}
            filterTasks={filterTasks}
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProject}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onToggleTask={handleToggleTask}
            onTaskClick={handleTaskClick}
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

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={handleTaskModalClose}
        onSave={handleTaskModalSave}
        task={editingTask || undefined}
        projects={projects}
      />
    </div>
  );
};

export default ProjectsPage;
