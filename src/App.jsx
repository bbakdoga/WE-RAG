import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { PointsProvider } from './context/PointsContext';
import { ToastProvider } from './context/ToastContext';
import AppShell from './components/AppShell';
import Dashboard from './pages/Dashboard';
import Opportunities from './pages/Opportunities';
import Events from './pages/Events';
import Community from './pages/Community';
import Skills from './pages/Skills';
import QuizView from './pages/QuizView';
import Journey from './pages/Journey';
import Profile from './pages/Profile';
import Blogs from './pages/Blogs';
import Alumni from './pages/Alumni';
import Leaderboard from './pages/Leaderboard';
import AdminOverview from './pages/admin/AdminOverview';
import AdminStudents from './pages/admin/AdminStudents';
import AdminCampaigns from './pages/admin/AdminCampaigns';
import AdminContent from './pages/admin/AdminContent';
import Login from './pages/Login';

// Route guard: redirects to /login if not authenticated
function ProtectedRoute({ children, adminOnly = false, studentOnly = false }) {
  const { isLoggedIn, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--we-gray-50)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>W</div>
          <div style={{ color: 'var(--we-gray-500)' }}>Loading...</div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  if (studentOnly && isAdmin) return <Navigate to="/admin" replace />;

  return children;
}

function AnimatedRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={
        <ProtectedRoute>
          <AppShell />
        </ProtectedRoute>
      }>
        {/* Student Routes */}
        <Route path="/" element={
          <ProtectedRoute studentOnly><Dashboard /></ProtectedRoute>
        } />
        <Route path="/opportunities" element={
          <ProtectedRoute studentOnly><Opportunities /></ProtectedRoute>
        } />
        <Route path="/events" element={
          <ProtectedRoute studentOnly><Events /></ProtectedRoute>
        } />
        <Route path="/community" element={
          <ProtectedRoute studentOnly><Community /></ProtectedRoute>
        } />
        <Route path="/skills" element={
          <ProtectedRoute studentOnly><Skills /></ProtectedRoute>
        } />
        <Route path="/skills/quiz/:quizId" element={
          <ProtectedRoute studentOnly><QuizView /></ProtectedRoute>
        } />
        <Route path="/journey" element={
          <ProtectedRoute studentOnly><Journey /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute studentOnly><Profile /></ProtectedRoute>
        } />
        <Route path="/blogs" element={
          <ProtectedRoute studentOnly><Blogs /></ProtectedRoute>
        } />
        <Route path="/alumni" element={
          <ProtectedRoute studentOnly><Alumni /></ProtectedRoute>
        } />
        <Route path="/leaderboard" element={
          <ProtectedRoute studentOnly><Leaderboard /></ProtectedRoute>
        } />
        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <ProtectedRoute adminOnly><AdminOverview /></ProtectedRoute>
        } />
        <Route path="/admin/students" element={
          <ProtectedRoute adminOnly><AdminStudents /></ProtectedRoute>
        } />
        <Route path="/admin/campaigns" element={
          <ProtectedRoute adminOnly><AdminCampaigns /></ProtectedRoute>
        } />
        <Route path="/admin/content" element={
          <ProtectedRoute adminOnly><AdminContent /></ProtectedRoute>
        } />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PointsProvider>
          <ToastProvider>
            <AnimatedRoutes />
          </ToastProvider>
        </PointsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
