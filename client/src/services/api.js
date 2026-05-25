import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true, // Important for sending/receiving cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for silent refresh token rotation
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Ignore refresh token request itself or initial login failures
    if (originalRequest.url.includes('/auth/refresh-token') || originalRequest.url.includes('/auth/login')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post('/api/v1/auth/refresh-token');
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Silent refresh token rotation failed', refreshError);
        // Dispatch custom logout or simple redirect
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
