import { api } from '@/lib/api';
import { IAppResponse, ITasksView, IUserProjectTeam } from '@/types';

export const getProjectTasks = async (projectId: number, startDate?: string, endDate?: string): Promise<IAppResponse<ITasksView[]>> =>
  await api.get(`/services/app/TimeSheetProject/GetTimeSheetStatisticTasks?projectId=${projectId ?? ''}&startDate=${startDate ?? ''}&endDate=${endDate ?? ''}`);
export const getProjectTeam = async (projectId?: number, startDate?: string, endDate?: string): Promise<IAppResponse<IUserProjectTeam[]>> =>
  await api.get(`/services/app/TimeSheetProject/GetTimeSheetStatisticTeams?projectId=${projectId ?? ''}&startDate=${startDate ?? ''}&endDate=${endDate ?? ''}`);
