
import React, { useState } from 'react';
import { Task, Project, Habit, TimeFilter } from '@/types';
import TodaysCalendar from './TodaysCalendar';
import TasksWidget from './TasksWidget';
import Timer from './Timer';
import HabitProgressChart from './HabitProgressChart';

interface MainDashboardProps {
  tasks: Task[];
  projects: Project[];
  habits: Habit[];
  onTaskComplete: (taskId: string) => void;
  onTaskEdit: (task: Task) => void;
}

const MainDashboard: React.FC<MainDashboardProps> = ({
  tasks,
  projects,
  habits,
  onTaskComplete,
  onTaskEdit
}) => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>
      
      {/* Main grid layout */}
      <div className="grid grid-cols-3 gap-8 h-[calc(100vh-12rem)]">
        {/* Left column - Today's Calendar */}
        <div className="col-span-1">
          <TodaysCalendar 
            tasks={tasks}
            projects={projects}
            onTaskComplete={onTaskComplete}
            onTaskEdit={onTaskEdit}
          />
        </div>
        
        {/* Right side - 2 columns, 3 rows */}
        <div className="col-span-2 grid grid-rows-3 gap-6">
          {/* Row 1 - Tasks with filter */}
          <div className="row-span-1">
            <TasksWidget 
              tasks={tasks}
              projects={projects}
              onTaskComplete={onTaskComplete}
              onTaskEdit={onTaskEdit}
            />
          </div>
          
          {/* Row 2 - Timer spanning 2 columns */}
          <div className="row-span-1">
            <Timer />
          </div>
          
          {/* Row 3 - Daily habit progress */}
          <div className="row-span-1">
            <HabitProgressChart habits={habits} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
