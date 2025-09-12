import axios, {
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from "axios";
import { toast } from "sonner"; // For user notifications

// Create an Axios instance with base config
const api = axios.create({
  baseURL: "http://localhost:3000/api", // Replace with your API base URL
  timeout: 10000, // 10s timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// Interface for custom error
interface ApiError {
  message: string;
  status?: number;
  data?: any;
}

// Interface for API response
interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

// Centralized error handler
const handleError = (error: AxiosError): ApiError => {
  if (error.response) {
    // Server responded with 4xx, 5xx
    const { status, data } = error.response;
    const message =
      typeof data === "object" && data !== null && "message" in data
        ? (data as { message: string }).message
        : `Request failed with status ${status}`;
    toast.error(message); // Notify user
    return { message, status, data };
  } else if (error.request) {
    // No response received
    const message = "No response from server. Check your network.";
    toast.error(message);
    return { message };
  } else {
    // Request setup error
    const message = error.message || "An unexpected error occurred";
    toast.error(message);
    return { message };
  }
};

// Add response interceptor for global error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response, // Pass successful responses
  (error: AxiosError) => {
    const apiError = handleError(error);
    if (error.response?.status === 401) {
      // Example: Redirect to login on unauthorized
      window.location.href = "/login";
    }
    return Promise.reject(apiError);
  }
);

// Generic API request function
const apiRequest = async <T>(
  method: "get" | "post" | "put" | "delete" | "patch",
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<ApiResponse<T>> => {
  try {
    const response: AxiosResponse<T> = await api({
      method,
      url,
      data,
      ...config, // Allow custom config (e.g., headers, params)
    });
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    throw handleError(error as AxiosError);
  }
};

// Convenience methods
export const get = <T>(url: string, config?: AxiosRequestConfig) =>
  apiRequest<T>("get", url, undefined, config);

export const post = <T>(url: string, data: any, config?: AxiosRequestConfig) =>
  apiRequest<T>("post", url, data, config);

export const put = <T>(url: string, data: any, config?: AxiosRequestConfig) =>
  apiRequest<T>("put", url, data, config);

export const del = <T>(url: string, config?: AxiosRequestConfig) =>
  apiRequest<T>("delete", url, undefined, config);

export const patch = <T>(url: string, data: any, config?: AxiosRequestConfig) =>
  apiRequest<T>("patch", url, data, config);

// Set auth token dynamically
export const setAuthToken = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

// Clear auth token
export const clearAuthToken = () => {
  delete api.defaults.headers.common["Authorization"];
};
