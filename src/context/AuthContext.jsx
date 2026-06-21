import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import userStore from '../services/UserStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const session = userStore.getSession();
    if (session?.user) {
      setUser(session.user);
      setIsAdmin(session.user.role === 'admin');
      setIsLoggedIn(true);
    }
    setIsLoading(false);
  }, []);

  // Listen for cross-tab user updates (refresh our user data if it changed)
  useEffect(() => {
    if (!user) return;
    const unsub = userStore.subscribe((payload) => {
      if (payload.type === 'user-updated' && payload.userId === user.id) {
        setUser(payload.user);
      }
    });
    return unsub;
  }, [user?.id]);

  const login = useCallback((email, password) => {
    const loggedInUser = userStore.login(email, password);
    if (!loggedInUser) return { error: 'Invalid email or password' };
    setUser(loggedInUser);
    setIsAdmin(loggedInUser.role === 'admin');
    setIsLoggedIn(true);
    return loggedInUser;
  }, []);

  const loginAsUser = useCallback((userId) => {
    const u = userStore.getUser(userId);
    if (!u) return { error: 'User not found' };
    // Create session directly
    localStorage.setItem('we_current_session', JSON.stringify({
      userId: u.id,
      loginTime: Date.now(),
    }));
    setUser(u);
    setIsAdmin(u.role === 'admin');
    setIsLoggedIn(true);
    return u;
  }, []);

  const register = useCallback((userData) => {
    const result = userStore.register(userData);
    if (result.error) return result;
    setUser(result);
    setIsAdmin(false);
    setIsLoggedIn(true);
    return result;
  }, []);

  const logout = useCallback(() => {
    userStore.logout();
    setIsLoggedIn(false);
    setUser(null);
    setIsAdmin(false);
  }, []);

  const updateProfile = useCallback((updates) => {
    if (!user) return;
    const updated = userStore.updateUser(user.id, updates);
    if (updated) setUser(updated);
  }, [user]);

  const refreshUser = useCallback(() => {
    if (!user) return;
    const fresh = userStore.getUser(user.id);
    if (fresh) setUser(fresh);
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user, isAdmin, isLoggedIn, isLoading,
      login, loginAsUser, register, logout, updateProfile, refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
