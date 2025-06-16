
import React, { useState } from 'react';
import { Habit } from '../../types';
import { getCurrentMonthKey, getMonthDays, isCurrentDay, formatDate } from '../../utils/dateUtils';
import MonthSelector from './MonthSelector';
import ProgressOverview from './ProgressOverview';
import HabitsGrid from './HabitsGrid';
import AddHabitModal from './AddHabitModal';

interface HabitsPageProps {
  habits: Habit[];
  onHabitsChange: (habits: Habit[]) => void;
}

const HabitsPage: React.FC<HabitsPageProps> = ({ habits, onHabitsChange }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const monthKey = `${selectedYear}-${selectedMonth.toString().padStart(2, '0')}`;
  const monthHabits = habits.filter(habit => habit.monthKey === monthKey);
  const monthDays = getMonthDays(selectedYear, selectedMonth);

  const handleToggleCompletion = (habitId: string, date: string) => {
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const newCompletions = { ...habit.completions };
        newCompletions[date] = !newCompletions[date];
        return { ...habit, completions: newCompletions };
      }
      return habit;
    });
    onHabitsChange(updatedHabits);
  };

  const handleAddHabit = (name: string) => {
    const newHabit: Habit = {
      id: `habit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      completions: {},
      monthKey
    };
    onHabitsChange([...habits, newHabit]);
  };

  const handleEditHabit = (habitId: string, name: string) => {
    const updatedHabits = habits.map(habit =>
      habit.id === habitId ? { ...habit, name } : habit
    );
    onHabitsChange(updatedHabits);
  };

  const handleDeleteHabit = (habitId: string) => {
    const updatedHabits = habits.filter(habit => habit.id !== habitId);
    onHabitsChange(updatedHabits);
  };

  return (
    <div className="w-full px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Habits</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add Habit
        </button>
      </div>

      <MonthSelector
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onMonthChange={setSelectedMonth}
        onYearChange={setSelectedYear}
      />

      {/* Progress Overview with proper layout */}
      <ProgressOverview habits={monthHabits} monthDays={monthDays} />

      {/* Habits Grid */}
      <div className="mt-6">
        <HabitsGrid
          habits={monthHabits}
          monthDays={monthDays}
          onToggleCompletion={handleToggleCompletion}
          onEditHabit={handleEditHabit}
          onDeleteHabit={handleDeleteHabit}
        />
      </div>

      <AddHabitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddHabit}
      />
    </div>
  );
};

export default HabitsPage;
