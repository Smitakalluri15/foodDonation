import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Helper component for standard hoverable footer links
const HoverLink = ({ to, href, children, style = {} }) => {
  const [isHovered, setIsHovered] = useState(false);

  const baseStyle = {
    color: isHovered ? '#FFD400' : 'rgba(255, 255, 255, 0.6)',
    fontSize: '14px',
    fontWeight: 500,
    textDecoration: 'none',
    display: 'block',
    marginBottom: '11px',
    transition: 'color 0.15s ease',
    ...style
  };

  if (href) {
    return (
      <a
        href={href}
        style={baseStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      to={to}
      style={baseStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </Link>
  );
};

// Helper component for bottom bar hoverable links
const BottomLink = ({ to, children }) => {
  const [isHovered, setIsHovered] = useState(false);
  const linkStyle = {
    color: isHovered ? '#FFD400' : 'rgba(255, 255, 255, 0.3)',
    fontSize: '13px',
    textDecoration: 'none',
    transition: 'color 0.15s ease',
  };

  return (
    <Link
      to={to}
      style={linkStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </Link>
  );
};

// Helper component for social media square icons
const SocialIcon = ({ href, children }) => {
  const [isHovered, setIsHovered] = useState(false);
  const iconStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: isHovered ? 'rgba(255, 212, 0, 0.15)' : 'rgba(255, 255, 255, 0.06)',
    border: isHovered ? '1px solid rgba(255, 212, 0, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: isHovered ? '#FFD400' : 'rgba(255, 255, 255, 0.5)',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={iconStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </a>
  );
};

// Helper component for app store placeholder buttons
const StoreButton = ({ icon, label }) => {
  const [isHovered, setIsHovered] = useState(false);
  const buttonStyle = {
    backgroundColor: isHovered ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.06)',
    border: isHovered ? '1px solid rgba(255, 212, 0, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    padding: '10px 16px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: isHovered ? '#FFFFFF' : 'rgba(255, 255, 255, 0.65)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  };

  return (
    <div
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
};

// Helper component for newsletter input border color toggle on focus
const NewsletterInput = () => {
  const [isFocused, setIsFocused] = useState(false);
  const inputStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    border: isFocused ? '1px solid #FFD400' : '1px solid rgba(255, 212, 0, 0.2)',
    borderRadius: '8px',
    color: '#FFFFFF',
    padding: '10px 14px',
    flex: 1,
    fontSize: '13px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    width: '100%',
  };

  return (
    <input
      type="email"
      placeholder="your@email.com"
      style={inputStyle}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  );
};

// Helper component for newsletter submit button hover
const SubmitButton = ({ children }) => {
  const [isHovered, setIsHovered] = useState(false);
  const btnStyle = {
    backgroundColor: isHovered ? '#FFE566' : '#FFD400',
    color: '#2C1A00',
    border: 'none',
    borderRadius: '8px',
    padding: '10px 14px',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
  };

  return (
    <button
      type="submit"
      style={btnStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
};

const Footer = () => {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive column division grid template
  let gridTemplateColumns = '280px 1fr 1fr 1fr';
  if (width <= 991 && width > 575) {
    gridTemplateColumns = '1fr 1fr';
  } else if (width <= 575) {
    gridTemplateColumns = '1fr';
  }

  // Styles Object
  const styles = {
    footer: {
      backgroundColor: '#1A0F00',
      /* Subtle repeating single roti outline texture */
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='8' cy='8' r='6' fill='none' stroke='rgba(255,212,0,0.05)' stroke-width='1'/%3E%3C/svg%3E")`,
      padding: '72px 0 32px',
      fontFamily: "'Nunito', sans-serif",
      position: 'relative',
      overflow: 'hidden',
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 24px',
      position: 'relative',
      zIndex: 5,
    },
    mainGrid: {
      display: 'grid',
      gridTemplateColumns,
      gap: '48px',
    },
    column: {
      display: 'flex',
      flexDirection: 'column',
    },
    brandTitle: {
      fontSize: '26px',
      fontWeight: 800,
      color: '#FFFFFF',
      letterSpacing: '-0.5px',
      marginLeft: '10px',
    },
    brandTagline: {
      fontSize: '14px',
      color: 'rgba(255, 255, 255, 0.5)',
      marginTop: '12px',
      lineHeight: '1.7',
      maxWidth: '220px',
    },
    brandImpactBadge: {
      display: 'inline-block',
      backgroundColor: 'rgba(255, 212, 0, 0.12)',
      border: '1px solid rgba(255, 212, 0, 0.2)',
      color: '#FFD400',
      borderRadius: '50px',
      fontSize: '13px',
      fontWeight: 700,
      padding: '6px 16px',
      marginTop: '20px',
      alignSelf: 'flex-start',
    },
    socialRow: {
      display: 'flex',
      gap: '10px',
      marginTop: '20px',
    },
    heading: {
      fontSize: '11px',
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      color: 'rgba(255, 255, 255, 0.35)',
      marginBottom: '18px',
      fontWeight: 800,
    },
    appStoresRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginBottom: '20px',
    },
    appLabel: {
      fontSize: '13px',
      color: 'rgba(255, 255, 255, 0.45)',
      marginBottom: '16px',
      display: 'block',
    },
    newsletterLabel: {
      fontSize: '12px',
      color: 'rgba(255, 255, 255, 0.4)',
      marginBottom: '8px',
      display: 'block',
    },
    newsletterForm: {
      display: 'flex',
      gap: '8px',
      width: '100%',
    },
    bottomBar: {
      marginTop: '52px',
      paddingTop: '24px',
      borderTop: '1px solid rgba(255, 212, 0, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '10px',
    },
    bottomLeftText: {
      fontSize: '13px',
      color: 'rgba(255, 255, 255, 0.3)',
    },
    bottomRightLinks: {
      display: 'flex',
      gap: '16px',
    }
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        
        {/* Main Columns Grid */}
        <div style={styles.mainGrid}>
          
          {/* COLUMN 1: Brand */}
          <div style={styles.column}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {/* Logo Badge circle and inline SVG */}
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: '#FFD400',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2C1A00" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M9 7v5M9 7c-1 0-1 2 0 2M9 7c1 0 1 2 0 2M15 7v10M13 7h4" />
                </svg>
              </div>
              <span style={styles.brandTitle}>Plateful</span>
            </div>
            <p style={styles.brandTagline}>
              Share food. Reduce waste. Feed hope.
            </p>
            <div style={styles.brandImpactBadge}>
              💛 12,400+ meals saved
            </div>
            {/* Social Squares */}
            <div style={styles.socialRow}>
              <SocialIcon href="https://twitter.com/plateful">
                {/* Twitter / X Icon SVG */}
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </SocialIcon>
              <SocialIcon href="https://instagram.com/plateful">
                {/* Instagram Icon SVG */}
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </SocialIcon>
              <SocialIcon href="https://linkedin.com/company/plateful">
                {/* LinkedIn Icon SVG */}
                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </SocialIcon>
            </div>
          </div>

          {/* COLUMN 2: Platform */}
          <div style={styles.column}>
            <h3 style={styles.heading}>Platform</h3>
            <HoverLink to="/">How it works</HoverLink>
            <HoverLink to="/register?role=DONOR">Donate food</HoverLink>
            <HoverLink to="/available-food">Find food</HoverLink>
            <HoverLink to="/leaderboard">Leaderboard</HoverLink>
            <HoverLink to="/ngo-dashboard">NGO Dashboard</HoverLink>
            <HoverLink to="/volunteer-dashboard">Volunteer Hub</HoverLink>
          </div>

          {/* COLUMN 3: Organisation */}
          <div style={styles.column}>
            <h3 style={styles.heading}>Organisation</h3>
            <HoverLink to="/about">About us</HoverLink>
            <HoverLink to="/mission">Our mission</HoverLink>
            <HoverLink to="/partners">Partner NGOs</HoverLink>
            <HoverLink to="/press">Press</HoverLink>
            <HoverLink to="/careers">Careers</HoverLink>
            <HoverLink to="/contact">Contact</HoverLink>
            <HoverLink to="/privacy">Privacy</HoverLink>
            <HoverLink to="/terms">Terms</HoverLink>
          </div>

          {/* COLUMN 4: Get Plateful */}
          <div style={styles.column}>
            <h3 style={styles.heading}>Get Plateful</h3>
            <span style={styles.appLabel}>Mobile app coming soon 📱</span>
            
            {/* Store Buttons placeholder */}
            <div style={styles.appStoresRow}>
              <StoreButton
                icon={
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.18.66-2.9 1.48-.65.73-1.22 1.87-1.07 2.99 1.09.08 2.21-.56 2.98-1.41z"/>
                  </svg>
                }
                label="App Store"
              />
              <StoreButton
                icon={
                  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 5.27v13.46c0 .82.68 1.45 1.5 1.45.28 0 .54-.08.77-.24L17.7 12 5.27 4.03c-.23-.16-.49-.24-.77-.24-.82 0-1.5.63-1.5 1.48zM19.78 10.66l-3.32-2.14L13.9 12l2.56 3.48 3.32-2.14c.73-.47.73-1.21 0-1.68z"/>
                  </svg>
                }
                label="Play Store"
              />
            </div>

            {/* Newsletter Subscription */}
            <div style={{ marginTop: '20px' }}>
              <span style={styles.newsletterLabel}>Stay updated:</span>
              <form onSubmit={(e) => e.preventDefault()} style={styles.newsletterForm}>
                <NewsletterInput />
                <SubmitButton>→</SubmitButton>
              </form>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div style={styles.bottomBar}>
          <div style={styles.bottomLeftText}>
            © 2025 Plateful · Made with 💛 in Hyderabad, India
          </div>
          <div style={styles.bottomRightLinks}>
            <BottomLink to="/privacy">Privacy</BottomLink>
            <span style={{ color: 'rgba(255, 255, 255, 0.15)', fontSize: '13px' }}>·</span>
            <BottomLink to="/terms">Terms</BottomLink>
            <span style={{ color: 'rgba(255, 255, 255, 0.15)', fontSize: '13px' }}>·</span>
            <BottomLink to="/cookies">Cookies</BottomLink>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
