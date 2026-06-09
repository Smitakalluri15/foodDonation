import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate  = useNavigate();
  const location  = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const getDashboardPath = () => {
    if (!user) return '/';
    const map = { DONOR: '/donor', NGO: '/ngo', VOLUNTEER: '/volunteer', ADMIN: '/admin' };
    return map[user.role] || '/';
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* Logo */}
        <Link to="/" style={styles.logo}>
          <span style={styles.logoIcon}>🌿</span>
          <span style={styles.logoText}>FoodShare</span>
        </Link>

        {/* Desktop links */}
        <div style={styles.links}>
          <Link
            to="/experience"
            style={{
              ...styles.link,
              borderRadius: '999px',
              padding: '6px 14px',
              fontWeight: 700,
              background: isActive('/experience')
                ? 'linear-gradient(135deg,var(--primary),var(--secondary))'
                : 'rgba(255,255,255,0.85)',
              color: isActive('/experience') ? '#1c1b18' : '#374151',
              border: '1px solid rgba(0,0,0,0.06)',
              boxShadow: isActive('/experience')
                ? '0 12px 24px rgba(255,212,0,0.25)'
                : '0 8px 16px rgba(0,0,0,0.05)',
            }}
          >
            Experience
          </Link>
          <Link
            to="/leaderboard"
            style={{
              ...styles.link,
              ...(isActive('/leaderboard') ? styles.linkActive : {})
            }}
          >
            Leaderboard
          </Link>
          {isAuthenticated() && (
            <>
              <Link
                to={getDashboardPath()}
                style={{ ...styles.link, ...(isActive(getDashboardPath()) ? styles.linkActive : {}) }}
              >
                Dashboard
              </Link>

              <Link
                to="/feed"
                style={{ ...styles.link, ...(isActive('/feed') ? styles.linkActive : {}) }}
              >
                Live Feed
              </Link>

              <Link
                to="/map"
                style={{ ...styles.link, ...(isActive('/map') ? styles.linkActive : {}) }}
              >
                Map
              </Link>

              {user?.role === 'DONOR' && (
                <Link to="/add-donation" style={{ ...styles.link, ...(isActive('/add-donation') ? styles.linkActive : {}) }}>
                  + Donate Food
                </Link>
              )}

              {(user?.role === 'NGO' || user?.role === 'VOLUNTEER') && (
                <Link to="/available-food" style={{ ...styles.link, ...(isActive('/available-food') ? styles.linkActive : {}) }}>
                  Available Food
                </Link>
              )}

              {user?.role === 'VOLUNTEER' && (
                <Link to="/pickup-tasks" style={{ ...styles.link, ...(isActive('/pickup-tasks') ? styles.linkActive : {}) }}>
                  My Tasks
                </Link>
              )}

              {user?.role === 'ADMIN' && (
                <Link to="/admin" style={{ ...styles.link, ...(isActive('/admin') ? styles.linkActive : {}) }}>
                  Admin
                </Link>
              )}
            </>
          )}
        </div>

        {/* Right side */}
        <div style={styles.right}>
          {isAuthenticated() ? (
            <div style={styles.userMenu}>
              <NotificationBell />
              <span style={styles.userName}>
                👤 {user?.name?.split(' ')[0]}
              </span>
              <span style={styles.rolePill}>{user?.role}</span>
              <button style={styles.logoutBtn} onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Link to="/login"    className="btn btn-outline btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    position: 'sticky', top: 0, zIndex: 100,
    background: '#fff',
    borderBottom: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    height: '64px',
  },
  inner: {
    maxWidth: '1200px', margin: '0 auto',
    padding: '0 1.5rem', height: '100%',
    display: 'flex', alignItems: 'center', gap: '1.5rem',
  },
  logo: {
    display: 'flex', alignItems: 'center', gap: '8px',
    fontWeight: 700, fontSize: '18px', color: 'var(--primary-text)',
    textDecoration: 'none', marginRight: '0.5rem',
  },
  logoIcon: { fontSize: '22px' },
  logoText: {},
  links: { display: 'flex', alignItems: 'center', gap: '0.25rem', flex: 1 },
  link: {
    padding: '6px 12px', borderRadius: '6px',
    fontSize: '14px', fontWeight: '500',
    color: '#374151', textDecoration: 'none',
    transition: 'background 0.15s',
  },
  linkActive: { background: 'var(--primary-light)', color: 'var(--primary-dark-text)' },
  right: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: 'auto' },
  userMenu: { display: 'flex', alignItems: 'center', gap: '8px' },
  userName: { fontSize: '14px', fontWeight: '500', color: '#374151' },
  rolePill: {
    background: '#dcfce7', color: '#166534',
    fontSize: '11px', fontWeight: '600', padding: '2px 8px',
    borderRadius: '20px', textTransform: 'uppercase',
  },
  logoutBtn: {
    background: 'transparent', border: '1.5px solid #d1d5db',
    borderRadius: '6px', padding: '5px 12px',
    fontSize: '13px', color: '#6b7280',
    cursor: 'pointer', fontWeight: '500',
  },
};

export default Navbar;
