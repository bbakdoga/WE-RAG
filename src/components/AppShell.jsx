import { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usePoints } from '../context/PointsContext';
import { notifications } from '../data/content';
import {
  Home, Briefcase, Calendar, MessageCircle, Award, Users, Map, User,
  BookOpen, GraduationCap, Trophy, Settings, Search, Bell, Menu, X,
  ChevronDown, LogOut, Shield, Zap, Star, TrendingUp, Mail, LayoutDashboard, Database, Globe
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const navItems = [
  { to: '/', icon: Home, labelKey: 'nav.home', section: 'main' },
  { to: '/opportunities', icon: Briefcase, labelKey: 'nav.opportunities', section: 'main', badge: 3 },
  { to: '/events', icon: Calendar, labelKey: 'nav.events', section: 'main' },
  { to: '/community', icon: MessageCircle, labelKey: 'nav.community', section: 'main', badge: 5 },
  { to: '/skills', icon: Award, labelKey: 'nav.skills', section: 'learn' },
  { to: '/leaderboard', icon: Trophy, labelKey: 'nav.leaderboard', section: 'learn' },
  { to: '/journey', icon: Map, labelKey: 'nav.journey', section: 'connect' },
  { to: '/blogs', icon: BookOpen, labelKey: 'nav.blogs', section: 'content' },
  { to: '/alumni', icon: GraduationCap, labelKey: 'nav.alumni', section: 'content' },
  { to: '/profile', icon: User, labelKey: 'nav.profile', section: 'account' },
];

const adminNavItems = [
  { to: '/admin', icon: LayoutDashboard, labelKey: 'nav.adminOverview', section: 'management' },
  { to: '/admin/students', icon: Users, labelKey: 'nav.adminStudents', section: 'management' },
  { to: '/admin/campaigns', icon: Mail, labelKey: 'nav.adminCampaigns', section: 'management' },
  { to: '/admin/content', icon: Database, labelKey: 'nav.adminContent', section: 'management' },
];

const mobileNavItems = [
  { to: '/', icon: Home, labelKey: 'nav.home' },
  { to: '/opportunities', icon: Briefcase, labelKey: 'nav.opportunities' },
  { to: '/community', icon: MessageCircle, labelKey: 'nav.community' },
  { to: '/skills', icon: Award, labelKey: 'nav.skills' },
  { to: '/profile', icon: User, labelKey: 'nav.profile' },
];

export default function AppShell() {
  const { t, i18n } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { user, isAdmin, logout } = useAuth();
  const { points, getTier, streak, showPointsAnimation } = usePoints();
  const location = useLocation();
  const navigate = useNavigate();
  const notifRef = useRef(null);
  const tier = getTier();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'de' : 'en';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('we_language', nextLang);
  };

  useEffect(() => { setSidebarOpen(false); }, [location]);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const sections = [
    { key: 'main', labelKey: 'nav.main' },
    { key: 'learn', labelKey: 'nav.learn' },
    { key: 'connect', labelKey: 'nav.connect' },
    { key: 'content', labelKey: 'nav.content' },
    { key: 'account', labelKey: 'nav.account' },
  ];

  const adminSections = [
    { key: 'management', labelKey: 'nav.management' },
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

        <nav className="sidebar-nav">
          {activeSections.map(section => {
            const items = activeNavItems.filter(i => i.section === section.key);
            if (!items.length) return null;
            return (
              <div key={section.key}>
                <div className="sidebar-section-label">{t(section.labelKey)}</div>
                {items.map(item => {
                  const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
                  return (
                    <div
                      key={item.to}
                      className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                      onClick={() => navigate(item.to)}
                    >
                      {isActive && (
                        <div
                          className="active-tab-bg"
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
                      <span style={{ color: isActive ? 'var(--we-rot)' : 'inherit', fontWeight: isActive ? 600 : 500 }}>{t(item.labelKey)}</span>
                      {item.badge && <span className="nav-badge">{item.badge}</span>}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div style={{ padding: 'var(--space-4)', borderTop: '1px solid var(--we-gray-200)', marginTop: 'auto' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
              width: '100%', padding: 'var(--space-3) var(--space-4)',
              background: 'var(--we-gray-50)', border: '1px solid var(--we-gray-200)',
              borderRadius: 'var(--radius-md)', cursor: 'pointer',
              fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--we-gray-600)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => { e.target.style.background = 'var(--we-rot-bg)'; e.target.style.color = 'var(--we-rot)'; e.target.style.borderColor = 'var(--we-rot)'; }}
            onMouseLeave={(e) => { e.target.style.background = 'var(--we-gray-50)'; e.target.style.color = 'var(--we-gray-600)'; e.target.style.borderColor = 'var(--we-gray-200)'; }}
          >
            <LogOut size={16} /> {t('nav.signOut')}
          </button>
        </div>

        <div className="sidebar-user">
          <div className="sidebar-user-avatar">{user?.initials || 'WE'}</div>
          <div className="sidebar-user-info">
            <span className="name">{user?.name || 'Guest'}</span>
            <span className="tier">
              {isAdmin ? '🛡️ Administrator' : `${tier.icon} ${tier.name} · ${points} pts`}
            </span>
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
              <input type="text" placeholder={t('shell.search')} />
            </div>
          </div>

          <div className="header-right">
            <button className="header-icon-btn lang-toggle-btn" onClick={toggleLanguage} title="Toggle Language" style={{ fontSize: 'var(--text-xs)', fontWeight: 700, gap: 4, width: 'auto', padding: '0 8px' }}>
              <Globe size={16} /> {i18n.language.toUpperCase()}
            </button>
            {!isAdmin && streak > 0 && (
              <div className="streak-badge">
                <span className="streak-flame">🔥</span>
                <span>{streak}</span>
              </div>
            )}

            {showPointsAnimation && (
              <div
                className="points-delta positive"
                style={{ position: 'absolute', top: '70px', right: '140px', zIndex: 999, animation: 'fadeInUp 0.3s ease' }}
              >
                +{showPointsAnimation.amount} pts
              </div>
            )}

            <div ref={notifRef} style={{ position: 'relative' }}>
              <button
                className="header-icon-btn"
                onClick={() => setNotifOpen(!notifOpen)}
              >
                <Bell size={20} />
                {unreadCount > 0 && <span className="notif-dot" />}
              </button>

              {notifOpen && (
                <div
                  className="notif-dropdown"
                  style={{ transformOrigin: 'top right' }}
                >
                  <div className="notif-dropdown-header">
                    <h4 style={{ fontSize: '0.95rem', margin: 0 }}>{t('shell.notifications')}</h4>
                    <button className="btn btn-ghost btn-sm">{t('shell.markRead')}</button>
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

            <div onClick={() => navigate(isAdmin ? '/admin' : '/profile')} style={{ cursor: 'pointer' }}>
              <div className="header-avatar">{user?.initials || 'WE'}</div>
            </div>
          </div>
        </header>

        <main className="app-content">
          <Outlet />
        </main>
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
                  <div
                    className="mobile-active-tab-bg"
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
                <span style={{ color: isActive ? 'var(--we-rot)' : 'inherit' }}>{t(item.labelKey)}</span>
              </div>
            );
          })}
        </nav>
      )}
    </div>
  );
}
