import { getAllTask } from '@/api';
import { ITask } from '@/types';
import { useEffect, useState } from 'react';
export interface AllTaskProjectsReturnType {
  task: ITask[]
  loadingTask: boolean
}
export const useTask = (): AllTaskProjectsReturnType => {
  const [task, setTask] = useState<ITask[]>([]);
  const [loadingTask, setLoading] = useState(true);
  useEffect(() => {
    const fetchTask = async (): Promise<void> => {
      try {
        const response = await getAllTask();
        if (response.success) {
          setTask(response.result);
        } else {
          console.error(response.error);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    void fetchTask();
  }, []);
  return {
    task,
    loadingTask
  };
};
