
import React from 'react';
import { Task } from '../../types';
import { formatDisplayDate, formatDisplayTime, isTaskOverdue } from '../../utils/dateUtils';

interface TaskListProps {
  tasks: Task[];
  projectColor: string;
  onEditTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleTask: (taskId: string) => void;
  onTaskClick: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  projectColor,
  onEditTask,
  onDeleteTask,
  onToggleTask,
  onTaskClick
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-3">
      {tasks.map(task => {
        const hours = Math.floor(task.estimatedMinutes / 60);
        const minutes = task.estimatedMinutes % 60;
        
        return (
          <div
            key={task.id}
            className={`p-3 bg-gray-700 rounded-lg border-l-4 cursor-pointer hover:bg-gray-600 transition-colors ${
              task.completed ? 'opacity-60' : ''
            }`}
            style={{ borderLeftColor: projectColor }}
            onClick={() => onTaskClick(task)}
          >
            <div className="flex items-start gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleTask(task.id);
                }}
                className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  task.completed
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-500 hover:border-gray-400'
                }`}
              >
                {task.completed && (
                  <span className="text-white text-xs">✓</span>
                )}
              </button>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 
                    className={`font-medium ${
                      task.completed ? 'line-through text-gray-400' : 'text-white'
                    }`}
                  >
                    {task.name}
                  </h4>
                  
                  <div className="flex gap-1">
                    <span className={`text-xs px-2 py-1 rounded ${getUrgencyColor(task.urgency)}`}>
                      {task.urgency}
                    </span>
                    <span className={`text-xs ${getPriorityColor(task.priority)}`}>
                      {task.priority} priority
                    </span>
                  </div>
                </div>

                <div className="text-sm text-gray-400 space-y-1">
                  <div>
                    Duration: {hours > 0 && `${hours}h `}{minutes}min
                  </div>
                  
                  {task.scheduledDate && (
                    <div className={isTaskOverdue(task.scheduledDate) ? 'text-red-400' : ''}>
                      📅 {formatDisplayDate(task.scheduledDate)}
                      {task.scheduledTime && ` at ${formatDisplayTime(task.scheduledTime)}`}
                    </div>
                  )}
                  
                  {task.notes && (
                    <div className="text-gray-300 italic">
                      "{task.notes}"
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm('Delete this task?')) {
                        onDeleteTask(task.id);
                      }
                    }}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {tasks.length === 0 && (
        <div className="text-center py-6 text-gray-400">
          No tasks match the current filter.
        </div>
      )}
    </div>
  );
};

export default TaskList;
