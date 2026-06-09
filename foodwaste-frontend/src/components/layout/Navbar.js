import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  
  const dropdownRef = useRef(null);

  // Monitor scroll past 12px
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 12) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Monitor localStorage plateful_token for login state
  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('plateful_token') || localStorage.getItem('token');
      setHasToken(!!token);
    };
    checkToken();
    window.addEventListener('storage', checkToken);
    const interval = setInterval(checkToken, 1000);
    return () => {
      window.removeEventListener('storage', checkToken);
      clearInterval(interval);
    };
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('plateful_token');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setHasToken(false);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const getInitials = () => {
    let name = '';
    if (user && user.name) {
      name = user.name;
    } else {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.name) {
          name = storedUser.name;
        }
      } catch (e) {
        // ignore
      }
    }
    if (!name) return 'PL';

    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const getDashboardPath = () => {
    let role = '';
    if (user && user.role) {
      role = user.role;
    } else {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser && storedUser.role) {
          role = storedUser.role;
        }
      } catch (e) {
        // ignore
      }
    }
    const map = { DONOR: '/donor', NGO: '/ngo', VOLUNTEER: '/volunteer', ADMIN: '/admin' };
    return map[role] || '/';
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' && !location.hash;
    }
    if (path.startsWith('#')) {
      return location.hash === path;
    }
    return location.pathname === path;
  };

  // Inline styles definitions
  const styles = {
    navbar: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '68px',
      backgroundColor: '#FFFFFF',
      borderBottom: '1.5px solid #FFEE99',
      zIndex: 1000,
      transition: 'box-shadow 0.3s ease',
      fontFamily: "'Nunito', sans-serif",
      boxShadow: scrolled ? '0 4px 20px rgba(255, 212, 0, 0.18)' : 'none',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 24px',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    // Left: Logo
    logoWrapper: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      textDecoration: 'none',
      cursor: 'pointer',
      position: 'relative',
    },
    logoBadge: {
      width: '40px',
      height: '40px',
      backgroundColor: '#FFD400',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justify(content) { return 'center'; }, // Wait, standard inline CSS property is justifyContent
      justifyContent: 'center',
    },
    logoWordmarkContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
    logoWordmark: {
      fontSize: '24px',
      fontWeight: 800,
      color: '#2C1A00',
      letterSpacing: '-0.5px',
      lineHeight: '1.1',
    },
    logoUnderline: {
      height: '4px',
      width: '80px',
      marginTop: '1px',
    },
    // Center Nav links
    navLinks: {
      display: 'flex',
      alignItems: 'center',
      gap: '32px',
    },
    navLink: {
      fontSize: '15px',
      fontWeight: 600,
      color: '#7a6200',
      textDecoration: 'none',
      cursor: 'pointer',
    },
    // Right Actions
    navActions: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    btnPrimary: {
      backgroundColor: '#FFD400',
      color: '#2C1A00',
      border: 'none',
      padding: '8px 22px',
      borderRadius: '50px',
      fontWeight: 700,
      fontSize: '14px',
      textDecoration: 'none',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(255,212,0,0.3)',
      transition: 'all 0.2s ease',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    btnSecondary: {
      backgroundColor: '#FFFAE5',
      border: '2px solid #FFD400',
      color: '#2C1A00',
      padding: '6px 20px', // Offset for border
      borderRadius: '50px',
      fontWeight: 700,
      fontSize: '14px',
      textDecoration: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    // Avatar and Dropdown
    avatarCircle: {
      width: '40px',
      height: '40px',
      backgroundColor: '#FFD400',
      color: '#2C1A00',
      borderRadius: '50%',
      fontSize: '14px',
      fontWeight: 800,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      border: '2px solid #FFEE99',
      boxShadow: '0 2px 8px rgba(255, 212, 0, 0.15)',
      outline: 'none',
    },
    dropdownMenu: {
      position: 'absolute',
      top: '52px',
      right: '0',
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      border: '1.5px solid #FFEE99',
      boxShadow: '0 8px 24px rgba(255, 212, 0, 0.08)',
      width: '180px',
      padding: '8px 0',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1010,
    },
    dropdownItem: {
      padding: '10px 20px',
      fontSize: '14px',
      fontWeight: 700,
      color: '#7a6200',
      textDecoration: 'none',
      textAlign: 'left',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    dropdownDivider: {
      height: '1px',
      backgroundColor: '#FFEE99',
      margin: '6px 0',
    },
    // Mobile menu drawer
    mobileDrawer: {
      position: 'absolute',
      top: '68px',
      left: 0,
      width: '100%',
      backgroundColor: '#FFFFFF',
      borderBottom: '1.5px solid #FFEE99',
      padding: '16px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      boxShadow: '0 12px 24px rgba(255, 212, 0, 0.08)',
      zIndex: 999,
    },
    mobileLink: {
      fontSize: '16px',
      fontWeight: 700,
      color: '#7a6200',
      textDecoration: 'none',
      padding: '8px 0',
      borderBottom: '1px solid #FFFAE5',
    },
    mobileActions: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginTop: '8px',
    },
  };

  return (
    <nav style={styles.navbar} className="pf-navbar-block">
      <div style={styles.container}>
        {/* Left - Logo */}
        <Link to="/" style={styles.logoWrapper} onClick={() => setMobileMenuOpen(false)}>
          <div style={styles.logoBadge}>
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2C1A00"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="9" />
              <path d="M10 7v4a2 2 0 0 0 4 0V7 M12 7v7" />
            </svg>
          </div>
          <div style={styles.logoWordmarkContainer}>
            <span style={styles.logoWordmark}>Plateful</span>
            {/* Wavy Underline */}
            <svg style={styles.logoUnderline} viewBox="0 0 80 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 3 Q 20 0, 40 3 T 78 3" stroke="#FFD400" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
        </Link>

        {/* Center - Links (Desktop only) */}
        <div style={styles.navLinks} className="desktop-only">
          <Link
            to="/"
            className={`nav-item-link ${isActive('/') ? 'active' : ''}`}
            style={styles.navLink}
          >
            Home
            <span className="nav-dot" />
          </Link>
          <a
            href="/#how-it-works"
            className={`nav-item-link ${isActive('#how-it-works') ? 'active' : ''}`}
            style={styles.navLink}
          >
            How it works
            <span className="nav-dot" />
          </a>
          <Link
            to="/leaderboard"
            className={`nav-item-link ${isActive('/leaderboard') ? 'active' : ''}`}
            style={styles.navLink}
          >
            Leaderboard
            <span className="nav-dot" />
          </Link>
          <Link
            to="/experience"
            className={`nav-item-link ${isActive('/experience') ? 'active' : ''}`}
            style={styles.navLink}
          >
            About
            <span className="nav-dot" />
          </Link>
        </div>

        {/* Right - Actions or User Profile */}
        <div style={styles.navActions} className="desktop-only">
          {hasToken ? (
            <div style={{ position: 'relative' }} ref={dropdownRef}>
              <button
                style={styles.avatarCircle}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="User profile menu"
              >
                {getInitials()}
              </button>
              {dropdownOpen && (
                <div style={styles.dropdownMenu}>
                  <Link to={getDashboardPath()} style={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                    Dashboard
                  </Link>
                  <Link to="/available-food" style={styles.dropdownItem} onClick={() => setDropdownOpen(false)}>
                    Profile
                  </Link>
                  <div style={styles.dropdownDivider} />
                  <button
                    style={{ ...styles.dropdownItem, color: '#E76F51' }}
                    className="logout-btn-dropdown"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" style={styles.btnSecondary} className="btn-secondary-hoverable">
                Log In
              </Link>
              <Link to="/register" style={styles.btnPrimary} className="btn-primary-hoverable">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Menu Toggle */}
        <button
          className={`hamburger mobile-only ${mobileMenuOpen ? 'open' : ''}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2C1A00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line className="line-top" x1="4" y1="6" x2="20" y2="6" />
            <line className="line-middle" x1="4" y1="12" x2="20" y2="12" />
            <line className="line-bottom" x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={styles.mobileDrawer} className="mobile-only">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={styles.mobileLink}>
            Home
          </Link>
          <a href="/#how-it-works" onClick={() => setMobileMenuOpen(false)} style={styles.mobileLink}>
            How it works
          </a>
          <Link to="/leaderboard" onClick={() => setMobileMenuOpen(false)} style={styles.mobileLink}>
            Leaderboard
          </Link>
          <Link to="/experience" onClick={() => setMobileMenuOpen(false)} style={styles.mobileLink}>
            About
          </Link>

          <div style={styles.mobileActions}>
            {hasToken ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ ...styles.mobileLink, borderBottom: 'none' }}
                >
                  Dashboard
                </Link>
                <Link
                  to="/available-food"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ ...styles.mobileLink, borderBottom: 'none' }}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  style={{
                    backgroundColor: '#fee2e2',
                    color: '#b91c1c',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '50px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginTop: '8px',
                    fontFamily: 'inherit',
                  }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ ...styles.btnSecondary, width: '100%', padding: '12px', textAlign: 'center', marginBottom: '8px' }}
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ ...styles.btnPrimary, width: '100%', padding: '12px', textAlign: 'center' }}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      {/* Embedded CSS for transitions, hover actions, and mobile hide/show overrides */}
      <style>{`
        .nav-item-link {
          position: relative;
          padding-bottom: 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: color 0.2s ease;
        }
        .nav-item-link .nav-dot {
          position: absolute;
          bottom: -8px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #FFD400;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .nav-item-link:hover {
          color: #2C1A00 !important;
        }
        .nav-item-link:hover .nav-dot {
          opacity: 1;
        }
        .nav-item-link.active {
          color: #2C1A00 !important;
          font-weight: 800 !important;
        }
        .nav-item-link.active .nav-dot {
          opacity: 1;
        }
        
        /* Buttons hover styles */
        .btn-primary-hoverable:hover {
          background-color: #FFD819 !important;
          transform: translateY(-1px);
        }
        .btn-secondary-hoverable:hover {
          background-color: #FFF6CC !important;
          transform: translateY(-1px);
        }
        
        /* Hamburger animations to X */
        .hamburger {
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          outline: none;
        }
        .hamburger line {
          transition: transform 0.3s ease, opacity 0.3s ease;
          transform-origin: center;
        }
        .hamburger.open .line-top {
          transform: translateY(6px) rotate(45deg);
        }
        .hamburger.open .line-middle {
          opacity: 0;
        }
        .hamburger.open .line-bottom {
          transform: translateY(-6px) rotate(-45deg);
        }
        
        .logout-btn-dropdown:hover {
          background-color: #fee2e2 !important;
          color: #b91c1c !important;
        }
        
        /* Responsive display classes */
        @media (min-width: 768px) {
          .desktop-only { display: flex !important; }
          .mobile-only { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-only { display: none !important; }
          .mobile-only { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
