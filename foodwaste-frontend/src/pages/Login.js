import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { getErrorMessage } from '../utils/helpers';

// Helper custom input field component to track focus border colors natively via style props
const LoginInput = ({ name, type, placeholder, value, onChange, label }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px',
    width: '100%',
    textAlign: 'left',
  };

  const labelStyle = {
    fontSize: '13px',
    fontWeight: 700,
    color: '#2C1A00',
    marginBottom: '8px',
  };

  const inputWrapperStyle = {
    position: 'relative',
    width: '100%',
  };

  const inputStyle = {
    borderRadius: '12px',
    border: isFocused ? '1.5px solid #FFD400' : '1.5px solid #FFEE99',
    padding: '12px 16px',
    paddingRight: type === 'password' ? '44px' : '16px',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s ease',
    backgroundColor: '#FFFAE5',
    color: '#2C1A00',
    fontFamily: "'Nunito', sans-serif",
    width: '100%',
  };

  const toggleBtnStyle = {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#7a6200',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '4px',
  };

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div style={containerStyle}>
      <label style={labelStyle}>{label}</label>
      <div style={inputWrapperStyle}>
        <input
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required
          style={inputStyle}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={toggleBtnStyle}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1000);

  // States to track hover and selections
  const [btnHover, setBtnHover] = useState(false);
  const [hoveredDemo, setHoveredDemo] = useState(null);
  const [registerLinkHover, setRegisterLinkHover] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [forgotHover, setForgotHover] = useState(false);
  const [backHover, setBackHover] = useState(false);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authService.login(form.email, form.password);
      login(data, data.token);
      const redirects = { DONOR: '/donor', NGO: '/ngo', VOLUNTEER: '/volunteer' };
      navigate(redirects[data.role] || '/');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const isDesktop = width > 768;

  // Floating SVGs for left column branding panel
  const leftFloatingDoodles = [
    {
      style: { top: '10%', left: '8%', transform: 'rotate(15deg)' },
      svg: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 11c0 4.42 3.58 8 8 8s8-3.58 8-8H4z" fill="#FFD400" stroke="#FFD400" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 11c1-2 2-3 6-3s5 1 6 3" stroke="#FFD400" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      style: { top: '15%', right: '10%', transform: 'rotate(-20deg)' },
      svg: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="10" width="14" height="9" rx="2" fill="#FFD400" stroke="#FFD400" strokeWidth="1.2"/>
          <path d="M3 13h2M19 13h2M5 10c0-2 2-3 7-3s7 1 7 3" stroke="#FFD400" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      style: { bottom: '25%', left: '6%', transform: 'rotate(25deg)' },
      svg: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2l2 4 4-2-2 4 4 2-4 2 2 4-4-2-2 4-2-4-4 2 2-4-4-2 4-2-2-4 4 2z" fill="#FFD400" stroke="#FFD400" strokeWidth="1.2" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      style: { bottom: '18%', right: '12%', transform: 'rotate(-15deg)' },
      svg: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="8" fill="#FFD400" stroke="#FFD400" strokeWidth="1.2"/>
          <path d="M12 4v16M4 12h16M7 7l10 10M17 7L7 17" stroke="#FFD400" strokeWidth="1.2"/>
        </svg>
      )
    }
  ];

  // Inline Styles
  const styles = {
    container: {
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#FFFAE5',
      fontFamily: "'Nunito', sans-serif",
    },
    // Left Branding Side (Desktop only)
    leftPanel: {
      width: '42%',
      backgroundColor: '#2C1A00',
      backgroundImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255, 212, 0, 0.08) 0%, transparent 70%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '4.5rem 4rem',
      position: 'relative',
      overflow: 'hidden',
    },
    logoRowLink: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '36px',
      textDecoration: 'none',
      width: 'fit-content',
      cursor: 'pointer',
    },
    logoCircle: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#FFD400',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoText: {
      fontSize: '24px',
      fontWeight: 800,
      color: '#FFFFFF',
      letterSpacing: '-0.5px',
    },
    leftHeadline: {
      fontSize: '36px',
      fontWeight: 800,
      color: '#FFFFFF',
      lineHeight: '1.25',
      marginBottom: '16px',
    },
    leftSubtext: {
      fontSize: '15px',
      color: 'rgba(255, 255, 255, 0.65)',
      lineHeight: '1.75',
      marginBottom: '48px',
      maxWidth: '360px',
    },
    statsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginTop: 'auto',
      borderTop: '1px solid rgba(255, 212, 0, 0.1)',
      paddingTop: '24px',
    },
    statRow: {
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.8)',
      fontWeight: 600,
    },
    // Right Form Side
    rightPanel: {
      width: isDesktop ? '58%' : '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1.5rem',
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%237a6200' fill-opacity='0.03' fill-rule='evenodd'%3E%3Cpath d='M15 15c0 5 4 9 9 9s9-4 9-9H15zm35 45c0 6 5 11 11 11s11-5 11-11H50zm45-25h10v5H95v-5zm0 2.5h8v2.5h-8v-2.5zm-50-5c0-4 3-7 7-7s7 3 7 7-3 7-7 7-7-3-7-7z'/%3E%3Ccircle cx='20' cy='80' r='3'/%3E%3Ccircle cx='80' cy='20' r='3'/%3E%3Ccircle cx='100' cy='95' r='4'/%3E%3Ccircle cx='60' cy='45' r='2'/%3E%3Cpath d='M10 110h15v3H10v-3zm0 1.5h12v1.5H10v-1.5zm80-70c0 5 4 9 9 9s9-4 9-9H90z'/%3E%3C/g%3E%3C/svg%3E")`,
    },
    backContainer: {
      width: '100%',
      maxWidth: '420px',
      textAlign: 'left',
      marginBottom: '12px',
    },
    backLink: {
      display: 'inline-flex',
      alignItems: 'center',
      fontSize: '14px',
      fontWeight: 700,
      color: backHover ? '#2C1A00' : '#7a6200',
      textDecoration: 'none',
      cursor: 'pointer',
      transition: 'color 0.2s ease',
    },
    card: {
      backgroundColor: '#FFFFFF',
      borderRadius: '24px',
      padding: isDesktop ? '40px' : '32px 24px',
      width: '100%',
      maxWidth: '420px',
      boxShadow: '0 8px 32px rgba(255, 212, 0, 0.12)',
      border: '1.5px solid #FFEE99',
      textAlign: 'center',
    },
    title: {
      fontSize: '28px',
      fontWeight: 800,
      color: '#2C1A00',
      marginBottom: '6px',
    },
    sub: {
      fontSize: '14px',
      color: '#7a6200',
      marginBottom: '28px',
    },
    submitBtn: {
      width: '100%',
      padding: '14px',
      fontSize: '15px',
      fontWeight: 700,
      backgroundColor: btnHover ? '#FFE566' : '#FFD400',
      color: '#2C1A00',
      borderRadius: '50px',
      border: 'none',
      boxShadow: '0 4px 16px rgba(255, 212, 0, 0.35)',
      cursor: loading ? 'not-allowed' : 'pointer',
      transition: 'all 0.25s ease',
      marginTop: '8px',
      fontFamily: "'Nunito', sans-serif",
    },
    errorAlert: {
      backgroundColor: '#FFE5E5',
      border: '1.5px solid #FF9999',
      borderRadius: '12px',
      color: '#D8000C',
      padding: '12px 16px',
      fontSize: '14px',
      fontWeight: 600,
      marginBottom: '20px',
      textAlign: 'left',
    },
    // Remember me & forgot password row
    rememberForgotRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
      width: '100%',
    },
    checkboxLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '13px',
      fontWeight: 600,
      color: '#7a6200',
      cursor: 'pointer',
      userSelect: 'none',
    },
    checkboxInput: {
      accentColor: '#FFD400',
      cursor: 'pointer',
      width: '16px',
      height: '16px',
    },
    forgotLink: {
      fontSize: '13px',
      fontWeight: 700,
      color: '#2C1A00',
      cursor: 'pointer',
      textDecoration: forgotHover ? 'underline' : 'none',
      transition: 'all 0.2s ease',
    },
    // Mobile branding elements
    mobileLogoRow: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '16px',
      textDecoration: 'none',
    },
    mobileLogoCircle: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      backgroundColor: '#FFD400',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    mobileLogoText: {
      fontSize: '20px',
      fontWeight: 800,
      color: '#2C1A00',
      letterSpacing: '-0.5px',
    },
    // Quick Demo Logins
    demoBox: {
      marginTop: '28px',
      padding: '16px',
      backgroundColor: '#FFF6CC',
      borderRadius: '16px',
      border: '1.5px solid #FFEE99',
      textAlign: 'left',
    },
    demoLabel: {
      fontSize: '12px',
      fontWeight: 800,
      color: '#7a6200',
      marginBottom: '10px',
      display: 'block',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
    },
    demoBtnsRow: {
      display: 'flex',
      gap: '8px',
    },
    demoBtn: (role, hoverRole) => {
      const colors = {
        DONOR: { bg: '#FFD400', hoverBg: '#FFE566', color: '#2C1A00' },
        NGO: { bg: '#FF9A3C', hoverBg: '#FFAE63', color: '#FFFFFF' },
        VOLUNTEER: { bg: '#4CAF7D', hoverBg: '#60C58F', color: '#FFFFFF' }
      };
      const isHovered = hoverRole === role;
      return {
        flex: 1,
        padding: '10px 8px',
        fontSize: '11px',
        fontWeight: 700,
        backgroundColor: isHovered ? colors[role].hoverBg : colors[role].bg,
        color: colors[role].color,
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        boxShadow: '0 2px 6px rgba(44, 26, 0, 0.08)',
        transition: 'all 0.2s ease',
        textAlign: 'center',
        fontFamily: "'Nunito', sans-serif",
      };
    },
    switchRow: {
      fontSize: '14px',
      color: '#7a6200',
      marginTop: '24px',
    },
    switchLink: {
      color: '#2C1A00',
      fontWeight: 700,
      textDecoration: registerLinkHover ? 'underline' : 'none',
      borderBottom: registerLinkHover ? 'none' : '1px dotted #FFD400',
      transition: 'all 0.2s ease',
    }
  };

  return (
    <div style={styles.container}>
      {/* Left Column Brand Panel (Visible on Desktop) */}
      {isDesktop && (
        <div style={styles.leftPanel}>
          {/* Subtle floating SVGs */}
          {leftFloatingDoodles.map((doodle, idx) => (
            <div
              key={idx}
              style={{
                position: 'absolute',
                opacity: 0.06,
                zIndex: 1,
                pointerEvents: 'none',
                ...doodle.style
              }}
            >
              {doodle.svg}
            </div>
          ))}

          {/* Clickable Logo Row */}
          <Link to="/" style={styles.logoRowLink}>
            <div style={styles.logoCircle}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2C1A00" strokeWidth="1.8">
                <circle cx="12" cy="12" r="9" />
                <path d="M9 7v5M9 7c-1 0-1 2 0 2M9 7c1 0 1 2 0 2M15 7v10M13 7h4" />
              </svg>
            </div>
            <span style={styles.logoText}>Plateful</span>
          </Link>

          {/* Hero text */}
          <h1 style={styles.leftHeadline}>Feed hope.<br />Redefine surplus.</h1>
          <p style={styles.leftSubtext}>
            Join our ecosystem of food heroes reducing food waste and feeding families across India.
          </p>

          {/* Stats Bar */}
          <div style={styles.statsContainer}>
            <div style={styles.statRow}>🍱 12,400+ meals saved</div>
            <div style={styles.statRow}>🏢 340+ NGO partners</div>
            <div style={styles.statRow}>🚴 2,800+ active volunteer riders</div>
          </div>
        </div>
      )}

      {/* Right Column Form Panel */}
      <div style={styles.rightPanel}>
        {/* Back to Home Link */}
        <div style={styles.backContainer}>
          <Link
            to="/"
            style={styles.backLink}
            onMouseEnter={() => setBackHover(true)}
            onMouseLeave={() => setBackHover(false)}
          >
            ← Back to Home
          </Link>
        </div>
        <div style={styles.card}>
          {/* Mobile brand logo */}
          {!isDesktop && (
            <Link to="/" style={styles.mobileLogoRow}>
              <div style={styles.mobileLogoCircle}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2C1A00" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M9 7v5M9 7c-1 0-1 2 0 2M9 7c1 0 1 2 0 2M15 7v10M13 7h4" />
                </svg>
              </div>
              <span style={styles.mobileLogoText}>Plateful</span>
            </Link>
          )}

          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.sub}>Sign in to continue making a difference.</p>

          {/* Error Alert Box */}
          {error && <div style={styles.errorAlert}>⚠️ {error}</div>}

          {/* Form */}
          <form onSubmit={submit}>
            <LoginInput
              name="email"
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              value={form.email}
              onChange={handle}
            />
            <LoginInput
              name="password"
              type="password"
              label="Password"
              placeholder="••••••••"
              value={form.password}
              onChange={handle}
            />

            {/* Remember Me & Forgot Password Row */}
            <div style={styles.rememberForgotRow}>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={styles.checkboxInput}
                />
                Remember me
              </label>
              <span
                style={styles.forgotLink}
                onClick={() => alert('A password reset link will be sent to your email (feature coming soon!).')}
                onMouseEnter={() => setForgotHover(true)}
                onMouseLeave={() => setForgotHover(false)}
              >
                Forgot password?
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={styles.submitBtn}
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Logins Box */}
          <div style={styles.demoBox}>
            <span style={styles.demoLabel}>Quick demo login:</span>
            <div style={styles.demoBtnsRow}>
              {[
                { role: 'DONOR', email: 'donor@demo.com' },
                { role: 'NGO', email: 'ngo@demo.com' },
                { role: 'VOLUNTEER', email: 'volunteer@demo.com' },
              ].map((d) => (
                <button
                  key={d.role}
                  type="button"
                  style={styles.demoBtn(d.role, hoveredDemo)}
                  onMouseEnter={() => setHoveredDemo(d.role)}
                  onMouseLeave={() => setHoveredDemo(null)}
                  onClick={() => setForm({ email: d.email, password: 'demo1234' })}
                >
                  {d.role}
                </button>
              ))}
            </div>
          </div>

          {/* Switch link to Register */}
          <div style={styles.switchRow}>
            Don't have an account?{' '}
            <Link
              to="/register"
              style={styles.switchLink}
              onMouseEnter={() => setRegisterLinkHover(true)}
              onMouseLeave={() => setRegisterLinkHover(false)}
            >
              Register here
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
