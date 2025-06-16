
import React from 'react';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarHeaderProps {
  currentDate: Date;
  view: 'week' | 'day';
  onViewChange: (view: 'week' | 'day') => void;
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
            
            <h2 className="text-xl font-semibold text-white min-w-48 text-center">
              {view === 'week' 
                ? `Week of ${format(currentDate, 'MMM d, yyyy')}`
                : format(currentDate, 'EEEE, MMM d, yyyy')
              }
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
            onClick={() => onViewChange('day')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              view === 'day'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Day
          </button>
          <button
            onClick={() => onViewChange('week')}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              view === 'week'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            Week
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
