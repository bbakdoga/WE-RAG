import { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePoints } from '../context/PointsContext';
import { notifications } from '../data/content';
import {
  Home, Briefcase, Calendar, MessageCircle, Award, Users, Map, User,
  BookOpen, GraduationCap, Trophy, Settings, Search, Bell, Menu, X,
  ChevronDown, LogOut, Shield, Zap, Star, TrendingUp
} from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home', section: 'main' },
  { to: '/opportunities', icon: Briefcase, label: 'Opportunities', section: 'main', badge: 3 },
  { to: '/events', icon: Calendar, label: 'Events', section: 'main' },
  { to: '/community', icon: MessageCircle, label: 'Community', section: 'main', badge: 5 },
  { to: '/skills', icon: Award, label: 'Skills & Badges', section: 'learn' },
  { to: '/leaderboard', icon: Trophy, label: 'Leaderboard', section: 'learn' },
  { to: '/mentoring', icon: Users, label: 'Mentoring', section: 'connect' },
  { to: '/journey', icon: Map, label: 'My Journey', section: 'connect' },
  { to: '/blogs', icon: BookOpen, label: 'Blogs & Tutorials', section: 'content' },
  { to: '/alumni', icon: GraduationCap, label: 'Alumni Stories', section: 'content' },
  { to: '/profile', icon: User, label: 'Profile', section: 'account' },
];

const mobileNavItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/opportunities', icon: Briefcase, label: 'Jobs' },
  { to: '/community', icon: MessageCircle, label: 'Community' },
  { to: '/skills', icon: Award, label: 'Skills' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { user, isAdmin, toggleAdmin } = useAuth();
  const { points, getTier, streak, showPointsAnimation } = usePoints();
  const location = useLocation();
  const notifRef = useRef(null);
  const tier = getTier();

  useEffect(() => { setSidebarOpen(false); }, [location]);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const sections = [
    { key: 'main', label: 'Main' },
    { key: 'learn', label: 'Learn & Grow' },
    { key: 'connect', label: 'Connect' },
    { key: 'content', label: 'Content' },
    { key: 'account', label: 'Account' },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="app-shell">
      {/* Sidebar Overlay for mobile */}
      <div className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`} onClick={() => setSidebarOpen(false)} />

      {/* Sidebar */}
      <aside className={`app-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-logo">W</div>
          <div className="sidebar-brand-text">
            <span>WE-Connect</span>
            <span>Würth Elektronik</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          {sections.map(section => {
            const items = navItems.filter(i => i.section === section.key);
            if (!items.length) return null;
            return (
              <div key={section.key}>
                <div className="sidebar-section-label">{section.label}</div>
                {items.map(item => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                  >
                    <item.icon className="nav-icon" size={20} />
                    <span>{item.label}</span>
                    {item.badge && <span className="nav-badge">{item.badge}</span>}
                  </NavLink>
                ))}
              </div>
            );
          })}

          {/* Admin toggle */}
          <div className="sidebar-section-label">Admin</div>
          <NavLink
            to="/admin"
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
          >
            <Shield className="nav-icon" size={20} />
            <span>Admin Dashboard</span>
          </NavLink>
        </nav>

        {/* Sidebar User */}
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{user?.initials || 'WE'}</div>
          <div className="sidebar-user-info">
            <span className="name">{user?.name || 'Guest'}</span>
            <span className="tier">{tier.icon} {tier.name} · {points} pts</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="app-main">
        {/* Header */}
        <header className="app-header">
          <div className="header-left">
            <button className="header-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="header-search">
              <Search className="search-icon" size={18} />
              <input type="text" placeholder="Search opportunities, events, channels..." />
            </div>
          </div>

          <div className="header-right">
            {/* Streak Badge */}
            {streak > 0 && (
              <div className="streak-badge">
                <span className="streak-flame">🔥</span>
                <span>{streak}</span>
              </div>
            )}

            {/* Points Animation */}
            {showPointsAnimation && (
              <div className="points-delta positive animate-slide-up" style={{ position: 'absolute', top: '70px', right: '140px', zIndex: 999 }}>
                +{showPointsAnimation.amount} pts
              </div>
            )}

            {/* Notifications */}
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button className="header-icon-btn" onClick={() => setNotifOpen(!notifOpen)}>
                <Bell size={20} />
                {unreadCount > 0 && <span className="notif-dot" />}
              </button>

              {notifOpen && (
                <div className="notif-dropdown">
                  <div className="notif-dropdown-header">
                    <h4 style={{ fontSize: '0.95rem', margin: 0 }}>Notifications</h4>
                    <button className="btn btn-ghost btn-sm">Mark all read</button>
                  </div>
                  <div className="notif-dropdown-list">
                    {notifications.map(n => (
                      <div key={n.id} className={`notification-item ${!n.read ? 'unread' : ''}`}>
                        <span style={{ fontSize: '1.2rem' }}>{n.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--we-black)' }}>{n.title}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--we-gray-500)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.description}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--we-gray-400)', marginTop: '2px' }}>{n.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <NavLink to="/profile">
              <div className="header-avatar">{user?.initials || 'WE'}</div>
            </NavLink>
          </div>
        </header>

        {/* Page Content */}
        <main className="app-content">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-nav">
        {mobileNavItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon size={22} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
