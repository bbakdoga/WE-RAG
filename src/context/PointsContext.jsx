import { createContext, useContext, useState, useCallback } from 'react';

const PointsContext = createContext(null);

export function PointsProvider({ children }) {
  const [points, setPoints] = useState(847);
  const [weeklyPoints, setWeeklyPoints] = useState(45);
  const [streak, setStreak] = useState(12);
  const [recentActions, setRecentActions] = useState([]);
  const [showPointsAnimation, setShowPointsAnimation] = useState(null);

  const addPoints = useCallback((amount, action) => {
    setPoints(prev => prev + amount);
    setWeeklyPoints(prev => prev + amount);
    setRecentActions(prev => [{ action, points: amount, time: new Date().toISOString() }, ...prev].slice(0, 20));
    setShowPointsAnimation({ amount, action });
    setTimeout(() => setShowPointsAnimation(null), 2000);
  }, []);

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
    <PointsContext.Provider value={{ points, weeklyPoints, streak, recentActions, showPointsAnimation, addPoints, getTier, getNextTier }}>
      {children}
    </PointsContext.Provider>
  );
}

export function usePoints() {
  const ctx = useContext(PointsContext);
  if (!ctx) throw new Error('usePoints must be used within PointsProvider');
  return ctx;
}
