
export interface Habit {
  id: string;
  name: string;
  completions: { [date: string]: boolean }; // date format: YYYY-MM-DD
  monthKey: string; // format: YYYY-MM
}

export interface Task {
  id: string;
  name: string;
  notes: string;
  priority: 'low' | 'medium' | 'high';
  urgency: 'low' | 'medium' | 'high';
  estimatedMinutes: number;
  completed: boolean;
  projectId: string;
  scheduledDate?: string; // YYYY-MM-DD format
  scheduledTime?: string; // HH:MM format
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  color: string; // hex color code
  notes?: string;
  description?: string;
  createdAt: string;
}

export type TabType = 'dashboard' | 'habits' | 'projects' | 'calendar';

export type TaskFilter = 'all' | 'today' | 'week' | 'month' | 'no-date';
export type TimeFilter = 'all' | 'today' | 'week' | 'overdue';
