import { createContext, useContext, useState, useCallback } from 'react';
import { currentUser } from '../data/students';

const adminUser = {
  id: 'admin-1',
  name: 'WE Admin Team',
  initials: 'WE',
  role: 'admin',
  email: 'admin@we-online.com',
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(currentUser);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const login = useCallback((userData) => {
    setUser(userData || currentUser);
    setIsAdmin(false);
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setIsLoggedIn(false);
    setUser(null);
    setIsAdmin(false);
  }, []);

  const switchDemoRole = useCallback((role) => {
    if (role === 'admin') {
      setIsAdmin(true);
      setUser(adminUser);
    } else {
      setIsAdmin(false);
      setUser(currentUser);
    }
  }, []);

  const updateProfile = useCallback((updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoggedIn, login, logout, switchDemoRole, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
