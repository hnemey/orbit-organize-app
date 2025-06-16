import React, { useState } from 'react';
import { Task } from '../../types';

interface AddTaskFormProps {
  projectId: string;
  onAdd: (task: Omit<Task, 'id'>) => void;
  onCancel: () => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ projectId, onAdd, onCancel }) => {
  const [name, setName] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState('medium' as Task['priority']);
  const [urgency, setUrgency] = useState('medium' as Task['urgency']);
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd({
        name: name.trim(),
        notes,
        priority,
        urgency,
        estimatedMinutes,
        completed: false,
        projectId,
        scheduledDate: scheduledDate || undefined,
        scheduledTime: scheduledTime || undefined,
        createdAt: new Date().toISOString()
      });
      setName('');
      setNotes('');
      setPriority('medium' as Task['priority']);
      setUrgency('medium' as Task['urgency']);
      setEstimatedMinutes(30);
      setScheduledDate('');
      setScheduledTime('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-700 p-4 rounded-lg mb-4 space-y-3">
      <input
        type="text"
        placeholder="Task name..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full bg-gray-600 text-white px-3 py-2 rounded"
        required
      />

      <textarea
        placeholder="Notes (optional)..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full bg-gray-600 text-white px-3 py-2 rounded resize-none"
        rows={2}
      />

      <div className="grid grid-cols-2 gap-3">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Task['priority'])}
          className="bg-gray-600 text-white px-3 py-2 rounded"
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>

        <select
          value={urgency}
          onChange={(e) => setUrgency(e.target.value as Task['urgency'])}
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
          value={estimatedMinutes}
          onChange={(e) => setEstimatedMinutes(parseInt(e.target.value) || 30)}
          className="bg-gray-600 text-white px-3 py-2 rounded"
          min="5"
          step="5"
        />

        <input
          type="date"
          value={scheduledDate}
          onChange={(e) => setScheduledDate(e.target.value)}
          className="bg-gray-600 text-white px-3 py-2 rounded"
        />

        <input
          type="time"
          value={scheduledTime}
          onChange={(e) => setScheduledTime(e.target.value)}
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
