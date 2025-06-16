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
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(project.name);

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const handleEditSave = () => {
    if (editName.trim() && editName !== project.name) {
      onEditProject(project.id, { name: editName });
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditName(project.name);
    setIsEditing(false);
  };

  const handleAddTask = (task: Omit<Task, 'id'>) => {
    onAddTask(project.id, task);
    setIsAddingTask(false);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: project.color }}
          />
          {isEditing ? (
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleEditSave();
                if (e.key === 'Escape') handleEditCancel();
              }}
              onBlur={handleEditSave}
              className="bg-gray-700 text-white px-2 py-1 rounded text-lg font-semibold"
              autoFocus
            />
          ) : (
            <h3 
              className="text-xl font-semibold text-white cursor-pointer hover:text-blue-400"
              onClick={() => setIsEditing(true)}
            >
              {project.name}
            </h3>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setIsAddingTask(true)}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            Add Task
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

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>Progress</span>
          <span>{completedTasks}/{totalTasks} tasks</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${progress}%`,
              backgroundColor: project.color 
            }}
          />
        </div>
      </div>

      {/* Project Description */}
      {project.description && (
        <p className="text-gray-400 text-sm mb-4">{project.description}</p>
      )}

      {/* Tasks */}
      <TaskList
        tasks={tasks}
        projectColor={project.color}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onToggleTask={onToggleTask}
        onTaskClick={onTaskClick}
      />

      {/* Add Task Form */}
      {isAddingTask && (
        <div className="mt-4 border-t border-gray-700 pt-4">
          <AddTaskForm
            projectId={project.id}
            onAdd={handleAddTask}
            onCancel={() => setIsAddingTask(false)}
          />
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
