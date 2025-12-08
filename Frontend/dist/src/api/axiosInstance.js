// src/api/axiosInstance.js
import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://127.0.0.1:8000",
  withCredentials: true,
});

// 🔹 Request Interceptor
API.interceptors.request.use((config) => {
  const url = config.url || "";

  // ❌ Do NOT send token for auth endpoints
  const isAuthUrl =
    url.includes("/api/login/") ||
    url.includes("/api/signup/") ||
    url.includes("/api/reset/");

  if (!isAuthUrl) {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// 🔹 Response Interceptor (Auto-logout on 401)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("🔐 401 from API, clearing auth and redirecting to login");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
