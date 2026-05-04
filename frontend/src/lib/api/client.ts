import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to attach JWT token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor to handle 401 errors (e.g., expired token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      console.log("[DEBUG] 401 Error on path:", currentPath);
      // Don't redirect if already on login page (prevents loop)
      // Don't redirect from order success pages (let the page handle it)
      const skipRedirectPaths = ["/login", "/register"];
      const isOrderSuccess = currentPath.includes("/success");
      console.log("[DEBUG] isOrderSuccess:", isOrderSuccess);
      
      if (!skipRedirectPaths.includes(currentPath) && !isOrderSuccess) {
        console.log("[DEBUG] Redirecting to /login");
        localStorage.removeItem("token");
        window.location.href = "/login";
      } else {
        console.log("[DEBUG] Skipping redirect due to path rules");
      }
    }
    return Promise.reject(error);
  }
);
