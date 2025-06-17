
import React from 'react';
import { Calendar } from 'lucide-react';
import { formatDisplayDate } from '@/utils/dateUtils';

const TodaysCalendar: React.FC = () => {
  const today = new Date();
  const todayFormatted = formatDisplayDate(today.toISOString().split('T')[0]);

  return (
    <div className="bg-gray-800 rounded-lg p-6 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-6 h-6 text-blue-400" />
        <h2 className="text-xl font-semibold text-white">Today's Schedule</h2>
      </div>
      
      <div className="text-gray-300 mb-4">
        {todayFormatted}
      </div>
      
      {/* Calendar content area */}
      <div className="space-y-3">
        <div className="text-center py-8 text-gray-400">
          No events scheduled for today
        </div>
      </div>
    </div>
  );
};

export default TodaysCalendar;
