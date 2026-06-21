import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import userStore from '../services/UserStore';

const PointsContext = createContext(null);

export function PointsProvider({ children }) {
  const { user, refreshUser } = useAuth();

  const [points, setPoints] = useState(0);
  const [weeklyPoints, setWeeklyPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [recentActions, setRecentActions] = useState([]);
  const [showPointsAnimation, setShowPointsAnimation] = useState(null);

  // Sync state from user whenever user object changes
  useEffect(() => {
    if (user && user.role !== 'admin') {
      setPoints(user.points || 0);
      setWeeklyPoints(user.weeklyPoints || 0);
      setStreak(user.streak || 0);
    }
  }, [user]);

  const addPoints = useCallback((amount, action) => {
    if (!user || user.role === 'admin') return;

    const newPoints = (user.points || 0) + amount;
    const newWeekly = (user.weeklyPoints || 0) + amount;

    // Update local state immediately for responsive UI
    setPoints(newPoints);
    setWeeklyPoints(newWeekly);

    // Persist to UserStore (broadcasts to other tabs)
    userStore.updateUserProgress(user.id, {
      points: newPoints,
      weeklyPoints: newWeekly,
    });

    // Log the activity
    userStore.logActivity(user.id, action, amount);

    // Update recent actions locally
    setRecentActions(prev =>
      [{ action, points: amount, time: new Date().toISOString() }, ...prev].slice(0, 20)
    );

    // Show animation
    setShowPointsAnimation({ amount, action });
    setTimeout(() => setShowPointsAnimation(null), 2000);

    // Refresh user to keep AuthContext in sync
    refreshUser();
  }, [user, refreshUser]);

  const getTier = useCallback((pts) => {
    const p = pts ?? points;
    if (p >= 2500) return { name: 'Grandmaster', icon: '👑', color: '#7C3AED' };
    if (p >= 1000) return { name: 'Master', icon: '💎', color: '#CC0000' };
    if (p >= 500) return { name: 'Expert', icon: '🏆', color: '#F59E0B' };
    if (p >= 200) return { name: 'Contributor', icon: '⚡', color: '#B9C900' };
    if (p >= 50) return { name: 'Explorer', icon: '🔍', color: '#009EE0' };
    return { name: 'Novice', icon: '🌱', color: '#6B7280' };
  }, [points]);

  const getNextTier = useCallback(() => {
    if (points >= 2500) return null;
    const thresholds = [50, 200, 500, 1000, 2500];
    const next = thresholds.find(t => t > points);
    return { threshold: next, remaining: next - points };
  }, [points]);

  return (
    <PointsContext.Provider value={{
      points, weeklyPoints, streak, recentActions,
      showPointsAnimation, addPoints, getTier, getNextTier
    }}>
      {children}
    </PointsContext.Provider>
  );
}

export function usePoints() {
  const ctx = useContext(PointsContext);
  if (!ctx) throw new Error('usePoints must be used within PointsProvider');
  return ctx;
}
