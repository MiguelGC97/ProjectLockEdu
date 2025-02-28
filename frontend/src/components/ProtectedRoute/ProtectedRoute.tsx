import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/store';

interface ProtectedRouteProps {
  allowedRoles: string[];
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, redirectPath = '/' }) => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
