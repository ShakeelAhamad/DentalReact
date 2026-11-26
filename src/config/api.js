
import axios from "axios";
import { ENV } from "../config/env";

let accessToken = null;
let refreshToken = null;
let accessTokenExpiresAt = null;
let refreshTokenExpiresAt = null;

export const setAuthTokens = (data) => {
    accessToken = data.accessToken;
    accessTokenExpiresAt = data.accessTokenExpiresAt;

    if (data.refreshToken) {
        refreshToken = data.refreshToken;
        refreshTokenExpiresAt = data.refreshTokenExpiresAt;

        localStorage.setItem(
            "refreshToken",
            data.refreshToken
        );

        localStorage.setItem(
            "refreshTokenExpiresAt",
            data.refreshTokenExpiresAt ?? ""
        );
    }
};

export const clearAuthTokens = () => {
    accessToken = null;
    refreshToken = null;
    accessTokenExpiresAt = null;
    refreshTokenExpiresAt = null;

    localStorage.removeItem("refreshToken");
    localStorage.removeItem("refreshTokenExpiresAt");
    localStorage.removeItem("dentalcare_user");
};

export const getAccessToken = () => accessToken;
export const getRefreshToken = () => refreshToken;

export const getTokenExpiry = () => ({
    accessTokenExpiresAt,
    refreshTokenExpiresAt,
});

const api = axios.create({
    baseURL: ENV.API_BASE_URL,
    timeout: 15000,
    withCredentials: true,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

// Restore the refresh token after browser reload.
export const restoreAuthSession = async () => {
    const savedRefreshToken = localStorage.getItem("refreshToken");
    if (!savedRefreshToken) {
        return false;
    }

    try {
        const response = await api.post(
            "/auth/refresh-token",
            {
                refreshToken: savedRefreshToken
            }
        );

        const data = response.data.data ?? response.data;
        setAuthTokens(data);
        return true;

    } catch (error) {
        console.log("Refresh status:", error.response?.status);
        console.log("Refresh error:", error.response?.data);

        return false;
    }
};

// Attach access token to requests.
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

// Handle expired access tokens.
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
            //clearAuthTokens();
            return Promise.reject(error);
        }

        if (!refreshPromise) {
            refreshPromise = (async () => {
                try {
                    if (
                        refreshTokenExpiresAt &&
                        Date.now() >= new Date(refreshTokenExpiresAt).getTime()
                    ) {
                        throw new Error("Refresh token expired.");
                    }

                    const response = await api.post(
                        "/auth/refresh-token",
                        { refreshToken }
                    );

                    const data = response.data;

                    if (!data?.accessToken) {
                        throw new Error("Invalid refresh response.");
                    }
                    setAuthTokens(data);
                    return data.accessToken;
                } catch (refreshError) {
                   // clearAuthTokens();
                    throw refreshError;
                } finally {
                    refreshPromise = null;
                }
            })();
        }

        try {
            const newAccessToken = await refreshPromise;
            originalRequest._retry = true;
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;
            return api(originalRequest);
        } catch (refreshError) {
            return Promise.reject(refreshError);
        }
    }
);

export default api;
