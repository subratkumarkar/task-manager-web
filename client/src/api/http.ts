import axios from "axios";

export const api = axios.create({
    baseURL: "/api",
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (
        token &&
        !config.url?.includes("/auth/login") &&
        !config.url?.includes("/auth/signup")
    ) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ---- Global 401 handler ----
api.interceptors.response.use(
    (res) => res,
    (err) => {
        const status = err?.response?.status;
        const url = err?.config?.url || "";
        // Do NOT treat login/signup failures as session-expired
        if (url.includes("/auth/login") || url.includes("/auth/signup")) {
            return Promise.reject(err);
        }
        // protected API failures trigger logout
        if (status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            window.location.href = "/login?session=expired";
            return;
        }
        return Promise.reject(err);
    }
);




