
import React from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarHeaderProps {
  currentDate: Date;
  view: 'month' | 'week' | 'day' | 'year';
  onViewChange: (view: 'month' | 'week' | 'day' | 'year') => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  onToday: () => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  view,
  onViewChange,
  onNavigate,
  onToday
}) => {
  const getHeaderTitle = () => {
    switch (view) {
      case 'month':
        return format(currentDate, 'MMMM yyyy');
      case 'week':
        return format(currentDate, 'MMM yyyy');
      case 'day':
        return format(currentDate, 'EEEE, MMMM d, yyyy');
      case 'year':
        return format(currentDate, 'yyyy');
      default:
        return format(currentDate, 'MMMM yyyy');
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onToday}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Today
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('prev')}
              className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            <h2 className="text-xl font-semibold text-white min-w-48 text-center">
              {getHeaderTitle()}
            </h2>
            
            <button
              onClick={() => onNavigate('next')}
              className="p-2 hover:bg-gray-700 rounded text-gray-300 hover:text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-1">
          <button
            onClick={() => onViewChange('month')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              view === 'month'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => onViewChange('week')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              view === 'week'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => onViewChange('day')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              view === 'day'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            Day
          </button>
          <button
            onClick={() => onViewChange('year')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              view === 'year'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
          >
            Year
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
