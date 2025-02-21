import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie to handle cookies

export const baseUrl = import.meta.env.VITE_BASE_URL;

const instance = axios.create({
  baseURL: baseUrl,
  withCredentials: true, // Ensures cookies are sent with every request
});

instance.interceptors.request.use(
  (config) => {
    // No need to manually attach the session ID, as it will be handled by the browser via the cookie
    // If needed, you can log the session ID from cookies for debugging
    const sessionId = Cookies.get('connect.sid'); // Fetch session ID from cookies

    // Optionally log session ID or debug
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
