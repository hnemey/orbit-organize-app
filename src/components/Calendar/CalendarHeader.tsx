
import React from 'react';
import { format } from 'date-fns';

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
  const getDateRangeText = () => {
    if (view === 'week') {
      const start = new Date(currentDate);
      start.setDate(currentDate.getDate() - currentDate.getDay());
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
    } else {
      return format(currentDate, 'MMMM d, yyyy');
    }
  };

  const getTimeRangeText = () => {
    const endHour = timeWindowStart + 6;
    const startAMPM = timeWindowStart >= 12 ? 'PM' : 'AM';
    const endAMPM = endHour >= 12 ? 'PM' : 'AM';
    const startDisplay = timeWindowStart === 0 ? 12 : timeWindowStart > 12 ? timeWindowStart - 12 : timeWindowStart;
    const endDisplay = endHour === 0 ? 12 : endHour > 12 ? endHour - 12 : endHour;
    
    return `${startDisplay} ${startAMPM} - ${endDisplay} ${endAMPM}`;
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold text-white">Calendar</h1>
        
        <div className="flex gap-2">
          <button
            onClick={() => onViewChange('week')}
            className={`px-3 py-1 rounded ${
              view === 'week' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => onViewChange('day')}
            className={`px-3 py-1 rounded ${
              view === 'day' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300'
            }`}
          >
            Day
          </button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Time Window Controls */}
        <div className="flex items-center gap-2 bg-gray-800 rounded-lg px-3 py-2">
          <button
            onClick={() => onTimeWindowChange('up')}
            disabled={timeWindowStart <= 0}
            className="text-gray-400 hover:text-white disabled:opacity-50"
          >
            ↑
          </button>
          <span className="text-sm text-gray-300 min-w-24 text-center">
            {getTimeRangeText()}
          </span>
          <button
            onClick={() => onTimeWindowChange('down')}
            disabled={timeWindowStart >= 18}
            className="text-gray-400 hover:text-white disabled:opacity-50"
          >
            ↓
          </button>
        </div>

        {/* Date Navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('prev')}
            className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded"
          >
            ←
          </button>
          
          <button
            onClick={onGoToToday}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            Today
          </button>
          
          <button
            onClick={() => onNavigate('next')}
            className="p-2 bg-gray-800 hover:bg-gray-700 text-white rounded"
          >
            →
          </button>
        </div>

        <div className="text-lg font-semibold text-white">
          {getDateRangeText()}
        </div>
      </div>
    </div>
  );
};

export default CalendarHeader;
