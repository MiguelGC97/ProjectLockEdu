import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import instance from '@/services/api';
import { login as authService } from '@/services/authService';
import { UserType } from '@/types/types';
import useLocalStorage from './useLocalStorage';

interface AuthContextType {
  user: UserType | null;
  theme: string;
  banner: string;
  notification: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateTheme: (newTheme: string) => void;
  updateBanner: (newBanner: string) => void;
  updateNotification: (newNotification: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useLocalStorage('user', null);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [banner, setBanner] = useLocalStorage('banner', '');
  const [notification, setNotification] = useLocalStorage('notification', true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      instance
        .get('/signin', { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          setUser(res.data.user);
          fetchUserThemePreference(res.data.user.id);
          fetchUserBanner(res.data.user.id);
          fetchUserNotificationPreference(res.data.user.id);
        })
        .catch(() => localStorage.removeItem('authToken'));
    }
  }, [setUser]);

  const fetchUserThemePreference = async (userId: number) => {
    try {
      const res = await instance.get(`/user/settings/${userId}`);
      setTheme(res.data.settings.theme);
    } catch (error) {
      console.error('Error fetching user theme:', error);
    }
  };

  const fetchUserBanner = async (userId: number) => {
    try {
      const res = await instance.get(`/user/settings/${userId}`);
      setBanner(res.data.settings.banner);
    } catch (error) {
      console.error('Error fetching user banner:', error);
    }
  };

  const fetchUserNotificationPreference = async (userId: number) => {
    try {
      const res = await instance.get(`/user/settings/${userId}`);
      setNotification(res.data.settings.notifications);
    } catch (error) {
      console.error('Error fetching user notification preference:', error);
    }
  };

  const updateTheme = (newTheme: string) => setTheme(newTheme);
  const updateBanner = (newBanner: string) => setBanner(newBanner);
  const updateNotification = (newNotification: boolean) => {
    setNotification(newNotification);
  };

  const login = async (username: string, password: string) => {
    try {
      const data = await authService(username, password);
      const { token, user } = data;

      localStorage.setItem('authToken', token);
      setUser(user);
      fetchUserThemePreference(user.id);
      fetchUserBanner(user.id);
      fetchUserNotificationPreference(user.id);
      navigate('/perfil');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setTheme('dark');
    setBanner('');
    setNotification(true);
    navigate('/', { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      theme,
      banner,
      notification,
      login,
      logout,
      updateTheme,
      updateBanner,
      updateNotification,
    }),
    [user, theme, banner, notification]
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
