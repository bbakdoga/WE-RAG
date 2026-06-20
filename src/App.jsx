import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
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

function AnimatedRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<AppShell />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/opportunities" element={<Opportunities />} />
        <Route path="/events" element={<Events />} />
        <Route path="/community" element={<Community />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/skills/quiz/:quizId" element={<QuizView />} />
        <Route path="/journey" element={<Journey />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/alumni" element={<Alumni />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminOverview />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/campaigns" element={<AdminCampaigns />} />
        <Route path="/admin/content" element={<AdminContent />} />
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
