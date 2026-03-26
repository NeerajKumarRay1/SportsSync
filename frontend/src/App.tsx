import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import AuthScreen from './pages/AuthScreen';
import DiscoveryHome from './pages/DiscoveryHome';
import MySchedule from './pages/MySchedule';
import PlayerDashboard from './pages/PlayerDashboard';
import CreateEvent from './pages/CreateEvent';
import LiveChat from './pages/LiveChat';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/auth" element={<AuthScreen />} />

          {/* Protected — must be logged in */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DiscoveryHome />} />
            <Route path="/schedule" element={<MySchedule />} />
            <Route path="/profile" element={<PlayerDashboard />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/chat" element={<LiveChat />} />
            <Route path="/chat/:eventId" element={<LiveChat />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
