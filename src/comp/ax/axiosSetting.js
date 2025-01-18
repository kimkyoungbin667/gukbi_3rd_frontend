import axios from 'axios'

const api = axios.create({
<<<<<<< HEAD
    baseURL: 'http://58.74.46.219:33334/api',
    headers: {
        'Content-Type': 'application/json'
    }
=======

  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json'
  }
>>>>>>> main
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;