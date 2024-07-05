import { getProjectTeam } from '@/api';
import { IUserProjectTeam } from '@/types';
import { useEffect, useState } from 'react';
interface AllProjectsReturnType {
  users: IUserProjectTeam[]
  loadingTeam: boolean
}
export const useTeamView = (projectId: number, startDate?: string, endDate?: string): AllProjectsReturnType => {
  const [users, setUsers] = useState<IUserProjectTeam[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(true);
  useEffect(() => {
    const fetchProjects = async (): Promise<void> => {
      try {
        // await new Promise(resolve => setTimeout(resolve, 600000));
        const response = await getProjectTeam(projectId, startDate, endDate);
        if (response.success) {
          setUsers(response.result);
        } else {
          console.error(response.error);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingTeam(false);
      }
    };
    void fetchProjects();
  }, [projectId, startDate, endDate]);
  return {
    users,
    loadingTeam
  };
};
