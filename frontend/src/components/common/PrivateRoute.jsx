import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  console.log('PrivateRoute - Loading:', loading, 'User:', user); 

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    console.log('PrivateRoute - No user found, redirecting to login'); 
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;