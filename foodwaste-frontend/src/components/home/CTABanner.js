import React from 'react';
import { Link } from 'react-router-dom';

const CTABanner = () => {
  return (
    <section className="cta-banner-section">
      {/* Decorative large circles for depth */}
      <div className="cta-circle cta-circle-tl" />
      <div className="cta-circle cta-circle-br" />

      <div className="container pf-cta-container">
        
        {/* Small Badge */}
        <span className="cta-badge-pill">
          Join 2,800+ food heroes across India
        </span>

        {/* Headline & Subtitle */}
        <h2 className="cta-headline">
          Ready to make someone's day with food?
        </h2>
        <p className="cta-subheading">
          Sign up in 30 seconds. Zero cost. Pure kindness.
        </p>

        {/* 3 Option Cards */}
        <div className="cta-cards-flex">
          
          {/* Card 1: Donor */}
          <Link to="/register?role=DONOR" className="cta-option-card">
            {/* Tiffin SVG */}
            <div className="cta-card-icon-wrapper">
              <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="14" y="20" width="24" height="20" rx="3" fill="#FFF2B2" stroke="#2C1A00" strokeWidth="2"/>
                <path d="M18 20c0-6 4-8 8-8s8 2 8 8" stroke="#2C1A00" strokeWidth="2" fill="none"/>
                <line x1="14" y1="30" x2="38" y2="30" stroke="#2C1A00" strokeWidth="2"/>
                <rect x="23" y="16" width="6" height="4" fill="#FFE566" stroke="#2C1A00" strokeWidth="2"/>
              </svg>
            </div>
            <h3 className="cta-card-title">🍱 I have food to donate</h3>
            <p className="cta-card-desc">
              List surplus food and start earning points
            </p>
            <span className="cta-card-pill">Earn points →</span>
          </Link>

          {/* Card 2: NGO (Featured) */}
          <Link to="/register?role=NGO" className="cta-option-card featured-cta-card">
            {/* Top-Right Badge */}
            <div className="cta-card-badge">🔥 Most popular</div>

            {/* Building SVG */}
            <div className="cta-card-icon-wrapper">
              <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="18" width="32" height="26" rx="3" fill="#FFE566" stroke="#2C1A00" strokeWidth="2"/>
                <polygon points="6,18 26,6 46,18" fill="#FF9A3C" stroke="#2C1A00" strokeWidth="2" strokeLinejoin="round"/>
                <rect x="23" y="32" width="6" height="12" fill="#FFFAE5" stroke="#2C1A00" strokeWidth="2"/>
                <rect x="15" y="24" width="6" height="6" rx="1" fill="#FFFAE5" stroke="#2C1A00" strokeWidth="1.5"/>
                <rect x="31" y="24" width="6" height="6" rx="1" fill="#FFFAE5" stroke="#2C1A00" strokeWidth="1.5"/>
              </svg>
            </div>
            <h3 className="cta-card-title">🏢 I represent an NGO</h3>
            <p className="cta-card-desc">
              Claim food for your community members
            </p>
            <span className="cta-card-pill">Browse food →</span>
          </Link>

          {/* Card 3: Volunteer */}
          <Link to="/register?role=VOLUNTEER" className="cta-option-card">
            {/* Bicycle SVG */}
            <div className="cta-card-icon-wrapper">
              <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="15" cy="36" r="7" fill="#FFF2B2" stroke="#2C1A00" strokeWidth="2"/>
                <circle cx="37" cy="36" r="7" fill="#FFF2B2" stroke="#2C1A00" strokeWidth="2"/>
                <polyline points="15,36 23,26 33,26 37,36" stroke="#2C1A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="23" y1="26" x2="27" y2="14" stroke="#2C1A00" strokeWidth="2" strokeLinecap="round"/>
                <line x1="15" y1="36" x2="27" y2="14" stroke="#2C1A00" strokeWidth="2" strokeLinecap="round"/>
                <polyline points="33,26 29,18 36,18" stroke="#2C1A00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <rect x="12" y="16" width="8" height="10" rx="1.5" fill="#4CAF7D" stroke="#2C1A00" strokeWidth="1.5"/>
              </svg>
            </div>
            <h3 className="cta-card-title">🚴 I want to volunteer</h3>
            <p className="cta-card-desc">
              Pick up food and deliver near you
            </p>
            <span className="cta-card-pill">Join free →</span>
          </Link>

        </div>

        {/* Already have an account row */}
        <div className="cta-banner-signin">
          Already have an account?{' '}
          <Link to="/login" className="cta-signin-link">
            Sign in here →
          </Link>
        </div>

      </div>

      {/* Styled Embed Code */}
      <style>{`
        .cta-banner-section {
          background-color: #FFD400;
          background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='3' cy='3' r='1.5' fill='%232C1A00' opacity='0.08'/%3E%3C/svg%3E");
          padding: 88px 0;
          text-align: center;
          position: relative;
          overflow: hidden;
          font-family: 'Nunito', sans-serif;
        }

        /* Large faint circles overlay for depth */
        .cta-circle {
          position: absolute;
          width: 500px;
          height: 500px;
          border: 2px solid rgba(44, 26, 0, 0.05);
          border-radius: 50%;
          pointer-events: none;
          z-index: 1;
        }

        .cta-circle-tl {
          top: -250px;
          left: -250px;
        }

        .cta-circle-br {
          bottom: -250px;
          right: -250px;
        }

        .pf-cta-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
          position: relative;
          z-index: 5;
        }

        .cta-badge-pill {
          display: inline-block;
          background-color: rgba(44, 26, 0, 0.08);
          color: #2C1A00;
          font-size: 13px;
          font-weight: 700;
          border-radius: 50px;
          padding: 6px 18px;
        }

        .cta-headline {
          font-size: 42px;
          font-weight: 800;
          color: #2C1A00;
          max-width: 620px;
          margin: 16px auto;
          line-height: 1.2;
        }

        .cta-subheading {
          font-size: 17px;
          color: rgba(44, 26, 0, 0.65);
          margin-bottom: 44px;
        }

        /* 3 Option Cards Container */
        .cta-cards-flex {
          display: flex;
          gap: 20px;
          max-width: 900px;
          margin: 0 auto;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-option-card {
          background-color: #FFFFFF;
          border-radius: 20px;
          padding: 28px 24px;
          flex: 1;
          min-width: 240px;
          border: 1.5px solid #FFEE99;
          box-shadow: 0 4px 20px rgba(44, 26, 0, 0.08);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-decoration: none;
          transition: all 0.25s ease;
          position: relative;
        }

        .cta-option-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 8px 28px rgba(44, 26, 0, 0.16);
          border-color: #FFD400;
        }

        .cta-card-icon-wrapper {
          height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .cta-card-title {
          font-size: 16px;
          font-weight: 800;
          color: #2C1A00;
          margin-top: 12px;
        }

        .cta-card-desc {
          font-size: 13px;
          color: #7a6200;
          margin-top: 6px;
          line-height: 1.5;
          flex-grow: 1;
          margin-bottom: 16px;
        }

        .cta-card-pill {
          display: inline-block;
          background-color: #FFF2B2;
          color: #7a6200;
          font-size: 12px;
          font-weight: 700;
          border-radius: 50px;
          padding: 4px 12px;
          transition: background-color 0.2s ease;
        }

        .cta-option-card:hover .cta-card-pill {
          background-color: #FFE566;
          color: #2C1A00;
        }

        /* Floating badge for Featured Card (NGO) */
        .cta-card-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background-color: #FFF2B2;
          color: #7a6200;
          font-size: 10px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 50px;
          border: 1px solid #FFEE99;
        }

        /* Sign in row styling */
        .cta-banner-signin {
          font-size: 14px;
          color: rgba(44, 26, 0, 0.55);
          margin-top: 32px;
        }

        .cta-signin-link {
          color: #2C1A00;
          font-weight: 700;
          text-decoration: none;
        }

        .cta-signin-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 767px) {
          .cta-banner-section {
            padding: 60px 16px;
          }

          .cta-headline {
            font-size: 32px;
          }

          .cta-cards-flex {
            flex-direction: column;
          }

          .cta-option-card {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
};

export default CTABanner;
