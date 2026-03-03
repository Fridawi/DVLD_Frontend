import axios from "axios";
import { store } from "../app/store";
import { logOut } from "../features/auth/authSlice";
import { toast } from "sonner";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token || localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (window.location.pathname !== "/login") {
        toast.error("Session Expired", {
          description:
            "Your session has ended. Please login again to continue.",
          duration: 5000,
        });

        store.dispatch(logOut());
      }
    } else if (error.response?.status === 403) {
      toast.error("Access Denied", {
        description:
          error.response?.data?.detail ||
          "You do not have permission to perform this action.",
        icon: "🚫",
      });
    } else if (error.response?.data?.detail) {
      toast.error(error.response.data.title || "Error", {
        description: error.response.data.detail,
      });
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
