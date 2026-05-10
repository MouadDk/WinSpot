import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import LoadingScreen from '../ui/LoadingScreen';

export default function RoleGuard({ allowedRole, children }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/choose-role" replace />;
  }

  if (!user) {
    return <LoadingScreen message="Vérification de l’accès..." />;
  }

  const userRole = user.role;

  if (userRole && userRole !== allowedRole) {
    if (userRole === 'influencer') {
      return <Navigate to="/influencer-dashboard" replace />;
    }
    if (userRole === 'restaurant') {
      return <Navigate to="/restaurant-dashboard" replace />;
    }
    return <Navigate to="/choose-role" replace />;
  }

  return children;
}
