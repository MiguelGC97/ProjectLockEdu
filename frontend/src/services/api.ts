import axios from 'axios';

export const baseUrl = import.meta.env.VITE_BASE_URL; //defined baseURL in env file

const instance = axios.create({
  baseURL: baseUrl,
  timeout: 5000, //5 second timeout
  headers: {
    'X-Custom-Header': 'URLencoded',
  },
});

const token = localStorage.getItem('./middlewares/auth'); 
if (token) {
  instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export default instance;
