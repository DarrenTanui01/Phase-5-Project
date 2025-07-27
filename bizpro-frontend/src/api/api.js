import axios from "axios";
import { showPermissionModal } from "../utils/permissionModal"; // Create this utility

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 403) {
      showPermissionModal(
        error.response.data?.error || "You don't have permission to view this."
      );
    }
    return Promise.reject(error);
  }
);

export default api;