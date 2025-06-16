
import React, { useState } from 'react';
import { Task } from '../../types';

interface TaskBlockProps {
  task: Task;
  projectColor: string;
  onDragStart: () => void;
  onEdit: (updates: Partial<Task>) => void;
  onUnschedule: () => void;
}

const TaskBlock: React.FC<TaskBlockProps> = ({
  task,
  projectColor,
  onDragStart,
  onEdit,
  onUnschedule
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(task.name);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editName.trim() && editName !== task.name) {
      onEdit({ name: editName.trim() });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditName(task.name);
    setIsEditing(false);
  };

  const handleToggleComplete = () => {
    onEdit({ completed: !task.completed });
  };

  const getTaskHeight = () => {
    // Each 30-minute slot is min-h-16 (64px)
    // Calculate how many slots this task spans
    const slots = Math.ceil(task.estimatedMinutes / 30);
    return `${slots * 64}px`;
  };

  return (
    <div
      draggable={!isEditing}
      onDragStart={onDragStart}
      className={`rounded p-2 text-xs text-white cursor-move shadow-sm ${
        task.completed ? 'opacity-60' : ''
      }`}
      style={{
        backgroundColor: projectColor,
        height: getTaskHeight(),
        minHeight: '48px'
      }}
    >
      {isEditing ? (
        <input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') handleCancel();
          }}
          onBlur={handleSave}
          className="w-full bg-white bg-opacity-20 text-white text-xs px-1 py-0.5 rounded"
          autoFocus
        />
      ) : (
        <div>
          <div className="flex items-center gap-1 mb-1">
            <button
              onClick={handleToggleComplete}
              className={`w-3 h-3 rounded border ${
                task.completed
                  ? 'bg-white text-black border-white'
                  : 'border-white hover:bg-white hover:bg-opacity-20'
              }`}
            >
              {task.completed && <span className="text-xs">✓</span>}
            </button>
            <span className={`font-medium ${task.completed ? 'line-through' : ''}`}>
              {task.name}
            </span>
          </div>
          
          <div className="text-xs opacity-75">
            {task.estimatedMinutes} min
          </div>

          <div className="flex gap-1 mt-1">
            <button
              onClick={handleEdit}
              className="text-xs opacity-75 hover:opacity-100"
              title="Edit task"
            >
              ✏️
            </button>
            <button
              onClick={onUnschedule}
              className="text-xs opacity-75 hover:opacity-100"
              title="Remove from calendar"
            >
              📤
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskBlock;
