
import React, { useState } from 'react';
import { Task, Project, TaskFilter } from '../../types';
import { filterTasks } from '../../utils/dateUtils';
import ProjectGrid from './ProjectGrid';
import ProjectSidebar from './ProjectSidebar';
import AddProjectModal from './AddProjectModal';
import TaskModal from '../TaskModal';

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
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const handleAddProject = (projectData: Omit<Project, 'id'>) => {
    const newProject: Project = {
      id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...projectData,
      createdAt: new Date().toISOString()
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

  const handleAddTask = (projectId: string, task: Omit<Task, 'id'>) => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...task,
      projectId,
      completed: false,
      createdAt: new Date().toISOString()
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
    setSelectedTask(task);
  };

  const handleTaskModalSave = (updates: Partial<Task>) => {
    if (selectedTask) {
      handleEditTask(selectedTask.id, updates);
      setSelectedTask(null);
    }
  };

  const applyFilter = (tasksToFilter: Task[]) => {
    return filterTasks(tasksToFilter, filter);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Projects</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Project
        </button>
      </div>

      <div className="flex gap-6">
        <div className="w-80">
          <ProjectSidebar filter={filter} onFilterChange={setFilter} />
        </div>

        <div className="flex-1">
          <ProjectGrid
            projects={projects}
            tasks={tasks}
            filterTasks={applyFilter}
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProject}
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onToggleTask={handleToggleTask}
            onTaskClick={handleTaskClick}
          />
        </div>
      </div>

      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddProject}
      />

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={handleTaskModalSave}
          onDelete={() => {
            handleDeleteTask(selectedTask.id);
            setSelectedTask(null);
          }}
        />
      )}
    </div>
  );
};

export default ProjectsPage;
