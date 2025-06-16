
import React from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Habit } from '../../types';
import { formatDate, isCurrentDay } from '../../utils/dateUtils';

interface ProgressOverviewProps {
  habits: Habit[];
  monthDays: Date[];
}

const ProgressOverview: React.FC<ProgressOverviewProps> = ({ habits, monthDays }) => {
  const calculateDailyProgress = () => {
    return monthDays.map(day => {
      const dateStr = formatDate(day);
      if (day > new Date()) return { day: day.getDate(), percentage: null };
      
      if (habits.length === 0) return { day: day.getDate(), percentage: 0 };
      
      const completedHabits = habits.filter(habit => habit.completions[dateStr]);
      const percentage = Math.round((completedHabits.length / habits.length) * 100);
      
      return { day: day.getDate(), percentage };
    }).filter(data => data.percentage !== null);
  };

  const calculateWeeklyProgress = () => {
    const weeks = [];
    for (let i = 0; i < monthDays.length; i += 7) {
      const weekDays = monthDays.slice(i, i + 7).filter(day => day <= new Date());
      if (weekDays.length === 0) continue;
      
      const weekTotal = weekDays.reduce((sum, day) => {
        const dateStr = formatDate(day);
        const completedHabits = habits.filter(habit => habit.completions[dateStr]);
        return sum + (habits.length > 0 ? (completedHabits.length / habits.length) * 100 : 0);
      }, 0);
      
      weeks.push({
        week: `Week ${Math.floor(i / 7) + 1}`,
        percentage: Math.round(weekTotal / weekDays.length)
      });
    }
    return weeks;
  };

  const calculateOverallProgress = () => {
    const pastDays = monthDays.filter(day => day <= new Date());
    if (pastDays.length === 0 || habits.length === 0) return 0;
    
    const totalPossibleCompletions = pastDays.length * habits.length;
    const totalCompletions = pastDays.reduce((sum, day) => {
      const dateStr = formatDate(day);
      return sum + habits.filter(habit => habit.completions[dateStr]).length;
    }, 0);
    
    return Math.round((totalCompletions / totalPossibleCompletions) * 100);
  };

  const dailyData = calculateDailyProgress();
  const weeklyData = calculateWeeklyProgress();
  const overallProgress = calculateOverallProgress();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Overall Progress Circle */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Overall Progress</h3>
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="rgb(75, 85, 99)"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="rgb(59, 130, 246)"
                strokeWidth="10"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${overallProgress * 2.83} 283`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{overallProgress}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Progress Chart */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Daily Progress</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={dailyData}>
            <XAxis dataKey="day" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Line
              type="monotone"
              dataKey="percentage"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ fill: '#3B82F6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly Progress Chart */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Weekly Progress</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weeklyData}>
            <XAxis dataKey="week" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Bar dataKey="percentage" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressOverview;
