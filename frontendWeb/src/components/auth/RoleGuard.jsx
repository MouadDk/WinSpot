import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingScreen from '../ui/LoadingScreen';

export default function RoleGuard({ allowedRole, children }) {
  const { user, isLoading, token } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Verifying access..." />;
  }

  // If not logged in, redirect to choose-role or login
  if (!token || !user) {
    return <Navigate to="/choose-role" replace />;
  }

  const userRole = user?.role;

  // If the user's role does not match the allowed role for this dashboard
  if (userRole && userRole !== allowedRole) {
    // Redirect them to their actual dashboard
    if (userRole === 'influencer') {
      return <Navigate to="/influencer-dashboard" replace />;
    } else if (userRole === 'merchant') {
      return <Navigate to="/restaurant-dashboard" replace />;
    }
    // Fallback if role is somehow invalid
    return <Navigate to="/choose-role" replace />;
  }

  // If role matches, allow access
  return children;
}
