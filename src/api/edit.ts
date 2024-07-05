import { IAppResponse, IProjectCredential } from '@/types';
import { api } from '../lib/api';
export const getEdit = async (input: string): Promise<IAppResponse<IProjectCredential>> => await api.get('/services/app/Project/Get', { params: { input } });
