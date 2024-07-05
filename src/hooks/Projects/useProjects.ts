import { getAllProjects } from '@/api';
import { IProject } from '@/types';
import { useEffect, useState } from 'react';
interface AllProjectsReturnType {
  projects: IProject[]
  loadingProject: boolean
  refetchData: () => void
  setLoadingProject: React.Dispatch<React.SetStateAction<boolean>>
}
export const useProjects = (status: string, search: string): AllProjectsReturnType => {
  const [projects, setProjects] = useState<IProject[]>([]);
  const [loadingProject, setLoadingProject] = useState(true);
  const [refetch, setRefetch] = useState(false);

  const refetchData = (): void => {
    setRefetch(prev => !prev);
  };
  useEffect(() => {
    const fetchProjects = async (): Promise<void> => {
      try {
        // await new Promise(resolve => setTimeout(resolve, 2000));
        const response = await getAllProjects(status, search);
        if (response.success) {
          setProjects(response.result);
        } else {
          console.error(response.error);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingProject(false);
      }
    };
    void fetchProjects();
  }, [status, search, refetch]);
  return {
    projects,
    loadingProject,
    refetchData,
    setLoadingProject
  };
};
