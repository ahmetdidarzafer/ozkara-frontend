import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, role, isAuthenticated, userRole, loading }) => {
  const location = useLocation();

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  if (!isAuthenticated || (role && userRole !== role)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute; 