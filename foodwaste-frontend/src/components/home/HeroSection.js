import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  // SVGs for the 12 scattered food icons
  const foodIcons = [
    // 1. Rice bowl
    {
      style: { top: '10%', left: '6%', transform: 'rotate(15deg)', animationDuration: '7s' },
      svg: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 11c0 4.42 3.58 8 8 8s8-3.58 8-8H4z" fill="#FFE566" stroke="#2C1A00" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 11c1-2 2-3 6-3s5 1 6 3" stroke="#2C1A00" strokeWidth="1.2" strokeLinecap="round"/>
          <circle cx="9" cy="9" r="0.5" fill="#2C1A00"/><circle cx="12" cy="8.5" r="0.5" fill="#2C1A00"/><circle cx="15" cy="9" r="0.5" fill="#2C1A00"/>
        </svg>
      )
    },
    // 2. Biryani pot
    {
      style: { top: '14%', right: '8%', transform: 'rotate(-20deg)', animationDuration: '9s' },
      svg: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="10" width="14" height="9" rx="2" fill="#D4845A" stroke="#2C1A00" strokeWidth="1.2"/>
          <path d="M3 13h2M19 13h2M5 10c0-2 2-3 7-3s7 1 7 3" stroke="#2C1A00" strokeWidth="1.2" strokeLinecap="round"/>
          <circle cx="12" cy="5" r="1.5" fill="#FFE566" stroke="#2C1A00" strokeWidth="1.2"/>
        </svg>
      )
    },
    // 3. Curry bowl
    {
      style: { top: '48%', left: '4%', transform: 'rotate(25deg)', animationDuration: '11s' },
      svg: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="12" cy="13" rx="8" ry="4" fill="#D4845A" stroke="#2C1A00" strokeWidth="1.2"/>
          <path d="M3 11a2 2 0 1 1 2-2M19 11a2 2 0 1 0 2-2" stroke="#2C1A00" strokeWidth="1.2"/>
          <circle cx="9" cy="13" r="1" fill="#FFE566"/><circle cx="13" cy="12" r="1.5" fill="#8B7355"/><circle cx="15" cy="14" r="1" fill="#FFE566"/>
        </svg>
      )
    },
    // 4. Flatbread/roti
    {
      style: { top: '38%', right: '6%', transform: 'rotate(-15deg)', animationDuration: '6s' },
      svg: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" fill="#FFE566" stroke="#2C1A00" strokeWidth="1.2"/>
          <circle cx="8" cy="10" r="1" fill="#8B7355"/><circle cx="15" cy="9" r="1.5" fill="#8B7355"/><circle cx="11" cy="15" r="1" fill="#8B7355"/><circle cx="14" cy="14" r="0.8" fill="#8B7355"/>
        </svg>
      )
    },
    // 5. Chai cup
    {
      style: { bottom: '15%', left: '8%', transform: 'rotate(30deg)', animationDuration: '8s' },
      svg: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 9h10v6a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V9z" fill="#8B7355" stroke="#2C1A00" strokeWidth="1.2"/>
          <path d="M16 11h2a2 2 0 0 1 0 4h-2" stroke="#2C1A00" strokeWidth="1.2"/>
          <path d="M9 5c0 1 1 2 1 3M13 5c0 1 1 2 1 3" stroke="#2C1A00" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      )
    },
    // 6. Herb sprig
    {
      style: { bottom: '8%', right: '12%', transform: 'rotate(-25deg)', animationDuration: '10s' },
      svg: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 20V4M12 8c2-2 4-2 4 0s-2 2-4 0M12 12c-2-2-4-2-4 0s2 2 4 0M12 15c2-1 3-1 3 1s-1 2-3-1" fill="#4CAF7D" stroke="#2C1A00" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    // 7. Anise star
    {
      style: { top: '24%', left: '20%', transform: 'rotate(12deg)', animationDuration: '8.5s' },
      svg: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2l2 4 4-2-2 4 4 2-4 2 2 4-4-2-2 4-2-4-4 2 2-4-4-2 4-2-2-4 4 2z" fill="#8B7355" stroke="#2C1A00" strokeWidth="1.2" strokeLinejoin="round"/>
        </svg>
      )
    },
    // 8. Wooden spoon
    {
      style: { top: '28%', right: '22%', transform: 'rotate(-18deg)', animationDuration: '6.5s' },
      svg: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="8" cy="8" rx="4" ry="2.5" transform="rotate(-45 8 8)" fill="#8B7355" stroke="#2C1A00" strokeWidth="1.2"/>
          <path d="M11 11l8 8" stroke="#2C1A00" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )
    },
    // 9. Jar
    {
      style: { bottom: '26%', left: '18%', transform: 'rotate(22deg)', animationDuration: '9.5s' },
      svg: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="8" width="12" height="12" rx="2" fill="#FFE566" stroke="#2C1A00" strokeWidth="1.2"/>
          <rect x="8" y="5" width="8" height="3" fill="#8B7355" stroke="#2C1A00" strokeWidth="1.2"/>
        </svg>
      )
    },
    // 10. Corn
    {
      style: { bottom: '28%', right: '18%', transform: 'rotate(-10deg)', animationDuration: '7.5s' },
      svg: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 17c2 2 6 2 8 0V9c0-3-2-5-4-5s-4 2-4 5v8z" fill="#FFE566" stroke="#2C1A00" strokeWidth="1.2"/>
          <path d="M12 4v14M8 8h8M8 12h8" stroke="#2C1A00" strokeWidth="1.2"/>
          <path d="M6 19c2 0 4-2 4-5 M18 19c-2 0-4-2-4-5" stroke="#4CAF7D" strokeWidth="1.2"/>
        </svg>
      )
    },
    // 11. Lemon half
    {
      style: { top: '8%', right: '42%', transform: 'rotate(28deg)', animationDuration: '10.5s' },
      svg: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="8" fill="#FFE566" stroke="#2C1A00" strokeWidth="1.2"/>
          <path d="M12 4v16M4 12h16M7 7l10 10M17 7L7 17" stroke="#2C1A00" strokeWidth="1.2"/>
        </svg>
      )
    },
    // 12. Chilli
    {
      style: { bottom: '6%', left: '42%', transform: 'rotate(-12deg)', animationDuration: '8s' },
      svg: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 5c-1 2-3 3-5 5s-4 4-5 8c0 1 1 2 2 2s3-1 5-4 4-4 5-7c1-2 1-3-2-4z" fill="#D4845A" stroke="#2C1A00" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17 5c.5-.5 1-1.5.5-2.5s-2 0-2.5.5" stroke="#4CAF7D" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      )
    }
  ];

  return (
    <section className="pf-hero-illustrative-section">
      {/* 12 Scattered Floating Food Icons */}
      {foodIcons.map((icon, index) => (
        <div
          key={index}
          className="pf-floating-icon"
          style={{
            position: 'absolute',
            opacity: 0.18,
            zIndex: 3,
            pointerEvents: 'none',
            ...icon.style
          }}
        >
          {icon.svg}
        </div>
      ))}

      {/* Main Content & Right-Side Character Illustration Split */}
      <div className="container pf-hero-split-container">
        {/* Left Side Content */}
        <div className="pf-hero-content-left">
          {/* Small Pill Badge */}
          <div className="pf-hero-badge-pill">
            🌱 Fighting food waste in India
          </div>

          {/* Headline */}
          <h1 className="pf-hero-headline-large">
            Share a plate. Change a life.
          </h1>

          {/* Subtext */}
          <p className="pf-hero-subheading-text">
            Plateful connects food donors with NGOs and volunteers across India. Good food finds good people.
          </p>

          {/* CTA Buttons */}
          <div className="pf-hero-button-row">
            <Link to="/register?role=DONOR" className="pf-btn-cta primary-cta-btn">
              Donate food 🍱
            </Link>
            <Link to="/available-food" className="pf-btn-cta secondary-cta-btn">
              Find food near me
            </Link>
          </div>

          {/* Trust Line */}
          <div className="pf-hero-trust-row">
            ✓ 12,400+ meals saved &nbsp;&middot;&nbsp; ✓ 340 NGO partners &nbsp;&middot;&nbsp; ✓ 100% free
          </div>
        </div>

        {/* Right Side Character Illustration (Desktop only) */}
        <div className="pf-hero-character-right desktop-only">
          <svg
            width="300"
            height="280"
            viewBox="0 0 300 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ filter: 'drop-shadow(0px 8px 16px rgba(44, 26, 0, 0.08))' }}
          >
            {/* Ground shadow */}
            <ellipse cx="150" cy="245" rx="100" ry="10" fill="rgba(44, 26, 0, 0.08)" />

            {/* Giver (Left) */}
            {/* Squatting legs/body */}
            <path d="M70 240c10-5 25-30 30-40s10-30 10-30" stroke="#2C1A00" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M80 180c-5 15-5 35 15 50s40 10 50 10" stroke="#2C1A00" strokeWidth="2.2" strokeLinecap="round" />
            
            {/* Giver Torso (Olive green) */}
            <path d="M75 140c-10 15-15 35-10 50c3 10 15 15 25 15c15 0 20-20 20-35c0-15-5-25-15-30" fill="#6B8E23" stroke="#2C1A00" strokeWidth="1.5" />
            
            {/* Head */}
            <circle cx="90" cy="100" r="16" fill="#FAD0C4" stroke="#2C1A00" strokeWidth="1.5" />
            {/* Hair */}
            <path d="M74 100c0-10 8-16 16-16s16 6 16 16v-2c0-8-6-12-16-12s-16 4-16 12z" fill="#2C1A00" />
            {/* Eye/Smile */}
            <circle cx="94" cy="98" r="1.5" fill="#2C1A00" />
            <path d="M92 106c2 1 4 1 5-1" stroke="#2C1A00" strokeWidth="1.2" strokeLinecap="round" />

            {/* Arm reaching out */}
            <path d="M95 145c15 5 35 15 50 15" stroke="#FAD0C4" strokeWidth="5.5" strokeLinecap="round" />
            <path d="M90 142c15 5 35 15 50 15" fill="none" stroke="#2C1A00" strokeWidth="1.5" strokeLinecap="round" />

            {/* Bag of food */}
            <path d="M140 155h30v35a5 5 0 0 1-5 5h-20a5 5 0 0 1-5-5v-35z" fill="#D2B48C" stroke="#2C1A00" strokeWidth="1.5" />
            <path d="M148 155c0-5 3-8 7-8s7 3 7 8" stroke="#2C1A00" strokeWidth="1.5" fill="none" />
            <path d="M146 165h18" stroke="#8B7355" strokeWidth="1.2" strokeDasharray="2 2" />

            {/* Receiver (Right) */}
            {/* Sitting Torso (Maroon) */}
            <path d="M210 170c-5-5-15-10-25-5c-12 6-15 25-10 40c4 12 15 20 28 15c12-5 15-20 15-35c0-10-3-12-8-15" fill="#A52A2A" stroke="#2C1A00" strokeWidth="1.5" />
            
            {/* Head */}
            <circle cx="215" cy="130" r="15" fill="#ECC3A4" stroke="#2C1A00" strokeWidth="1.5" />
            {/* Hair */}
            <path d="M200 130c0-10 8-15 15-15s15 5 15 15v-2c0-7-6-11-15-11s-15 4-15 11z" fill="#3D2B1F" />
            {/* Eye/Smile */}
            <circle cx="209" cy="128" r="1.5" fill="#2C1A00" />
            <path d="M208 136c2 1 4 1 5-1" stroke="#2C1A00" strokeWidth="1.2" strokeLinecap="round" />

            {/* Arm receiving */}
            <path d="M195 180c-15-5-25-10-35-10" stroke="#ECC3A4" strokeWidth="5.5" strokeLinecap="round" />
            <path d="M195 178c-15-5-25-10-35-10" fill="none" stroke="#2C1A00" strokeWidth="1.5" strokeLinecap="round" />

            {/* Sitting legs */}
            <path d="M210 215c10 5 25 15 35 10s10-15 5-20" fill="none" stroke="#2C1A00" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M185 220c-10 5-20 15-15 20s15-5 20-10" fill="none" stroke="#2C1A00" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* Animated Chevron Scroll indicator */}
      <div className="pf-hero-scroll-chevron">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#7a6200"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pf-chevron-bounce"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {/* Styled Embed Code */}
      <style>{`
        .pf-hero-illustrative-section {
          position: relative;
          min-height: 100vh;
          background-color: var(--y1);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 110px 24px 80px 24px;
          font-family: var(--font-family);
        }

        /* Floating Animation Keyframe */
        .pf-floating-icon {
          animation: pf-hero-float infinite ease-in-out;
        }

        @keyframes pf-hero-float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-12px) rotate(3deg);
          }
        }

        .pf-hero-split-container {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 48px;
          align-items: center;
          position: relative;
          z-index: 10;
        }

        .pf-hero-content-left {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        /* Small badge */
        .pf-hero-badge-pill {
          background-color: var(--y3);
          border: 1px solid var(--y4);
          color: var(--med);
          font-size: 14px;
          font-weight: 700;
          border-radius: 50px;
          padding: 6px 18px;
          display: inline-block;
        }

        /* Large H1 */
        .pf-hero-headline-large {
          font-size: 54px;
          font-weight: 800;
          color: var(--dark);
          line-height: 1.15;
          margin-top: 20px;
          max-width: 680px;
          letter-spacing: -0.5px;
        }

        /* Subtext */
        .pf-hero-subheading-text {
          font-size: 18px;
          color: var(--med);
          line-height: 1.7;
          max-width: 500px;
          margin-top: 16px;
        }

        /* Buttons Row */
        .pf-hero-button-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: 36px;
          width: 100%;
        }

        .pf-btn-cta {
          font-family: var(--font-family);
          font-size: 16px;
          font-weight: 700;
          padding: 16px 40px;
          border-radius: 50px;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .primary-cta-btn {
          background-color: var(--y10);
          color: var(--dark);
          border: none;
          box-shadow: 0 6px 20px rgba(255, 212, 0, 0.35);
        }

        .primary-cta-btn:hover {
          background-color: var(--y9);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(255, 212, 0, 0.45);
        }

        .secondary-cta-btn {
          background-color: var(--white);
          border: 2px solid var(--y8);
          color: var(--dark);
        }

        .secondary-cta-btn:hover {
          background-color: var(--y2);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(255, 221, 50, 0.12);
        }

        /* Trust info */
        .pf-hero-trust-row {
          font-size: 13px;
          font-weight: 700;
          color: var(--med);
          margin-top: 28px;
          letter-spacing: 0.02em;
        }

        /* Right Side characters */
        .pf-hero-character-right {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        /* Scroll arrow */
        .pf-hero-scroll-chevron {
          position: absolute;
          bottom: 24px;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10;
        }

        .pf-chevron-bounce {
          animation: pf-chevrons-bounce 2s infinite;
          opacity: 0.5;
        }

        @keyframes pf-chevrons-bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-8px);
          }
          60% {
            transform: translateY(-4px);
          }
        }

        /* Responsive rules */
        @media (max-width: 991px) {
          .pf-hero-split-container {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 40px;
          }
          .pf-hero-content-left {
            align-items: center;
            text-align: center;
          }
          .pf-hero-subheading-text {
            margin: 16px auto 0 auto;
          }
          .pf-hero-button-row {
            justify-content: center;
          }
        }

        @media (max-width: 767px) {
          .pf-hero-illustrative-section {
            padding: 90px 16px 60px 16px;
          }
          
          .pf-hero-headline-large {
            font-size: 32px;
            line-height: 1.25;
          }
          
          .pf-hero-button-row {
            flex-direction: column;
            gap: 12px;
            max-width: 300px;
            margin: 32px auto 0 auto;
          }

          .pf-btn-cta {
            width: 100%;
            padding: 14px 28px;
          }

          .desktop-only {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;
