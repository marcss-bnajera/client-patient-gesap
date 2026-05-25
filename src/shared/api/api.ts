import axios, { type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "../../features/auth/store/authStore";

export const axiosPortal = axios.create({
  baseURL: "/gesap-portal/v1",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

const attachToken = (config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

axiosPortal.interceptors.request.use(attachToken);

axiosPortal.interceptors.response.use(
  (r) => r,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
