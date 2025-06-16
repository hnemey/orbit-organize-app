
import React from 'react';
import { Task, Project } from '../../types';
import { format, startOfYear, addMonths } from 'date-fns';

interface YearViewProps {
  currentDate: Date;
  tasks: Task[];
  projects: Project[];
  onMonthClick: (month: number) => void;
}

const YearView: React.FC<YearViewProps> = ({
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
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="grid grid-cols-3 gap-6">
        {months.map((month, index) => {
          const monthTasks = getTasksForMonth(month);
          
          return (
            <div
              key={index}
              onClick={() => onMonthClick(index)}
              className="bg-gray-50 rounded-lg p-4 cursor-pointer hover:bg-gray-100 transition-colors border"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center">
                {format(month, 'MMMM')}
              </h3>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {monthTasks.length}
                </div>
                <div className="text-xs text-gray-500">
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

export default YearView;
