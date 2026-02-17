import { apiClient } from './client';
import type { LoginRequest, LoginResponse } from '../types';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>('/login', credentials);
    return data;
  },
};

export const offersApi = {
  getOffers: async () => {
    const { data } = await apiClient.get('/offers');
    return data;
  },
};

export const storesApi = {
  getStores: async () => {
    const { data } = await apiClient.get('/stores');
    return data;
  },
  getStoreById: async (id: string) => {
    const { data } = await apiClient.get(`/stores/${id}`);
    return data;
  },
};

export const statisticsApi = {
  getStatistics: async (
    period: 'daily' | 'weekly' | 'monthly' = 'monthly',
    filter = true,
  ) => {
    const { data } = await apiClient.get('/statistics', {
      params: { period, filter },
    });
    return data;
  },
};

export const notificationsApi = {
  getNotifications: async () => {
    const { data } = await apiClient.get('/notifications');
    return data;
  },
};
