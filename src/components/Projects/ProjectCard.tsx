
import React, { useState } from 'react';
import { Task, Project } from '../../types';
import TaskList from './TaskList';
import AddTaskForm from './AddTaskForm';

interface ProjectCardProps {
  project: Project;
  tasks: Task[];
  onEditProject: (projectId: string, updates: Partial<Project>) => void;
  onDeleteProject: (projectId: string) => void;
  onAddTask: (projectId: string, task: Omit<Task, 'id'>) => void;
  onEditTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleTask: (taskId: string) => void;
  onTaskClick: (task: Task) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  tasks,
  onEditProject,
  onDeleteProject,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleTask,
  onTaskClick
}) => {
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingProject, setEditingProject] = useState(false);
  const [editName, setEditName] = useState(project.name);

  const handleEditProject = () => {
    if (editName.trim() && editName !== project.name) {
      onEditProject(project.id, { name: editName.trim() });
    }
    setEditingProject(false);
  };

  const handleAddTask = (task: Omit<Task, 'id'>) => {
    onAddTask(project.id, task);
    setShowAddTask(false);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border-l-4" style={{ borderLeftColor: project.color }}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          {editingProject ? (
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleEditProject}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleEditProject();
                if (e.key === 'Escape') {
                  setEditName(project.name);
                  setEditingProject(false);
                }
              }}
              className="bg-gray-700 text-white px-2 py-1 rounded text-lg font-semibold w-full"
              autoFocus
            />
          ) : (
            <h3 
              className="text-lg font-semibold text-white cursor-pointer hover:text-blue-400 transition-colors"
              onClick={() => setEditingProject(true)}
            >
              {project.name}
            </h3>
          )}
          <p className="text-sm text-gray-400">{tasks.length} tasks</p>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setEditingProject(true)}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => {
              if (confirm('Delete this project and all its tasks?')) {
                onDeleteProject(project.id);
              }
            }}
            className="text-red-400 hover:text-red-300 text-sm"
          >
            Delete
          </button>
        </div>
      </div>

      {project.notes && (
        <p className="text-gray-300 text-sm mb-4 italic">"{project.notes}"</p>
      )}

      <div className="mb-4">
        <button
          onClick={() => setShowAddTask(!showAddTask)}
          className="text-blue-400 hover:text-blue-300 text-sm font-medium"
        >
          {showAddTask ? '- Cancel' : '+ Add Task'}
        </button>
      </div>

      {showAddTask && (
        <div className="mb-4">
          <AddTaskForm onAdd={handleAddTask} />
        </div>
      )}

      <TaskList
        tasks={tasks}
        projectColor={project.color}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onToggleTask={onToggleTask}
        onTaskClick={onTaskClick}
      />
    </div>
  );
};

export default ProjectCard;
