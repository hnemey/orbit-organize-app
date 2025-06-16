
import React from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarHeaderProps {
  currentDate: Date;
  view: 'daily' | 'weekly' | 'monthly' | 'yearly';
  onViewChange: (view: 'daily' | 'weekly' | 'monthly' | 'yearly') => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  onGoToToday: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  view,
  onViewChange,
  onNavigate,
  onGoToToday
}) => {
  const getHeaderTitle = () => {
    switch (view) {
      case 'daily':
        return format(currentDate, 'EEEE, MMMM d, yyyy');
      case 'weekly':
        return `${format(currentDate, 'MMM d')} - ${format(new Date(currentDate.getTime() + 6 * 24 * 60 * 60 * 1000), 'MMM d, yyyy')}`;
      case 'monthly':
        return format(currentDate, 'MMMM yyyy');
      case 'yearly':
        return format(currentDate, 'yyyy');
      default:
        return format(currentDate, 'MMMM yyyy');
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('prev')}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <h2 className="text-xl font-semibold text-white min-w-64 text-center">
              {getHeaderTitle()}
            </h2>
            
            <button
              onClick={() => onNavigate('next')}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onGoToToday}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Today
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onViewChange('daily')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              view === 'daily'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => onViewChange('weekly')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              view === 'weekly'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => onViewChange('monthly')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              view === 'monthly'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => onViewChange('yearly')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              view === 'yearly'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Yearly
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
