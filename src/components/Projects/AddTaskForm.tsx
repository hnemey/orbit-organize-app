
import React, { useState } from 'react';
import { Task } from '../../types';

interface AddTaskFormProps {
  projectId: string;
  onAdd: (taskData: Omit<Task, 'id'>) => void;
  onCancel: () => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ projectId, onAdd, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    notes: '',
    priority: 'medium' as Task['priority'],
    urgency: 'medium' as Task['urgency'],
    estimatedMinutes: 30,
    scheduledDate: '',
    scheduledTime: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onAdd({
        name: formData.name.trim(),
        notes: formData.notes.trim(),
        priority: formData.priority,
        urgency: formData.urgency,
        estimatedMinutes: formData.estimatedMinutes,
        completed: false,
        projectId,
        scheduledDate: formData.scheduledDate || undefined,
        scheduledTime: formData.scheduledTime || undefined
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-700 p-4 rounded-lg mb-4 space-y-3">
      <input
        type="text"
        placeholder="Task name..."
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        className="w-full bg-gray-600 text-white px-3 py-2 rounded"
        required
      />

      <textarea
        placeholder="Notes (optional)..."
        value={formData.notes}
        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
        className="w-full bg-gray-600 text-white px-3 py-2 rounded resize-none"
        rows={2}
      />

      <div className="grid grid-cols-2 gap-3">
        <select
          value={formData.priority}
          onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as Task['priority'] }))}
          className="bg-gray-600 text-white px-3 py-2 rounded"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>

        <select
          value={formData.urgency}
          onChange={(e) => setFormData(prev => ({ ...prev, urgency: e.target.value as Task['urgency'] }))}
          className="bg-gray-600 text-white px-3 py-2 rounded"
        >
          <option value="low">Low Urgency</option>
          <option value="medium">Medium Urgency</option>
          <option value="high">High Urgency</option>
        </select>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <input
          type="number"
          placeholder="Minutes"
          value={formData.estimatedMinutes}
          onChange={(e) => setFormData(prev => ({ ...prev, estimatedMinutes: parseInt(e.target.value) || 30 }))}
          className="bg-gray-600 text-white px-3 py-2 rounded"
          min="5"
          step="5"
        />

        <input
          type="date"
          value={formData.scheduledDate}
          onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
          className="bg-gray-600 text-white px-3 py-2 rounded"
        />

        <input
          type="time"
          value={formData.scheduledTime}
          onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
          className="bg-gray-600 text-white px-3 py-2 rounded"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors"
        >
          Add Task
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default AddTaskForm;
