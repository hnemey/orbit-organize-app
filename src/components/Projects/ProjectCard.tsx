
import React, { useState } from 'react';
import { Project, Task } from '../../types';
import TaskList from './TaskList';
import AddTaskForm from './AddTaskForm';

interface ProjectCardProps {
  project: Project;
  tasks: Task[];
  allTasks: Task[];
  onEditProject: (projectId: string, updates: Partial<Project>) => void;
  onDeleteProject: (projectId: string) => void;
  onAddTask: (taskData: Omit<Task, 'id'>) => void;
  onEditTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleTask: (taskId: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  tasks,
  allTasks,
  onEditProject,
  onDeleteProject,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleTask
}) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(project.name);
  const [editNotes, setEditNotes] = useState(project.notes || '');

  const handleEditSave = () => {
    onEditProject(project.id, {
      name: editName.trim(),
      notes: editNotes.trim()
    });
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditName(project.name);
    setEditNotes(project.notes || '');
    setIsEditing(false);
  };

  const completedTasks = allTasks.filter(task => task.completed).length;
  const totalTasks = allTasks.length;

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      {/* Project Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: project.color }}
          />
          {isEditing ? (
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="bg-gray-700 text-white px-2 py-1 rounded flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleEditSave();
                if (e.key === 'Escape') handleEditCancel();
              }}
              autoFocus
            />
          ) : (
            <h3 className="text-xl font-semibold text-white">{project.name}</h3>
          )}
        </div>
        
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleEditSave}
                className="text-green-400 hover:text-green-300 text-sm px-2 py-1"
              >
                Save
              </button>
              <button
                onClick={handleEditCancel}
                className="text-gray-400 hover:text-gray-300 text-sm px-2 py-1"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-400 hover:text-blue-300 text-sm px-2 py-1"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  if (confirm('Delete this project and all its tasks?')) {
                    onDeleteProject(project.id);
                  }
                }}
                className="text-red-400 hover:text-red-300 text-sm px-2 py-1"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>{completedTasks} of {totalTasks} tasks completed</span>
          <span>{totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all duration-300"
            style={{
              width: totalTasks > 0 ? `${(completedTasks / totalTasks) * 100}%` : '0%',
              backgroundColor: project.color
            }}
          />
        </div>
      </div>

      {/* Project Notes */}
      {isEditing ? (
        <textarea
          value={editNotes}
          onChange={(e) => setEditNotes(e.target.value)}
          placeholder="Project notes..."
          className="w-full bg-gray-700 text-white px-3 py-2 rounded mb-4 resize-none"
          rows={2}
        />
      ) : (
        project.notes && (
          <p className="text-gray-300 text-sm mb-4 bg-gray-700 px-3 py-2 rounded">
            {project.notes}
          </p>
        )
      )}

      {/* Add Task Button */}
      <button
        onClick={() => setIsAddingTask(!isAddingTask)}
        className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 rounded-lg mb-4 transition-colors"
      >
        {isAddingTask ? 'Cancel' : '+ Add Task'}
      </button>

      {/* Add Task Form */}
      {isAddingTask && (
        <AddTaskForm
          projectId={project.id}
          onAdd={(taskData) => {
            onAddTask(taskData);
            setIsAddingTask(false);
          }}
          onCancel={() => setIsAddingTask(false)}
        />
      )}

      {/* Task List */}
      <TaskList
        tasks={tasks}
        projectColor={project.color}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onToggleTask={onToggleTask}
      />
    </div>
  );
};

export default ProjectCard;
