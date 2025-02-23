import axios from 'axios';
import Cookies from 'js-cookie';

export const baseUrl = import.meta.env.VITE_BASE_URL;
export const imageBaseUrl = import.meta.env.VITE_IMAGE_BASE_URL;

const instance = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const sessionId = Cookies.get('connect.sid');

    if (sessionId) {
      console.log('Session ID:', sessionId);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
