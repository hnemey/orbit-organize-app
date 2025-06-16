
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
    return tasks?.filter(task => task.scheduledDate?.startsWith(monthStr)) || [];
  };

  return (
    <div className="flex-1 bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-8 h-[1200px]">
      <div className="grid grid-cols-3 gap-8 h-full">
        {months.map((month, index) => {
          const monthTasks = getTasksForMonth(month);
          return (
            <div
              key={index}
              onClick={() => onMonthClick(index)}
              className="bg-gray-700 rounded-lg p-6 cursor-pointer hover:bg-gray-600 transition-colors border border-gray-600 flex flex-col justify-center"
            >
              <h3 className="text-lg font-semibold text-white mb-4 text-center">
                {format(month, 'MMMM')}
              </h3>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">
                  {monthTasks.length}
                </div>
                <div className="text-sm text-gray-400">
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
