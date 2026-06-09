import React from 'react';
import { Link } from 'react-router-dom';

const RoleCards = () => {
  // SVGs for the 12 scattered food icons (opacity 0.05, stroke/fill #FFD400 on dark bg)
  const foodIcons = [
    {
      style: { top: '8%', left: '4%', transform: 'rotate(15deg)', animationDuration: '7s' },
      svg: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 11c0 4.42 3.58 8 8 8s8-3.58 8-8H4z" fill="#FFD400" stroke="#FFD400" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M6 11c1-2 2-3 6-3s5 1 6 3" stroke="#FFD400" strokeWidth="1.2" strokeLinecap="round"/>
          <circle cx="9" cy="9" r="0.5" fill="#FFD400"/><circle cx="12" cy="8.5" r="0.5" fill="#FFD400"/><circle cx="15" cy="9" r="0.5" fill="#FFD400"/>
        </svg>
      )
    },
    {
      style: { top: '12%', right: '6%', transform: 'rotate(-20deg)', animationDuration: '9s' },
      svg: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="5" y="10" width="14" height="9" rx="2" fill="#FFD400" stroke="#FFD400" strokeWidth="1.2"/>
          <path d="M3 13h2M19 13h2M5 10c0-2 2-3 7-3s7 1 7 3" stroke="#FFD400" strokeWidth="1.2" strokeLinecap="round"/>
          <circle cx="12" cy="5" r="1.5" fill="#FFD400" stroke="#FFD400" strokeWidth="1.2"/>
        </svg>
      )
    },
    {
      style: { top: '48%', left: '3%', transform: 'rotate(25deg)', animationDuration: '11s' },
      svg: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="12" cy="13" rx="8" ry="4" fill="#FFD400" stroke="#FFD400" strokeWidth="1.2"/>
          <path d="M3 11a2 2 0 1 1 2-2M19 11a2 2 0 1 0 2-2" stroke="#FFD400" strokeWidth="1.2"/>
          <circle cx="9" cy="13" r="1" fill="#FFD400"/><circle cx="13" cy="12" r="1.5" fill="#FFD400"/><circle cx="15" cy="14" r="1" fill="#FFD400"/>
        </svg>
      )
    },
    {
      style: { top: '38%', right: '4%', transform: 'rotate(-15deg)', animationDuration: '6s' },
      svg: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" fill="#FFD400" stroke="#FFD400" strokeWidth="1.2"/>
          <circle cx="8" cy="10" r="1" fill="#FFD400"/><circle cx="15" cy="9" r="1.5" fill="#FFD400"/><circle cx="11" cy="15" r="1" fill="#FFD400"/><circle cx="14" cy="14" r="0.8" fill="#FFD400"/>
        </svg>
      )
    },
    {
      style: { bottom: '15%', left: '6%', transform: 'rotate(30deg)', animationDuration: '8s' },
      svg: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 9h10v6a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V9z" fill="#FFD400" stroke="#FFD400" strokeWidth="1.2"/>
          <path d="M16 11h2a2 2 0 0 1 0 4h-2" stroke="#FFD400" strokeWidth="1.2"/>
          <path d="M9 5c0 1 1 2 1 3M13 5c0 1 1 2 1 3" stroke="#FFD400" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      style: { bottom: '8%', right: '10%', transform: 'rotate(-25deg)', animationDuration: '10s' },
      svg: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 20V4M12 8c2-2 4-2 4 0s-2 2-4 0M12 12c-2-2-4-2-4 0s2 2 4 0M12 15c2-1 3-1 3 1s-1 2-3-1" fill="#FFD400" stroke="#FFD400" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      style: { top: '22%', left: '16%', transform: 'rotate(12deg)', animationDuration: '8.5s' },
      svg: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2l2 4 4-2-2 4 4 2-4 2 2 4-4-2-2 4-2-4-4 2 2-4-4-2 4-2-2-4 4 2z" fill="#FFD400" stroke="#FFD400" strokeWidth="1.2" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      style: { top: '26%', right: '18%', transform: 'rotate(-18deg)', animationDuration: '6.5s' },
      svg: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="8" cy="8" rx="4" ry="2.5" transform="rotate(-45 8 8)" fill="#FFD400" stroke="#FFD400" strokeWidth="1.2"/>
          <path d="M11 11l8 8" stroke="#FFD400" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      )
    },
    {
      style: { bottom: '26%', left: '14%', transform: 'rotate(22deg)', animationDuration: '9.5s' },
      svg: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="6" y="8" width="12" height="12" rx="2" fill="#FFD400" stroke="#FFD400" strokeWidth="1.2"/>
          <rect x="8" y="5" width="8" height="3" fill="#FFD400" stroke="#FFD400" strokeWidth="1.2"/>
        </svg>
      )
    },
    {
      style: { bottom: '28%', right: '16%', transform: 'rotate(-10deg)', animationDuration: '7.5s' },
      svg: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 17c2 2 6 2 8 0V9c0-3-2-5-4-5s-4 2-4 5v8z" fill="#FFD400" stroke="#FFD400" strokeWidth="1.2"/>
          <path d="M12 4v14M8 8h8M8 12h8" stroke="#FFD400" strokeWidth="1.2"/>
          <path d="M6 19c2 0 4-2 4-5 M18 19c-2 0-4-2-4-5" stroke="#FFD400" strokeWidth="1.2"/>
        </svg>
      )
    },
    {
      style: { top: '6%', right: '38%', transform: 'rotate(28deg)', animationDuration: '10.5s' },
      svg: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="8" fill="#FFD400" stroke="#FFD400" strokeWidth="1.2"/>
          <path d="M12 4v16M4 12h16M7 7l10 10M17 7L7 17" stroke="#FFD400" strokeWidth="1.2"/>
        </svg>
      )
    },
    {
      style: { bottom: '4%', left: '38%', transform: 'rotate(-12deg)', animationDuration: '8s' },
      svg: (
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 5c-1 2-3 3-5 5s-4 4-5 8c0 1 1 2 2 2s3-1 5-4 4-4 5-7c1-2 1-3-2-4z" fill="#FFD400" stroke="#FFD400" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17 5c.5-.5 1-1.5.5-2.5s-2 0-2.5.5" stroke="#FFD400" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      )
    }
  ];

  return (
    <section className="role-cards-section">
      {/* 12 subtle floating doodles */}
      {foodIcons.map((icon, index) => (
        <div
          key={index}
          className="pf-role-floating-icon"
          style={{
            position: 'absolute',
            opacity: 0.05,
            zIndex: 1,
            pointerEvents: 'none',
            ...icon.style
          }}
        >
          {icon.svg}
        </div>
      ))}

      <div className="container pf-role-container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <span className="pf-role-section-label">
            Who is Plateful for?
          </span>
          <h2 className="pf-role-headline">
            One platform. Three kinds of food heroes.
          </h2>
        </div>

        {/* 3 Cards Grid */}
        <div className="role-cards-grid">
          
          {/* CARD 1: Food Donor */}
          <div className="role-card card-donor">
            <div className="role-card-ribbon ribbon-donor" />
            
            {/* SVG Illustration */}
            <div className="role-card-icon-container">
              <svg width="60" height="60" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="32" cy="18" r="7" fill="#FAD0C4" stroke="#2C1A00" strokeWidth="1.75"/>
                <path d="M26 18c0-5 3-7 6-7s6 2 6 7v-1c0-4-3-6-6-6s-6 2-6 6z" fill="#2C1A00"/>
                <path d="M20 42c0-10 6-14 12-14s12 4 12 14v4H20v-4z" fill="#6B8E23" stroke="#2C1A00" strokeWidth="1.75"/>
                <path d="M20 34c-4 1-6 4-8 7M44 34c4 1 6 4 8 7" stroke="#2C1A00" strokeWidth="1.75" strokeLinecap="round"/>
                <path d="M12 41c1 2 2 3 4 3h16c2 0 3-1 4-3" stroke="#2C1A00" strokeWidth="1.75" strokeLinecap="round" fill="none"/>
                <rect x="23" y="32" width="18" height="12" rx="2" fill="#FFD400" stroke="#2C1A00" strokeWidth="1.75"/>
                <path d="M27 32c0-3 2-4 5-4s5 1 5 4" stroke="#2C1A00" strokeWidth="1.75" fill="none"/>
              </svg>
            </div>

            <h3 className="role-card-title">Food Donor</h3>
            <p className="role-card-desc">
              Have leftover food from events, home, or your restaurant? List it in 2 minutes. Someone nearby will claim it.
            </p>

            {/* Checklist */}
            <div className="role-card-checks">
              <div className="check-item">
                <div className="check-circle">✓</div>
                <span>List food in under 2 minutes</span>
              </div>
              <div className="check-item">
                <div className="check-circle">✓</div>
                <span>Earn points and badges</span>
              </div>
              <div className="check-item">
                <div className="check-circle">✓</div>
                <span>Know your food reached someone</span>
              </div>
            </div>

            {/* CTA Link */}
            <Link to="/register?role=DONOR" className="role-card-cta cta-donor">
              Start donating →
            </Link>
          </div>

          {/* CARD 2: NGO / Food Bank (Featured) */}
          <div className="role-card card-ngo featured-card">
            <div className="role-card-ribbon ribbon-ngo" />
            
            {/* Floating Badge */}
            <div className="role-card-badge">
              Most active on Plateful 🔥
            </div>

            {/* SVG Illustration */}
            <div className="role-card-icon-container">
              <svg width="60" height="60" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="12" y="24" width="40" height="32" rx="3" fill="#FFF2B2" stroke="#2C1A00" strokeWidth="1.8"/>
                <polygon points="8,24 32,10 56,24" fill="#FF9A3C" stroke="#2C1A00" strokeWidth="1.8" strokeLinejoin="round"/>
                <rect x="27" y="40" width="10" height="16" fill="#FFFAE5" stroke="#2C1A00" strokeWidth="1.8"/>
                <path d="M32 20c-1.5-1.5-3-1.5-4 0s-1 3 0 4l4 4 4-4c1-1 1-3 0-4s-2.5-1.5-4 0z" fill="#E76F51" stroke="#2C1A00" strokeWidth="1.5"/>
                <rect x="18" y="30" width="6" height="6" rx="1" fill="#FFFAE5" stroke="#2C1A00" strokeWidth="1.5"/>
                <rect x="40" y="30" width="6" height="6" rx="1" fill="#FFFAE5" stroke="#2C1A00" strokeWidth="1.5"/>
              </svg>
            </div>

            <h3 className="role-card-title">NGO / Food Bank</h3>
            <p className="role-card-desc">
              Are you a registered NGO or community kitchen feeding people? Claim surplus food from local donors and distribute it.
            </p>

            {/* Checklist */}
            <div className="role-card-checks">
              <div className="check-item">
                <div className="check-circle">✓</div>
                <span>Browse food by city</span>
              </div>
              <div className="check-item">
                <div className="check-circle">✓</div>
                <span>Assign volunteer pickups</span>
              </div>
              <div className="check-item">
                <div className="check-circle">✓</div>
                <span>Track donation history</span>
              </div>
            </div>

            {/* CTA Link */}
            <Link to="/register?role=NGO" className="role-card-cta cta-ngo">
              Register your NGO →
            </Link>
          </div>

          {/* CARD 3: Volunteer */}
          <div className="role-card card-volunteer">
            <div className="role-card-ribbon ribbon-volunteer" />
            
            {/* SVG Illustration */}
            <div className="role-card-icon-container">
              <svg width="60" height="60" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="8" y1="52" x2="56" y2="52" stroke="#2C1A00" strokeWidth="1.75" strokeLinecap="round"/>
                <circle cx="18" cy="44" r="8" fill="#FFF2B2" stroke="#2C1A00" strokeWidth="1.75"/>
                <circle cx="46" cy="44" r="8" fill="#FFF2B2" stroke="#2C1A00" strokeWidth="1.75"/>
                <polyline points="18,44 28,32 40,32 46,44" stroke="#2C1A00" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="28" y1="32" x2="32" y2="18" stroke="#2C1A00" strokeWidth="1.75" strokeLinecap="round"/>
                <line x1="18" y1="44" x2="32" y2="18" stroke="#2C1A00" strokeWidth="1.75" strokeLinecap="round"/>
                <polyline points="40,32 36,22 44,22" stroke="#2C1A00" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="14" y="20" width="10" height="12" rx="1.5" fill="#4CAF7D" stroke="#2C1A00" strokeWidth="1.5"/>
                <circle cx="32" cy="12" r="4" fill="#FAD0C4" stroke="#2C1A00" strokeWidth="1.5"/>
                <path d="M28 17c0-2.5 2.5-3.5 5-3.5c2.5 0 3.5 1 3.5 3.5v7" fill="none" stroke="#2C1A00" strokeWidth="1.75" strokeLinecap="round"/>
                <polyline points="32,17 38,23 42,23" fill="none" stroke="#2C1A00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <h3 className="role-card-title">Volunteer</h3>
            <p className="role-card-desc">
              Have a bicycle, bike, or car and a few hours a week? Help transport food packages from donors to nearby NGOs safely.
            </p>

            {/* Checklist */}
            <div className="role-card-checks">
              <div className="check-item">
                <div className="check-circle">✓</div>
                <span>Get pickup tasks near you</span>
              </div>
              <div className="check-item">
                <div className="check-circle">✓</div>
                <span>Earn badges + climb leaderboard</span>
              </div>
              <div className="check-item">
                <div className="check-circle">✓</div>
                <span>Make a visible difference</span>
              </div>
            </div>

            {/* CTA Link */}
            <Link to="/register?role=VOLUNTEER" className="role-card-cta cta-volunteer">
              Join as volunteer →
            </Link>
          </div>

        </div>

      </div>

      {/* Styled inline classes */}
      <style>{`
        .role-cards-section {
          background-color: #2C1A00;
          padding: 88px 0;
          position: relative;
          overflow: hidden;
          font-family: 'Nunito', sans-serif;
        }

        /* Float animation for doodles */
        .pf-role-floating-icon {
          animation: pf-role-float infinite ease-in-out;
        }

        @keyframes pf-role-float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(2deg);
          }
        }

        .pf-role-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
          z-index: 5;
        }

        .pf-role-section-label {
          display: inline-block;
          background-color: rgba(255, 212, 0, 0.15);
          color: #FFD400;
          border: 1.5px solid rgba(255, 212, 0, 0.3);
          border-radius: 50px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 6px 18px;
          margin-bottom: 16px;
        }

        .pf-role-headline {
          font-size: 38px;
          font-weight: 800;
          color: #FFFFFF;
          margin-top: 12px;
          margin-bottom: 52px;
        }

        /* 3 Cards Grid styling */
        .role-cards-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 28px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .role-card {
          background-color: #FFFFFF;
          border-radius: 24px;
          padding: 36px 28px;
          overflow: hidden;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .role-card-ribbon {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 5px;
          border-radius: 24px 24px 0 0;
        }

        .ribbon-donor { background-color: #FFD400; }
        .ribbon-ngo { background-color: #FF9A3C; }
        .ribbon-volunteer { background-color: #4CAF7D; }

        /* Card interactive hovers */
        .card-donor:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 48px rgba(255, 212, 0, 0.20);
        }

        .card-ngo {
          /* Featured Card starting state box-shadow is slightly more pronounced */
          box-shadow: 0 4px 24px rgba(255, 154, 60, 0.12);
        }

        .card-ngo:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 48px rgba(255, 154, 60, 0.22);
        }

        .card-volunteer:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 48px rgba(76, 175, 125, 0.20);
        }

        /* Floating badge specifically for Card 2 */
        .role-card-badge {
          display: inline-block;
          background-color: #FFF2B2;
          color: #7a6200;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 50px;
          margin-bottom: 12px;
        }

        .role-card-icon-container {
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 60px;
        }

        .role-card-title {
          font-size: 22px;
          font-weight: 800;
          color: #2C1A00;
          margin-bottom: 12px;
        }

        .role-card-desc {
          font-size: 14px;
          color: #7a6200;
          line-height: 1.75;
          margin-bottom: 20px;
        }

        /* Check items vertical layout */
        .role-card-checks {
          margin-top: auto; /* Push checklists and CTAs to the bottom of the card */
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .check-item {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .check-circle {
          width: 20px;
          height: 20px;
          min-width: 20px;
          border-radius: 50%;
          background-color: #FFF2B2;
          color: #FFD400;
          font-weight: 800;
          font-size: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .check-item span {
          font-size: 14px;
          color: #2C1A00;
          font-weight: 600;
        }

        /* CTA buttons styling */
        .role-card-cta {
          display: block;
          width: 100%;
          text-align: center;
          border-radius: 50px;
          padding: 12px;
          font-weight: 700;
          font-size: 15px;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
        }

        .cta-donor {
          background-color: #FFD400;
          color: #2C1A00;
        }

        .cta-donor:hover {
          background-color: #FFE566; /* var(--y6) */
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 212, 0, 0.3);
        }

        .cta-ngo {
          background-color: #FF9A3C;
          color: #FFFFFF;
        }

        .cta-ngo:hover {
          background-color: #ffaa5e;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 154, 60, 0.3);
        }

        .cta-volunteer {
          background-color: #4CAF7D;
          color: #FFFFFF;
        }

        .cta-volunteer:hover {
          background-color: #60c58f;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(76, 175, 125, 0.3);
        }

        @media (max-width: 991px) {
          .role-cards-grid {
            grid-template-columns: 1fr;
            max-width: 480px;
            margin: 0 auto;
            gap: 32px;
          }
          
          .role-card {
            padding: 32px 24px;
            align-items: center;
            text-align: center;
          }
          
          .role-card-checks {
            align-items: center;
          }
        }
      `}</style>
    </section>
  );
};

export default RoleCards;
