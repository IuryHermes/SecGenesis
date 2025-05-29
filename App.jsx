import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Páginas de autenticação
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Páginas principais
import DashboardPage from './pages/DashboardPage';
import EventsPage from './pages/events/EventsPage';
import EventDetailsPage from './pages/events/EventDetailsPage';
import CreateEventPage from './pages/events/CreateEventPage';
import GuestsPage from './pages/guests/GuestsPage';
import ProfilePage from './pages/ProfilePage';
import QRCodePage from './pages/qrcode/QRCodePage';
import NotFoundPage from './pages/NotFoundPage';

// Rota protegida que verifica autenticação
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Verificar permissão baseada no papel do usuário
  if (requiredRole) {
    const hasPermission = 
      (requiredRole === 'admin' && user.role === 'admin') ||
      (requiredRole === 'organizer' && ['admin', 'organizer'].includes(user.role)) ||
      (requiredRole === 'security' && ['admin', 'organizer', 'security'].includes(user.role));
    
    if (!hasPermission) {
      return <Navigate to="/dashboard" />;
    }
  }

  return children;
};

const App = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      {/* Rotas de autenticação */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Rotas protegidas */}
      <Route element={
        <ProtectedRoute>
          <MainLayout />
        </ProtectedRoute>
      }>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/create" element={
          <ProtectedRoute requiredRole="organizer">
            <CreateEventPage />
          </ProtectedRoute>
        } />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route path="/events/:id/guests" element={<GuestsPage />} />
        <Route path="/qrcode/:guestId" element={<QRCodePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Redirecionamentos */}
      <Route path="/" element={<Navigate to="/dashboard" />} />
      
      {/* Página 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default App;
