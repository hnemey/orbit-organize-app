import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, parseISO, isAfter, isBefore, addDays, startOfWeek, endOfWeek } from 'date-fns';
import { Task, TaskFilter } from '../types';

export const formatDate = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

export const formatTime = (date: Date): string => {
  return format(date, 'HH:mm');
};

export const formatDisplayDate = (dateString: string): string => {
  return format(parseISO(dateString), 'MMM d, yyyy');
};

export const formatDisplayTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const getCurrentMonthKey = (): string => {
  return format(new Date(), 'yyyy-MM');
};

export const getMonthDays = (year: number, month: number): Date[] => {
  const start = startOfMonth(new Date(year, month - 1));
  const end = endOfMonth(new Date(year, month - 1));
  return eachDayOfInterval({ start, end });
};

export const isCurrentDay = (date: Date): boolean => {
  return isToday(date);
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month, 0).getDate();
};

export const getWeekDays = (date: Date): Date[] => {
  const start = startOfWeek(date, { weekStartsOn: 0 }); // Sunday
  const end = endOfWeek(date, { weekStartsOn: 0 });
  return eachDayOfInterval({ start, end });
};

export const isTaskOverdue = (scheduledDate?: string): boolean => {
  if (!scheduledDate) return false;
  return isBefore(parseISO(scheduledDate), new Date()) && !isToday(parseISO(scheduledDate));
};

export const isTaskDueThisWeek = (scheduledDate?: string): boolean => {
  if (!scheduledDate) return false;
  const taskDate = parseISO(scheduledDate);
  const weekEnd = addDays(new Date(), 7);
  return !isAfter(taskDate, weekEnd);
};

export const filterTasks = (tasks: Task[], filter: TaskFilter): Task[] => {
  const now = new Date();
  const today = formatDate(now);
  const weekEnd = formatDate(addDays(now, 7));
  const monthEnd = formatDate(addDays(now, 30));

  switch (filter) {
    case 'today':
      return tasks.filter(task => task.scheduledDate === today);
    case 'week':
      return tasks.filter(task => 
        task.scheduledDate && task.scheduledDate <= weekEnd
      );
    case 'month':
      return tasks.filter(task => 
        task.scheduledDate && task.scheduledDate <= monthEnd
      );
    case 'no-date':
      return tasks.filter(task => !task.scheduledDate);
    default:
      return tasks;
  }
};
