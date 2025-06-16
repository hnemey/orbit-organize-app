
import React, { useState, useEffect } from 'react';
import { Task, Project } from '../types';
import { formatDate, formatTime } from '../utils/dateUtils';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'>) => void;
  task?: Task;
  projects: Project[];
}

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  task,
  projects
}) => {
  const [formData, setFormData] = useState({
    name: '',
    notes: '',
    priority: 'medium' as Task['priority'],
    urgency: 'medium' as Task['urgency'],
    estimatedMinutes: 30,
    projectId: '',
    scheduledDate: '',
    scheduledTime: '',
    completed: false
  });

  useEffect(() => {
    if (task) {
      setFormData({
        name: task.name,
        notes: task.notes,
        priority: task.priority,
        urgency: task.urgency,
        estimatedMinutes: task.estimatedMinutes,
        projectId: task.projectId,
        scheduledDate: task.scheduledDate || '',
        scheduledTime: task.scheduledTime || '',
        completed: task.completed
      });
    } else {
      setFormData({
        name: '',
        notes: '',
        priority: 'medium',
        urgency: 'medium',
        estimatedMinutes: 30,
        projectId: projects[0]?.id || '',
        scheduledDate: '',
        scheduledTime: '',
        completed: false
      });
    }
  }, [task, projects, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onSave({
      ...formData,
      scheduledDate: formData.scheduledDate || undefined,
      scheduledTime: formData.scheduledTime || undefined
    });
    onClose();
  };

  if (!isOpen) return null;

  const priorityColors = {
    low: 'bg-green-600',
    medium: 'bg-yellow-600',
    high: 'bg-red-600'
  };

  const urgencyColors = {
    low: 'bg-blue-600',
    medium: 'bg-orange-600',
    high: 'bg-purple-600'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold text-white mb-4">
          {task ? 'Edit Task' : 'Add Task'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Task Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Project *
            </label>
            <select
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
              required
            >
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2 h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Urgency
              </label>
              <select
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value as Task['urgency'] })}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Estimated Duration (minutes)
            </label>
            <input
              type="number"
              value={formData.estimatedMinutes}
              onChange={(e) => setFormData({ ...formData, estimatedMinutes: parseInt(e.target.value) || 0 })}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
              min="1"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Scheduled Date
              </label>
              <input
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Scheduled Time
              </label>
              <input
                type="time"
                value={formData.scheduledTime}
                onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                className="w-full bg-gray-700 text-white border border-gray-600 rounded px-3 py-2"
              />
            </div>
          </div>

          {task && (
            <div className="flex items-center">
              <input
                type="checkbox"
                id="completed"
                checked={formData.completed}
                onChange={(e) => setFormData({ ...formData, completed: e.target.checked })}
                className="w-4 h-4 text-blue-600 bg-gray-600 border-gray-500 rounded focus:ring-blue-500"
              />
              <label htmlFor="completed" className="ml-2 text-sm text-gray-300">
                Mark as completed
              </label>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              {task ? 'Update' : 'Create'} Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
