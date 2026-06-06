import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import AppLayout from '../layouts/AppLayout';
import AuthLayout from '../layouts/AuthLayout';
import LoadingSpinner from '../components/ui';

// Lazy-loaded pages for code splitting
const Landing       = lazy(() => import('../pages/Landing'));
const Login         = lazy(() => import('../pages/Login'));
const Register      = lazy(() => import('../pages/Register'));
const Dashboard     = lazy(() => import('../pages/Dashboard'));
const InterviewSelect = lazy(() => import('../pages/InterviewSelect'));
const InterviewRoom = lazy(() => import('../pages/InterviewRoom'));
const Feedback      = lazy(() => import('../pages/Feedback'));
const CodingRound   = lazy(() => import('../pages/CodingRound'));
const ResumeAnalyzer = lazy(() => import('../pages/ResumeAnalyzer'));
const Analytics     = lazy(() => import('../pages/Analytics'));
const Leaderboard   = lazy(() => import('../pages/Leaderboard'));
const Settings      = lazy(() => import('../pages/Settings'));
const Profile       = lazy(() => import('../pages/Profile'));
const Preparation   = lazy(() => import('../pages/Preparation'));
const NotFound      = lazy(() => import('../pages/NotFound'));

/** Redirects unauthenticated users to /login */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

/** Redirects authenticated users away from auth pages */
const GuestRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => (
  <Suspense fallback={<LoadingSpinner fullscreen />}>
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />

      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
      </Route>

      {/* Protected App */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/dashboard"          element={<Dashboard />} />
        <Route path="/interview"          element={<InterviewSelect />} />
        <Route path="/interview/room"     element={<InterviewRoom />} />
        <Route path="/interview/feedback/:id" element={<Feedback />} />
        <Route path="/coding"             element={<CodingRound />} />
        <Route path="/resume"             element={<ResumeAnalyzer />} />
        <Route path="/analytics"          element={<Analytics />} />
        <Route path="/prep"               element={<Preparation />} />
        <Route path="/leaderboard"        element={<Leaderboard />} />
        <Route path="/settings"           element={<Settings />} />
        <Route path="/profile"            element={<Profile />} />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
