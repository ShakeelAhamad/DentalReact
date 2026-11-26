
import axios from "axios";
import { ENV } from "../config/env";

let accessToken = null;
let refreshToken = null;
let accessTokenExpiresAt = null;
let refreshTokenExpiresAt = null;

// export const setAuthTokens = (data) => {
//   accessToken = data.accessToken;
//   refreshToken = data.refreshToken;
//   accessTokenExpiresAt = data.accessTokenExpiresAt;
//   refreshTokenExpiresAt = data.refreshTokenExpiresAt;
// };

export const setAuthTokens = (data) => {
    accessToken = data.accessToken;
    accessTokenExpiresAt = data.accessTokenExpiresAt;

    if (data.refreshToken) {
        refreshToken = data.refreshToken;
        refreshTokenExpiresAt = data.refreshTokenExpiresAt;
    }
};

export const clearAuthTokens = () => {
  accessToken = null;
  refreshToken = null;
  accessTokenExpiresAt = null;
  refreshTokenExpiresAt = null;
};

export const getAccessToken = () => accessToken;
export const getRefreshToken = () => refreshToken;

export const getTokenExpiry = () => ({
  accessTokenExpiresAt,
  refreshTokenExpiresAt,
});

// const api = axios.create({
//   baseURL: ENV.API_BASE_URL,
//   timeout: 15000,
//   headers: {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   },
// });
const api = axios.create({
    baseURL: ENV.API_BASE_URL,
    timeout: 15000,
    withCredentials: true,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers = config.headers ?? {};

      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

let refreshPromise = null;

// Keep ONE response interceptor.
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url ?? "";

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/refresh-token")
    ) {
      return Promise.reject(error);
    }

    if (!refreshToken) {
      clearAuthTokens();
      sessionStorage.removeItem("dentalcare_user");
      return Promise.reject(error);
    }

    // Reuse one refresh request if multiple requests fail together.
    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          if (
            refreshTokenExpiresAt &&
            Date.now() >= new Date(refreshTokenExpiresAt).getTime()
          ) {
            throw new Error(
              "Refresh token expired. Please log in again."
            );
          }

          // const response = await api.post("/auth/refresh-token", {
          //   refreshToken,
          // });
          const response = await api.post("/auth/refresh-token");

          const data = response.data;

          if (!data?.accessToken || !data?.refreshToken) {
            throw new Error("Invalid refresh response.");
          }

          // The backend rotates both tokens.
          setAuthTokens(data);

          return data.accessToken;
        } catch (refreshError) {
          clearAuthTokens();
          sessionStorage.removeItem("dentalcare_user");
          throw refreshError;
        } finally {
          refreshPromise = null;
        }
      })();
    }

    try {
      const newAccessToken = await refreshPromise;

      originalRequest._retry = true;
      originalRequest.headers =
        originalRequest.headers ?? {};

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  }
);

export default api;
