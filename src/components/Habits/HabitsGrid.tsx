
import React, { useState } from 'react';
import { Habit } from '../../types';
import { formatDate, isCurrentDay } from '../../utils/dateUtils';

interface HabitsGridProps {
  habits: Habit[];
  monthDays: Date[];
  onToggleCompletion: (habitId: string, date: string) => void;
  onEditHabit: (habitId: string, name: string) => void;
  onDeleteHabit: (habitId: string) => void;
}

const HabitsGrid: React.FC<HabitsGridProps> = ({
  habits,
  monthDays,
  onToggleCompletion,
  onEditHabit,
  onDeleteHabit
}) => {
  const [editingHabit, setEditingHabit] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const calculateDailyProgress = (day: Date) => {
    const dateStr = formatDate(day);
    if (habits.length === 0) return 0;
    const completedHabits = habits.filter(habit => habit.completions[dateStr]);
    return (completedHabits.length / habits.length) * 100;
  };

  const calculateHabitProgress = (habit: Habit) => {
    const pastDays = monthDays.filter(day => day <= new Date());
    if (pastDays.length === 0) return 0;
    const completedDays = pastDays.filter(day => habit.completions[formatDate(day)]);
    return Math.round((completedDays.length / pastDays.length) * 100);
  };

  const handleEditStart = (habit: Habit) => {
    setEditingHabit(habit.id);
    setEditName(habit.name);
  };

  const handleEditSave = (habitId: string) => {
    if (editName.trim()) {
      onEditHabit(habitId, editName.trim());
    }
    setEditingHabit(null);
  };

  const handleEditCancel = () => {
    setEditingHabit(null);
    setEditName('');
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      {/* Habits Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left text-white font-semibold py-3 px-4 w-48">Habit</th>
              <th className="text-center text-white font-semibold py-3 px-4 w-20">Progress</th>
              <th className="text-center text-white font-semibold py-3 px-4 w-24">Actions</th>
              {monthDays.map(day => (
                <th key={formatDate(day)} className="text-center text-gray-400 py-3 px-1 min-w-8 relative">
                  <div className="mb-2">{day.getDate()}</div>
                  {/* Daily Progress Bar */}
                  <div className="w-full h-2 bg-gray-700 rounded mx-auto">
                    {(() => {
                      const progress = calculateDailyProgress(day);
                      const isFuture = day > new Date();
                      const isToday = isCurrentDay(day);
                      return !isFuture ? (
                        <div
                          className={`h-full rounded ${
                            isToday ? 'bg-blue-400' : 'bg-blue-600'
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      ) : null;
                    })()}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {habits.map(habit => (
              <tr key={habit.id} className="border-b border-gray-700 hover:bg-gray-750">
                <td className="py-3 px-4">
                  {editingHabit === habit.id ? (
                    <div className="flex gap-2">
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-gray-700 text-white px-2 py-1 rounded text-sm flex-1"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleEditSave(habit.id);
                          if (e.key === 'Escape') handleEditCancel();
                        }}
                        autoFocus
                      />
                    </div>
                  ) : (
                    <span className="text-white">{habit.name}</span>
                  )}
                </td>
                <td className="text-center py-3 px-4">
                  <span className="text-blue-400 font-semibold">
                    {calculateHabitProgress(habit)}%
                  </span>
                </td>
                <td className="text-center py-3 px-4">
                  <div className="flex gap-1 justify-center">
                    {editingHabit === habit.id ? (
                      <>
                        <button
                          onClick={() => handleEditSave(habit.id)}
                          className="text-green-400 hover:text-green-300 text-xs"
                        >
                          ✓
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="text-red-400 hover:text-red-300 text-xs"
                        >
                          ✕
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditStart(habit)}
                          className="text-blue-400 hover:text-blue-300 text-xs"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Delete this habit?')) {
                              onDeleteHabit(habit.id);
                            }
                          }}
                          className="text-red-400 hover:text-red-300 text-xs"
                        >
                          Del
                        </button>
                      </>
                    )}
                  </div>
                </td>
                {monthDays.map(day => {
                  const dateStr = formatDate(day);
                  const isCompleted = habit.completions[dateStr];
                  const isFuture = day > new Date();
                  const isToday = isCurrentDay(day);
                  
                  return (
                    <td key={dateStr} className="text-center py-3 px-1">
                      <button
                        disabled={isFuture}
                        onClick={() => onToggleCompletion(habit.id, dateStr)}
                        className={`w-6 h-6 rounded border-2 transition-colors ${
                          isFuture
                            ? 'border-gray-600 bg-gray-700 cursor-not-allowed'
                            : isCompleted
                            ? 'border-green-500 bg-green-500'
                            : isToday
                            ? 'border-blue-400 hover:border-blue-300'
                            : 'border-gray-500 hover:border-gray-400'
                        }`}
                      >
                        {isCompleted && (
                          <span className="text-white text-xs">✓</span>
                        )}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        
        {habits.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No habits for this month. Add your first habit to get started!
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitsGrid;
