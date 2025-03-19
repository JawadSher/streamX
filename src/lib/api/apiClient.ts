import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig} from 'axios';
import { ApiError } from './ApiError';
import { ApiResponse } from './ApiResponse';

const apiClient = axios.create({
  baseURL: process.env.BASE_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAuthToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response) {
      throw new ApiError(
        error.response.data.message || 'Server error occurred',
        error.response.status
      );
    } else if (error.request) {
      throw new ApiError('No response received from server', 0);
    } else {
      throw new ApiError(error.message || 'Request setup error', 0);
    }
  }
);

const getAuthToken = async (): Promise<string | null> => {
  try {
    const response = await fetch('/api/auth/session', { credentials: 'include' });
    if (!response.ok) return null;
    const session = await response.json();
    return session?.accessToken || session?.user?.token || null;
  } catch (error) {
    console.error('Failed to fetch auth token:', error);
    return null;
  }
};

const request = async <T>(
  method: 'get' | 'post' | 'put' | 'delete' | 'patch',
  endpoint: string,
  data?: any,
  config: AxiosRequestConfig = {}
): Promise<ApiResponse<T>> => {
  try {
    const response =
      method === 'get' || method === 'delete'
        ? await apiClient[method](endpoint, config)
        : await apiClient[method](endpoint, data, config);
    return new ApiResponse<T>(response.status, undefined, response.data);
  } catch (error) {
    throw error instanceof ApiError ? error : new ApiError('Unknown error', 0);
  }
};

export const getRequest = async <T>(endpoint: string, config: AxiosRequestConfig = {}) =>
  request<T>('get', endpoint, undefined, config);

export const postRequest = async <T>(
  endpoint: string,
  data: any = {},
  config: AxiosRequestConfig = {}
) => request<T>('post', endpoint, data, config);

export const putRequest = async <T>(
  endpoint: string,
  data: any = {},
  config: AxiosRequestConfig = {}
) => request<T>('put', endpoint, data, config);

export const deleteRequest = async <T>(endpoint: string, config: AxiosRequestConfig = {}) =>
  request<T>('delete', endpoint, undefined, config);

export const patchRequest = async <T>(
  endpoint: string,
  data: any = {},
  config: AxiosRequestConfig = {}
) => request<T>('patch', endpoint, data, config);

export const login = async (credentials: { username: string; password: string }) => {
  const csrfResponse = await fetch('/api/auth/csrf');
  const { csrfToken } = await csrfResponse.json();
  return postRequest<{ user: any; token?: string }>(
    '/api/auth/callback/credentials',
    { ...credentials, csrfToken },
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
  );
};

export const getSession = async () =>
  getRequest<{ user: any; accessToken?: string }>('/api/auth/session');

export default apiClient;