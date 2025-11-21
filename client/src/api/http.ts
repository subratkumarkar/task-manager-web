import axios from 'axios';

export const api = axios.create({baseURL: '/api'});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');

    // Do NOT send token for login or signup
    const url = config.url || "";
    if (url.indexOf("/auth/login") === -1 &&
        url.indexOf("/auth/signup") === -1 &&
        token) {

        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});