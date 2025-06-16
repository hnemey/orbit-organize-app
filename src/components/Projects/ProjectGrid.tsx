
import React from 'react';
import { Project, Task, TaskFilter } from '../../types';
import ProjectCard from './ProjectCard';
import { isTaskOverdue, isTaskDueThisWeek, formatDate } from '../../utils/dateUtils';

interface ProjectGridProps {
  projects: Project[];
  tasks: Task[];
  filter: TaskFilter;
  onEditProject: (projectId: string, updates: Partial<Project>) => void;
  onDeleteProject: (projectId: string) => void;
  onAddTask: (taskData: Omit<Task, 'id'>) => void;
  onEditTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleTask: (taskId: string) => void;
}

const ProjectGrid: React.FC<ProjectGridProps> = ({
  projects,
  tasks,
  filter,
  onEditProject,
  onDeleteProject,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleTask
}) => {
  const filterTasks = (projectTasks: Task[]): Task[] => {
    const today = formatDate(new Date());
    const weekFromNow = new Date();
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    const weekFromNowStr = formatDate(weekFromNow);

    switch (filter) {
      case 'today':
        return projectTasks.filter(task => task.scheduledDate === today);
      case 'week':
        return projectTasks.filter(task => 
          task.scheduledDate && task.scheduledDate <= weekFromNowStr
        );
      case 'month':
        const monthFromNow = new Date();
        monthFromNow.setMonth(monthFromNow.getMonth() + 1);
        const monthFromNowStr = formatDate(monthFromNow);
        return projectTasks.filter(task => 
          task.scheduledDate && task.scheduledDate <= monthFromNowStr
        );
      case 'no-date':
        return projectTasks.filter(task => !task.scheduledDate);
      default:
        return projectTasks;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {projects.map(project => {
        const projectTasks = tasks.filter(task => task.projectId === project.id);
        const filteredTasks = filterTasks(projectTasks);

        return (
          <ProjectCard
            key={project.id}
            project={project}
            tasks={filteredTasks}
            allTasks={projectTasks}
            onEditProject={onEditProject}
            onDeleteProject={onDeleteProject}
            onAddTask={onAddTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onToggleTask={onToggleTask}
          />
        );
      })}

      {projects.length === 0 && (
        <div className="col-span-full text-center py-12 text-gray-400">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
          <p>Create your first project to start organizing your tasks.</p>
        </div>
      )}
    </div>
  );
};

export default ProjectGrid;
