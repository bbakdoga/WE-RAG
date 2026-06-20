import { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { usePoints } from '../context/PointsContext';
import { notifications } from '../data/content';
import { pageVariants, staggerContainer, listItemFade } from '../utils/animations';
import {
  Home, Briefcase, Calendar, MessageCircle, Award, Users, Map, User,
  BookOpen, GraduationCap, Trophy, Settings, Search, Bell, Menu, X,
  ChevronDown, LogOut, Shield, Zap, Star, TrendingUp, Mail, LayoutDashboard, Database
} from 'lucide-react';

const navItems = [
  { to: '/', icon: Home, label: 'Home', section: 'main' },
  { to: '/opportunities', icon: Briefcase, label: 'Opportunities', section: 'main', badge: 3 },
  { to: '/events', icon: Calendar, label: 'Events', section: 'main' },
  { to: '/community', icon: MessageCircle, label: 'Community', section: 'main', badge: 5 },
  { to: '/skills', icon: Award, label: 'Skills & Badges', section: 'learn' },
  { to: '/leaderboard', icon: Trophy, label: 'Leaderboard', section: 'learn' },
  { to: '/journey', icon: Map, label: 'My Journey', section: 'connect' },
  { to: '/blogs', icon: BookOpen, label: 'Blogs & Tutorials', section: 'content' },
  { to: '/alumni', icon: GraduationCap, label: 'Alumni Stories', section: 'content' },
  { to: '/profile', icon: User, label: 'Profile', section: 'account' },
];

const adminNavItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Overview', section: 'management' },
  { to: '/admin/students', icon: Users, label: 'Students CRM', section: 'management' },
  { to: '/admin/campaigns', icon: Mail, label: 'Campaigns', section: 'management' },
  { to: '/admin/content', icon: Database, label: 'Manage Content', section: 'management' },
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
  const { user, isAdmin, switchDemoRole } = useAuth();
  const { points, getTier, streak, showPointsAnimation } = usePoints();
  const location = useLocation();
  const navigate = useNavigate();
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

  const adminSections = [
    { key: 'management', label: 'Admin Tools' },
  ];

  const activeSections = isAdmin ? adminSections : sections;
  const activeNavItems = isAdmin ? adminNavItems : navItems;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="app-shell">
      <div className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`} onClick={() => setSidebarOpen(false)} />

      <aside className={`app-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <div className="sidebar-brand-logo">W</div>
          <div className="sidebar-brand-text">
            <span>WE-Connect</span>
            <span>Würth Elektronik</span>
          </div>
        </div>

        <motion.nav 
          className="sidebar-nav"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          {activeSections.map(section => {
            const items = activeNavItems.filter(i => i.section === section.key);
            if (!items.length) return null;
            return (
              <motion.div key={section.key} variants={listItemFade}>
                <div className="sidebar-section-label">{section.label}</div>
                {items.map(item => {
                  const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
                  return (
                    <div
                      key={item.to}
                      className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                      onClick={() => navigate(item.to)}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTabIndicator"
                          className="active-tab-bg"
                          initial={false}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'var(--we-rot-bg)',
                            borderRadius: 'var(--radius-md)',
                            zIndex: -1
                          }}
                        />
                      )}
                      <item.icon className="nav-icon" size={20} style={{ color: isActive ? 'var(--we-rot)' : 'inherit' }} />
                      <span style={{ color: isActive ? 'var(--we-rot)' : 'inherit', fontWeight: isActive ? 600 : 500 }}>{item.label}</span>
                      {item.badge && <span className="nav-badge">{item.badge}</span>}
                    </div>
                  );
                })}
              </motion.div>
            );
          })}
        </motion.nav>

        {/* Demo Switcher */}
        <div style={{ padding: 'var(--space-4)', borderTop: '1px solid var(--we-gray-200)', marginTop: 'auto' }}>
          <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--we-gray-500)', marginBottom: 'var(--space-2)' }}>DEMO MODE</div>
          <div style={{ display: 'flex', background: 'var(--we-gray-100)', borderRadius: 'var(--radius-full)', padding: 4, position: 'relative' }}>
            <div 
              style={{ 
                position: 'absolute', 
                top: 4, 
                bottom: 4, 
                width: 'calc(50% - 4px)', 
                background: 'var(--we-white)', 
                borderRadius: 'var(--radius-full)',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: isAdmin ? 'translateX(100%)' : 'translateX(0)',
                zIndex: 0
              }} 
            />
            <button 
              onClick={() => { switchDemoRole('student'); navigate('/'); }}
              style={{ flex: 1, padding: 'var(--space-2) 0', fontSize: 'var(--text-xs)', fontWeight: !isAdmin ? 600 : 500, color: !isAdmin ? 'var(--we-rot)' : 'var(--we-gray-500)', zIndex: 1, position: 'relative' }}
            >
              🎓 Student
            </button>
            <button 
              onClick={() => { switchDemoRole('admin'); navigate('/admin'); }}
              style={{ flex: 1, padding: 'var(--space-2) 0', fontSize: 'var(--text-xs)', fontWeight: isAdmin ? 600 : 500, color: isAdmin ? 'var(--we-rot)' : 'var(--we-gray-500)', zIndex: 1, position: 'relative' }}
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{user?.initials || 'WE'}</div>
          <div className="sidebar-user-info">
            <span className="name">{user?.name || 'Guest'}</span>
            <span className="tier">{tier.icon} {tier.name} · {points} pts</span>
          </div>
        </div>
      </aside>

      <div className="app-main">
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
            <AnimatePresence>
              {streak > 0 && (
                <motion.div 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className="streak-badge"
                >
                  <span className="streak-flame">🔥</span>
                  <span>{streak}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showPointsAnimation && (
                <motion.div 
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.8 }}
                  className="points-delta positive" 
                  style={{ position: 'absolute', top: '70px', right: '140px', zIndex: 999 }}
                >
                  +{showPointsAnimation.amount} pts
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={notifRef} style={{ position: 'relative' }}>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="header-icon-btn" 
                onClick={() => setNotifOpen(!notifOpen)}
              >
                <Bell size={20} />
                {unreadCount > 0 && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="notif-dot" />}
              </motion.button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.1 } }}
                    className="notif-dropdown"
                    style={{ transformOrigin: 'top right' }}
                  >
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
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/profile')}>
              <div className="header-avatar">{user?.initials || 'WE'}</div>
            </motion.div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.main 
            key={location.pathname}
            className="app-content"
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <Outlet />
          </motion.main>
        </AnimatePresence>
      </div>

      {!isAdmin && (
        <nav className="mobile-nav">
          {mobileNavItems.map(item => {
            const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
            return (
              <div
                key={item.to}
                className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => navigate(item.to)}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobileActiveTabIndicator"
                    className="mobile-active-tab-bg"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderTop: '2px solid var(--we-rot)',
                      zIndex: -1,
                      background: 'linear-gradient(180deg, var(--we-rot-bg) 0%, transparent 100%)'
                    }}
                  />
                )}
                <item.icon size={22} style={{ color: isActive ? 'var(--we-rot)' : 'inherit' }} />
                <span style={{ color: isActive ? 'var(--we-rot)' : 'inherit' }}>{item.label}</span>
              </div>
            );
          })}
        </nav>
      )}
    </div>
  );
}
