// app/utils/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://192.168.100.117:8000/api/',
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = await AsyncStorage.getItem('refresh_token');
      if (!refresh) return Promise.reject(err);

      try {
        const response = await axios.post('http://192.168.100.117:8000/api/authenticator/token/refresh/', {
          refresh,
        });

        const { access, refresh: newRefresh } = response.data;
        await AsyncStorage.setItem('access_token', access);
        await AsyncStorage.setItem('refresh_token', newRefresh);

        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest); // retry original request
      } catch (refreshErr) {
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
