
import { Habit, Task, Project } from '../types';

const STORAGE_KEYS = {
  HABITS: 'productivity-habits',
  PROJECTS: 'productivity-projects',
  TASKS: 'productivity-tasks',
} as const;

// Habits
export const loadHabits = (): Habit[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.HABITS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveHabits = (habits: Habit[]): void => {
  localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
};

// Projects
export const loadProjects = (): Project[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveProjects = (projects: Project[]): void => {
  localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
};

// Tasks
export const loadTasks = (): Task[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
};
