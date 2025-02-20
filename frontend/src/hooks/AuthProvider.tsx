import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import instance from '@/services/api';
import { login as authService } from '@/services/authService';
import { UserType } from '@/types/types';

interface AuthContextType {
  user: UserType | null;
  theme: string;
  banner: string;
  notification: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateTheme: (newTheme: string) => void;
  updateBanner: (newBanner: string) => void;
  updateNotification: (newNotification: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [banner, setBanner] = useState<string>('');
  const [notification, setNotification] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Check session on mount
  useEffect(() => {
    const sessionSid = Cookies.get('connect.sid');
    if (sessionSid) {
      instance
        .get('/users/signin', { withCredentials: true })
        .then((res) => {
          setUser(res.data.user);
          fetchUserPreferences(res.data.user.id);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Session validation failed:', error.response || error);
          Cookies.remove('connect.sid');
          setLoading(false);
          navigate('/');
        });
    } else {
      setLoading(false);
    }
  }, [navigate]);

  const fetchUserPreferences = async (userId: number) => {
    try {
      const res = await instance.get(`/user/settings/${userId}`, { withCredentials: true });
      setTheme(res.data.settings.theme);
      setBanner(res.data.settings.banner);
      setNotification(res.data.settings.notifications);
    } catch (error) {
      console.error('Error fetching user preferences:', error);
    }
  };

  const updateTheme = (newTheme: string) => setTheme(newTheme);
  const updateBanner = (newBanner: string) => setBanner(newBanner);
  const updateNotification = (newNotification: boolean) => setNotification(newNotification);

  const login = async (username: string, password: string) => {
    try {
      const response = await authService(username, password); // Backend login

      // The response from your backend should contain the user data, not session_id
      const { user } = response;

      console.log(user);

      // Now that you have user data, set it in your context
      setUser(user);

      // Fetch additional user preferences if needed
      fetchUserPreferences(user.id);

      // Redirect based on user role
      if (user.role === 'ADMIN') {
        navigate('/armarios');
      } else if (user.role === 'TEACHER') {
        navigate('/perfil');
      } else {
        navigate('/incidencias-manager');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Logout function to remove session and reset context
  const logout = () => {
    Cookies.remove('connect.sid'); // Remove session cookie
    setUser(null); // Clear user data
    setTheme('dark'); // Reset theme to default
    setBanner(''); // Reset banner
    setNotification(true); // Reset notification preference
    navigate('/', { replace: true }); // Redirect to login page
  };

  // Memoize context values to prevent unnecessary re-renders
  const value = useMemo(
    () => ({
      user,
      theme,
      banner,
      notification,
      loading,
      login,
      logout,
      updateTheme,
      updateBanner,
      updateNotification,
    }),
    [user, theme, banner, notification, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
