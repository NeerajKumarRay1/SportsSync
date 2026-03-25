import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wrap any route that requires authentication.
 *
 * Usage in your router:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/" element={<DiscoveryHome />} />
 *     <Route path="/schedule" element={<MySchedule />} />
 *     <Route path="/profile" element={<PlayerDashboard />} />
 *   </Route>
 */
export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />;
}
