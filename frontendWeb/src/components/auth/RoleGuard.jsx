import { useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

import LoadingScreen from '../ui/LoadingScreen';

export default function RoleGuard({ allowedRole, children }) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <LoadingScreen message="Verifying access..." />;
  }

  const userRole = user?.unsafeMetadata?.role;

  // If the user's role does not match the allowed role for this dashboard
  if (userRole && userRole !== allowedRole) {
    // Redirect them to their actual dashboard
    if (userRole === 'influencer') {
      return <Navigate to="/influencer-dashboard" replace />;
    } else if (userRole === 'restaurant') {
      return <Navigate to="/restaurant-dashboard" replace />;
    }
    // Fallback if role is somehow invalid
    return <Navigate to="/choose-role" replace />;
  }

  // If role matches (or isn't set for some reason, though it should be), allow access
  return children;
}
