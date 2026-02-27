import axios from "axios";
import { getToken, setGlobalToken, removeStorage, getStorage, setStorage } from "../services/storageService";

const client = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers.Authorization) {
      delete config.headers.Authorization;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isLoginAttempt =
        error.config?.url?.includes("/signin") ||
        error.config?.url?.includes("/login") ||
        error.config?.url?.includes("/auth");

      if (!isLoginAttempt) {
        setGlobalToken(null);
        try {
          removeStorage("token");
        } catch {
          // ignore
        }
        try {
          const possibleKeys = ["[client-dashboard][0]", "client-dashboard", "client-dashboard.0"];
          for (const key of possibleKeys) {
            const storeData = getStorage(key) as Record<string, unknown> | null;
            if (storeData) {
              setStorage(key, {
                ...storeData,
                isAuthenticated: false,
                token: "",
                user: { email: "", name: "", id: "" },
                roles: [],
              });
            }
          }
        } catch {
          // ignore
        }
      }
    }
    return Promise.reject(error);
  }
);

export default client;
