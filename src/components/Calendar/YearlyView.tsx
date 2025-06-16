
import React from 'react';
import { Task, Project } from '../../types';
import { format, startOfYear, addMonths } from 'date-fns';

interface YearlyViewProps {
  currentDate: Date;
  tasks: Task[];
  projects: Project[];
  onMonthClick: (month: number) => void;
}

const YearlyView: React.FC<YearlyViewProps> = ({
  currentDate,
  tasks,
  onMonthClick
}) => {
  const yearStart = startOfYear(currentDate);
  const months = Array.from({ length: 12 }, (_, i) => addMonths(yearStart, i));

  const getTasksForMonth = (month: Date) => {
    const monthStr = format(month, 'yyyy-MM');
    return tasks.filter(task => task.scheduledDate?.startsWith(monthStr));
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="grid grid-cols-3 gap-6">
        {months.map((month, index) => {
          const monthTasks = getTasksForMonth(month);
          
          return (
            <div
              key={index}
              onClick={() => onMonthClick(index)}
              className="bg-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-600 transition-colors"
            >
              <h3 className="text-lg font-semibold text-white mb-3 text-center">
                {format(month, 'MMMM')}
              </h3>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400 mb-1">
                  {monthTasks.length}
                </div>
                <div className="text-xs text-gray-400">
                  {monthTasks.length === 1 ? 'task' : 'tasks'}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default YearlyView;
