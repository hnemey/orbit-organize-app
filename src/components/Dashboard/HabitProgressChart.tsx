
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Habit } from '../../types';
import { getCurrentMonthKey, getDaysInMonth, formatDate } from '../../utils/dateUtils';

interface HabitProgressChartProps {
  habits: Habit[];
}

const HabitProgressChart: React.FC<HabitProgressChartProps> = ({ habits }) => {
  const currentMonthKey = getCurrentMonthKey();
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const currentDay = new Date().getDate();
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);

  // Filter habits for current month
  const currentMonthHabits = habits.filter(habit => habit.monthKey === currentMonthKey);

  // Generate chart data
  const chartData = [];
  for (let day = 1; day <= Math.min(currentDay, daysInMonth); day++) {
    const date = formatDate(new Date(currentYear, currentMonth - 1, day));
    
    if (currentMonthHabits.length === 0) {
      chartData.push({ day, percentage: 0 });
      continue;
    }

    const completedHabits = currentMonthHabits.filter(habit => 
      habit.completions[date] === true
    ).length;
    
    const percentage = Math.round((completedHabits / currentMonthHabits.length) * 100);
    chartData.push({ day, percentage });
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Daily Habit Progress</h2>
      
      {currentMonthHabits.length === 0 ? (
        <p className="text-gray-400">No habits tracked this month</p>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="day"
                stroke="#9ca3af"
                fontSize={12}
              />
              <YAxis
                domain={[0, 100]}
                stroke="#9ca3af"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  color: '#f9fafb'
                }}
                formatter={(value) => [`${value}%`, 'Completion']}
                labelFormatter={(label) => `Day ${label}`}
              />
              <Line
                type="monotone"
                dataKey="percentage"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default HabitProgressChart;
