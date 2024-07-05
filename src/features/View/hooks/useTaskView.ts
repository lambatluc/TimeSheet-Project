import { getProjectTasks } from '@/api';
import { ITasksView } from '@/types';
import { useEffect, useState } from 'react';
interface AllProjectsReturnType {
  tasks: ITasksView[]
  loadingTask: boolean
}
export const useTasksView = (projectId: number, startDate?: string, endDate?: string): AllProjectsReturnType => {
  const [tasks, setTasks] = useState<ITasksView[]>([]);
  const [loadingTask, setLoadingTasks] = useState(true);
  useEffect(() => {
    const fetchProjects = async (): Promise<void> => {
      try {
        // await new Promise(resolve => setTimeout(resolve, 600000));
        const response = await getProjectTasks(projectId, startDate, endDate);
        if (response.success) {
          setTasks(response.result);
        } else {
          console.error(response.error);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingTasks(false);
      }
    };
    void fetchProjects();
  }, [projectId, startDate, endDate]);
  return {
    tasks,
    loadingTask
  };
};
