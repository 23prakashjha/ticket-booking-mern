import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://ticket-booking-mern.onrender.com/api' : '/api');
const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Axios request:', config.method?.toUpperCase(), config.url, 'Token exists:', !!token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log('Token set in headers');
  } else {
    console.log('No token found in localStorage');
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    console.log('Axios response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Axios error:', error.response?.status, error.config?.url, error.response?.data);
    if (error.response?.status === 401) {
      console.log('401 Unauthorized - clearing token');
      localStorage.removeItem('token');
      window.location.href = '/auth';
    }
    return Promise.reject(error);
  }
);

export default api;
