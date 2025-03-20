import axios from 'axios';

const API_URL = 'http://localhost:5130/api'; // API URL'nizi güncelleyin

// Axios instance oluşturma
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Token için request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Hata işleme için response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { status, data, config } = error.response || {};

    switch (status) {
      case 400:
        console.error('Bad Request:', data);
        break;
      case 401:
        console.error('Unauthorized');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        break;
      case 404:
        console.error('Not Found:', config.url);
        break;
      case 500:
        console.error('Server Error:', data);
        break;
      default:
        console.error('API Error:', data);
    }

    return Promise.reject(error);
  }
);

// API istek metotları
const requests = {
  get: (url) => axiosInstance.get(url).then((response) => response.data),
  post: (url, body) => axiosInstance.post(url, body).then((response) => response.data),
  put: (url, body) => axiosInstance.put(url, body).then((response) => response.data),
  delete: (url) => axiosInstance.delete(url).then((response) => response.data)
};

export default requests;