import { api } from '../lib/api';
import { IAppResponse, IToken, IUserCredential, IUserInfoResult } from '../types';

export const signIn = async (data: IUserCredential): Promise<IAppResponse<IToken>> => await api.post('/TokenAuth/Authenticate', data);
export const GetCurrentLoginInformations = async (): Promise<IAppResponse<IUserInfoResult>> => await api.get('/services/app/Session/GetCurrentLoginInformations');
