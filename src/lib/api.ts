import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios';
import {
  errorInterceptor,
  requestInterceptor,
  successInterceptor
} from './interceptors';
const BASE_URL = process.env.REACT_APP_API_URL ?? 'https://training-api-timesheet.nccsoft.vn';

const axiosRequestConfig: AxiosRequestConfig = {
  baseURL: `${BASE_URL}/api`,
  responseType: 'json',
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
};

const api: AxiosInstance = axios.create(axiosRequestConfig);

api.interceptors.request.use(requestInterceptor);
api.interceptors.response.use(successInterceptor, errorInterceptor);

export { api };
