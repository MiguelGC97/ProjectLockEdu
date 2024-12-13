import { createContext, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserType } from '@/types/types';
import useLocalStorage from './useLocalStorage';

const AuthContext = createContext<any>(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage('user', null); // Assuming you're using useLocalStorage hook
  const navigate = useNavigate();

  const login = (data: UserType) => {
    setUser(data); // Store user data
    navigate('/perfil'); // Redirect to profile page or dashboard
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('access_token'); // Clear the token from localStorage
    navigate('/', { replace: true }); // Redirect to login page
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
