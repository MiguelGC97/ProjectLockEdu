﻿import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
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

  useEffect(() => {
    const sessionSid = Cookies.get('connect.sid');
    const savedUser = sessionStorage.getItem('user');

    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setLoading(false);
      return;
    }

    if (!sessionSid) {
      setLoading(false);
      return;
    }

    instance
      .get('/users/validateSession', { withCredentials: true })
      .then((res) => {
        const userData = res.data.user;
        sessionStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        fetchUserPreferences(userData.id);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Session validation failed:', error.response || error);
        Cookies.remove('connect.sid');
        sessionStorage.removeItem('user');
        setLoading(false);
        navigate('/');
      });
  }, [navigate]);

  const fetchUserPreferences = async (userId: number) => {
    try {
      const res = await instance.get(`/users/settings/${userId}`, { withCredentials: true });
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
      const response = await authService(username, password);
      const { user } = response;

      sessionStorage.setItem('user', JSON.stringify(user));

      setUser(user);
      fetchUserPreferences(user.id);

      if (user.role === 'ADMIN') {
        navigate('/panel-admin');
      } else if (user.role === 'TEACHER') {
        navigate('/perfil');
      } else {
        navigate('/incidencias-manager');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const logout = () => {
    Cookies.remove('connect.sid');
    sessionStorage.removeItem('user');
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
