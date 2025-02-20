import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/AuthProvider';

interface ProtectedRouteProps {
  allowedRoles: string[];
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, redirectPath = '/' }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Show loading while checking session
  }

  if (!user) {
    return <Navigate to="/" replace />; // Redirect to login if no user
  }

  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to={redirectPath} replace />; // Redirect if user role is not allowed
  }

  return <Outlet />; // Render the protected route if the user is authenticated and has the right role
};

export default ProtectedRoute;
