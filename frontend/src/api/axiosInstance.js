import axios from 'axios';
import { clearAuthData } from '../utils/tokenUtils';

const BASE_URL = 'https://wanderlust-backend-1fth.onrender.com';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 10000 // 10 second timeout
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(request => {
    console.log('Starting Request:', request.method.toUpperCase(), request.url);
    console.log('Request Headers:', request.headers);
    return request;
});

// Add response interceptor for debugging
axiosInstance.interceptors.response.use(
    response => {
        console.log('Response:', response.status, response.data);
        return response;
    },
    error => {
        if (error.response) {
            // Server responded with error
            console.error('Server Error:', {
                status: error.response.status,
                data: error.response.data,
                url: error.config.url
            });
        } else if (error.request) {
            // Request made but no response
            console.error('Network Error:', {
                url: error.config.url,
                message: 'No response received'
            });
        } else {
            // Error in request configuration
            console.error('Request Error:', error.message);
        }
        return Promise.reject(error);
    }
);

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            // Add timestamp to prevent caching
            config.headers['X-Timestamp'] = Date.now();
        }
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle token-related errors
        if (error.response?.status === 401) {
            // If it's not a login/register/signup request
            if (!originalRequest.url.includes('/login') && 
                !originalRequest.url.includes('/signup')) {
                
                // If token expired or invalid, clear auth and redirect
                if (error.response.data?.message?.includes('token') ||
                    error.response.data?.message?.includes('expired')) {
                    console.error('Token error:', error.response.data);
                    clearAuthData();
                    window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
                    return Promise.reject(error);
                }
            }
        }

        // Handle other errors
        const errorMessage = error.response?.data?.message || error.message;
        const errorDetails = error.response?.data?.details;
        
        console.error('API Error:', {
            url: originalRequest.url,
            method: originalRequest.method,
            message: errorMessage,
            details: errorDetails
        });

        return Promise.reject(error.response?.data || error);
    }
);

export default axiosInstance;