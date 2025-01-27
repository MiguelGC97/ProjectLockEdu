import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import instance from '@/services/api';

interface AuthContextProps {
  user: any; // Replace `any` with a user type
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Auto-login if token exists
    const token = localStorage.getItem('authToken');
    if (token) {
      instance
        .get('/signin', { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setUser(res.data.user))
        .catch(() => localStorage.removeItem('authToken'));
    }
  }, []);

  const login = async (username: string, password: string) => {
    const res = await axios.post('/login', { username, password });
    const { token } = res.data;
    localStorage.setItem('authToken', token);
    setUser(res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
