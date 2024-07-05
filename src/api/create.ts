import { api } from '../lib/api';
import { IAppResponse, IBranch, IClient, INewClient, IProjectCredential, ITask, IUser } from '../types';
export const getUserNotPagging = async (): Promise<IAppResponse<IUser[]>> => await api.get('/services/app/User/GetUserNotPagging');
export const getAllBranchFillter = async (): Promise<IAppResponse<IBranch[]>> => await api.get('/services/app/Branch/GetAllBranchFilter?isAll=true');
export const getAllTask = async (): Promise<IAppResponse<ITask[]>> => await api.get('/services/app/Task/GetAll');
export const getAllClient = async (): Promise<IAppResponse<IClient[]>> => await api.get('/services/app/Customer/GetAll');
export const Save = async (formData: IProjectCredential): Promise<IAppResponse<IProjectCredential>> => await api.post('/services/app/Project/Save', formData);
export const saveNewClient = async (data: INewClient): Promise<IAppResponse<INewClient>> => await api.post('/services/app/Customer/Save', data);
