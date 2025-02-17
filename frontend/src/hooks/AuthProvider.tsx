import { createContext, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserType } from '@/types/types';
import useLocalStorage from './useLocalStorage';

const AuthContext = createContext<any>(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage('user', null);
  const navigate = useNavigate();

  const login = (data: UserType) => {
    setUser(data);
    navigate('/perfil');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('access_token');
    navigate('/', { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
