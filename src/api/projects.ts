import { api } from '../lib/api';
import { IAppResponse, IProject, IQuantityProject } from '../types';

export const getAllProjects = async (
  status: string,
  search: string
): Promise<IAppResponse<IProject[]>> =>
  await api.get('/services/app/Project/getAll', {
    params: {
      status,
      search
    }
  });
export const getQuantityProject = async (): Promise<IAppResponse<IQuantityProject[]>> => await api.get('/services/app/Project/GetQuantityProject');
export const Delete = async (Id: string): Promise<IAppResponse<IProject>> => await api.delete('/services/app/Project/Delete', { params: { Id } });
export const Active = async (id: string): Promise<IAppResponse<IProject>> => await api.post('/services/app/Project/Active', { id });
export const Inactive = async (id: string): Promise<IAppResponse<IProject>> => await api.post('/services/app/Project/Inactive', { id });
