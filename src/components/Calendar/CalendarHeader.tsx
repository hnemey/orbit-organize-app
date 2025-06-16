
import React from 'react';
import { format, addDays, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from 'lucide-react';

interface CalendarHeaderProps {
  currentDate: Date;
  view: 'week' | 'day';
  onViewChange: (view: 'week' | 'day') => void;
  onNavigate: (direction: 'prev' | 'next') => void;
  onGoToToday: () => void;
  timeWindowStart: number;
  onTimeWindowChange: (direction: 'up' | 'down') => void;
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  currentDate,
  view,
  onViewChange,
  onNavigate,
  onGoToToday,
  timeWindowStart,
  onTimeWindowChange
}) => {
  const formatTimeRange = () => {
    const startHour = timeWindowStart;
    const endHour = Math.min(timeWindowStart + 12, 24);
    
    const formatHour = (hour: number) => {
      if (hour === 0) return '12 AM';
      if (hour === 12) return '12 PM';
      if (hour < 12) return `${hour} AM`;
      return `${hour - 12} PM`;
    };
    
    return `${formatHour(startHour)} - ${formatHour(endHour)}`;
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

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Time:</span>
            <span className="text-sm text-white font-medium">{formatTimeRange()}</span>
            <div className="flex flex-col">
              <button
                onClick={() => onTimeWindowChange('up')}
                disabled={timeWindowStart <= 0}
                className="p-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronUp className="w-3 h-3" />
              </button>
              <button
                onClick={() => onTimeWindowChange('down')}
                disabled={timeWindowStart >= 12}
                className="p-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
            </div>
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
    </div>
  );
};

export default CalendarHeader;
