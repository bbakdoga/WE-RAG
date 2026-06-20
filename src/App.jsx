import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PointsProvider } from './context/PointsContext';
import AppShell from './components/AppShell';
import Dashboard from './pages/Dashboard';
import Opportunities from './pages/Opportunities';
import Events from './pages/Events';
import Community from './pages/Community';
import Skills from './pages/Skills';
import QuizView from './pages/QuizView';
import Mentoring from './pages/Mentoring';
import Journey from './pages/Journey';
import Profile from './pages/Profile';
import Blogs from './pages/Blogs';
import Alumni from './pages/Alumni';
import Leaderboard from './pages/Leaderboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <PointsProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<AppShell />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/opportunities" element={<Opportunities />} />
              <Route path="/events" element={<Events />} />
              <Route path="/community" element={<Community />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/skills/quiz/:quizId" element={<QuizView />} />
              <Route path="/mentoring" element={<Mentoring />} />
              <Route path="/journey" element={<Journey />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/alumni" element={<Alumni />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PointsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
