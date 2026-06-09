import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { getErrorMessage } from '../utils/helpers';

// Helper custom input field component to track focus border colors natively via style props
const RegisterInput = ({ name, type, placeholder, value, onChange, label, required = true }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '16px',
    width: '100%',
    textAlign: 'left',
  };

  const labelStyle = {
    fontSize: '13px',
    fontWeight: 700,
    color: '#2C1A00',
    marginBottom: '6px',
  };

  const inputWrapperStyle = {
    position: 'relative',
    width: '100%',
  };

  const inputStyle = {
    borderRadius: '12px',
    border: isFocused ? '1.5px solid #FFD400' : '1.5px solid #FFEE99',
    padding: '10px 14px',
    paddingRight: type === 'password' ? '40px' : '14px',
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
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#7a6200',
    fontSize: '15px',
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
          required={required}
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', address: '', city: '', role: 'DONOR',
    orgName: '', registrationNumber: '', aadhaarNumber: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1000);

  // States to track hover and selections
  const [btnHover, setBtnHover] = useState(false);
  const [switchHover, setSwitchHover] = useState(false);
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
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    // Aadhaar Validation for Donor
    if (form.role === 'DONOR') {
      if (!form.aadhaarNumber) {
        return setError('Aadhaar Card Number is required for Donors');
      }
      const cleanAadhaar = form.aadhaarNumber.replace(/\s+/g, '');
      if (!/^\d{12}$/.test(cleanAadhaar)) {
        return setError('Aadhaar Card Number must be exactly 12 digits');
      }
    }
    
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      
      // Clean request payload by role
      if (form.role === 'DONOR') {
        payload.aadhaarNumber = form.aadhaarNumber.replace(/\s+/g, '');
        delete payload.orgName;
        delete payload.registrationNumber;
      } else if (form.role === 'NGO') {
        delete payload.aadhaarNumber;
      } else {
        delete payload.aadhaarNumber;
        delete payload.orgName;
        delete payload.registrationNumber;
      }
      
      const data = await authService.register(payload);
      login(data, data.token);
      const redirects = { DONOR: '/donor', NGO: '/ngo', VOLUNTEER: '/volunteer' };
      navigate(redirects[data.role] || '/');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const isDesktop = width > 992; // Slightly wider breakpoint for the longer register page
  const isNgo = form.role === 'NGO';

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
      width: '38%',
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
      width: isDesktop ? '62%' : '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1.5rem',
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%237a6200' fill-opacity='0.03' fill-rule='evenodd'%3E%3Cpath d='M15 15c0 5 4 9 9 9s9-4 9-9H15zm35 45c0 6 5 11 11 11s11-5 11-11H50zm45-25h10v5H95v-5zm0 2.5h8v2.5h-8v-2.5zm-50-5c0-4 3-7 7-7s7 3 7 7-3 7-7 7-7-3-7-7z'/%3E%3Ccircle cx='20' cy='80' r='3'/%3E%3Ccircle cx='80' cy='20' r='3'/%3E%3Ccircle cx='100' cy='95' r='4'/%3E%3Ccircle cx='60' cy='45' r='2'/%3E%3Cpath d='M10 110h15v3H10v-3zm0 1.5h12v1.5H10v-1.5zm80-70c0 5 4 9 9 9s9-4 9-9H90z'/%3E%3C/g%3E%3C/svg%3E")`,
      overflowY: 'auto',
    },
    backContainer: {
      width: '100%',
      maxWidth: '560px',
      textAlign: 'left',
      marginBottom: '12px',
      marginTop: '2rem',
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
      maxWidth: '560px',
      boxShadow: '0 8px 32px rgba(255, 212, 0, 0.12)',
      border: '1.5px solid #FFEE99',
      textAlign: 'center',
      margin: '0 0 2rem 0',
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
      marginBottom: '24px',
    },
    roleRow: {
      display: 'flex',
      gap: '8px',
      marginBottom: '20px',
    },
    roleBtn: (role, activeRole) => {
      const colors = {
        DONOR: { bg: '#FFD400', color: '#2C1A00' },
        NGO: { bg: '#FF9A3C', color: '#FFFFFF' },
        VOLUNTEER: { bg: '#4CAF7D', color: '#FFFFFF' }
      };
      const isActive = activeRole === role;
      return {
        flex: 1,
        padding: '12px 8px',
        fontSize: '13px',
        fontWeight: 700,
        backgroundColor: isActive ? colors[role].bg : '#FFFFFF',
        color: isActive ? colors[role].color : '#7a6200',
        border: isActive ? `1.5px solid ${colors[role].bg}` : '1.5px solid #FFEE99',
        borderRadius: '12px',
        cursor: 'pointer',
        boxShadow: isActive ? '0 4px 12px rgba(44, 26, 0, 0.1)' : 'none',
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '6px',
        fontFamily: "'Nunito', sans-serif",
      };
    },
    grid2: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap',
    },
    grid2Cell: {
      flex: '1 1 calc(50% - 6px)',
      minWidth: '200px',
    },
    ngoSection: {
      backgroundColor: '#FFF6CC',
      borderRadius: '16px',
      padding: '18px',
      marginBottom: '20px',
      border: '1.5px solid #FFEE99',
      textAlign: 'left',
    },
    ngoLabel: {
      fontSize: '12px',
      fontWeight: 800,
      color: '#7a6200',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      marginBottom: '14px',
      display: 'block',
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
      marginTop: '12px',
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
    switchRow: {
      fontSize: '14px',
      color: '#7a6200',
      marginTop: '24px',
    },
    switchLink: {
      color: '#2C1A00',
      fontWeight: 700,
      textDecoration: switchHover ? 'underline' : 'none',
      borderBottom: switchHover ? 'none' : '1px dotted #FFD400',
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
          <h1 style={styles.leftHeadline}>Join the movement.<br />Share the abundance.</h1>
          <p style={styles.leftSubtext}>
            Create a free account in 30 seconds to start donating food, requesting surplus meals, or helping transport food.
          </p>

          {/* Stats Bar */}
          <div style={styles.statsContainer}>
            <div style={styles.statRow}>🍽️ Connect with verified local NGOs</div>
            <div style={styles.statRow}>🌱 Reduce waste, support communities</div>
            <div style={styles.statRow}>🏆 Earn badges & climb the leaderboard</div>
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

          <h2 style={styles.title}>Create your account</h2>
          <p style={styles.sub}>Join our community of food heroes today.</p>

          {/* Error Alert Box */}
          {error && <div style={styles.errorAlert}>⚠️ {error}</div>}

          {/* Form */}
          <form onSubmit={submit}>
            {/* Role selector */}
            <div style={styles.roleRow}>
              {['DONOR', 'NGO', 'VOLUNTEER'].map((r) => (
                <button
                  type="button"
                  key={r}
                  style={styles.roleBtn(r, form.role)}
                  onClick={() => setForm({ ...form, role: r })}
                >
                  {r === 'DONOR' ? '🍱' : r === 'NGO' ? '🏢' : '🚴'} {r.charAt(0) + r.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            {/* Grid for Name and Phone */}
            <div style={styles.grid2}>
              <div style={styles.grid2Cell}>
                <RegisterInput
                  name="name"
                  type="text"
                  label="Full Name *"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handle}
                />
              </div>
              <div style={styles.grid2Cell}>
                <RegisterInput
                  name="phone"
                  type="text"
                  label="Phone Number"
                  placeholder="+91 9999999999"
                  value={form.phone}
                  onChange={handle}
                  required={false}
                />
              </div>
            </div>

            {/* Email field */}
            <RegisterInput
              name="email"
              type="email"
              label="Email Address *"
              placeholder="you@example.com"
              value={form.email}
              onChange={handle}
            />

            {/* Grid for Password and Confirm Password */}
            <div style={styles.grid2}>
              <div style={styles.grid2Cell}>
                <RegisterInput
                  name="password"
                  type="password"
                  label="Password *"
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={handle}
                />
              </div>
              <div style={styles.grid2Cell}>
                <RegisterInput
                  name="confirmPassword"
                  type="password"
                  label="Confirm Password *"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handle}
                />
              </div>
            </div>

            {/* Grid for City and Address */}
            <div style={styles.grid2}>
              <div style={styles.grid2Cell}>
                <RegisterInput
                  name="city"
                  type="text"
                  label="City"
                  placeholder="e.g. Hyderabad"
                  value={form.city}
                  onChange={handle}
                  required={false}
                />
              </div>
              <div style={styles.grid2Cell}>
                <RegisterInput
                  name="address"
                  type="text"
                  label="Street Address"
                  placeholder="e.g. Jubilee Hills"
                  value={form.address}
                  onChange={handle}
                  required={false}
                />
              </div>
            </div>

            {/* Donor-only fields */}
            {form.role === 'DONOR' && (
              <div style={styles.ngoSection}>
                <span style={styles.ngoLabel}>Donor Verification Details</span>
                <RegisterInput
                  name="aadhaarNumber"
                  type="text"
                  label="Aadhaar Card Number *"
                  placeholder="12-digit Aadhaar Number (e.g. 1234 5678 9012)"
                  value={form.aadhaarNumber}
                  onChange={handle}
                  required={true}
                />
              </div>
            )}

            {/* NGO-only fields */}
            {isNgo && (
              <div style={styles.ngoSection}>
                <span style={styles.ngoLabel}>NGO Registration Details</span>
                <RegisterInput
                  name="orgName"
                  type="text"
                  label="Organisation Name *"
                  placeholder="Helping Hands Foundation"
                  value={form.orgName}
                  onChange={handle}
                  required={isNgo}
                />
                <RegisterInput
                  name="registrationNumber"
                  type="text"
                  label="Registration Number"
                  placeholder="NGO/REG/12345"
                  value={form.registrationNumber}
                  onChange={handle}
                  required={false}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={styles.submitBtn}
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          {/* Switch link to Login */}
          <div style={styles.switchRow}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={styles.switchLink}
              onMouseEnter={() => setSwitchHover(true)}
              onMouseLeave={() => setSwitchHover(false)}
            >
              Sign in
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
