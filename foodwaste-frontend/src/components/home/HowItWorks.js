import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SectionLabel from '../ui/SectionLabel';

const HowItWorks = () => {
  const [activeTab, setActiveTab] = useState('DONOR');
  const [fade, setFade] = useState(true);

  const handleTabChange = (tab) => {
    if (tab === activeTab) return;
    setFade(false);
    setTimeout(() => {
      setActiveTab(tab);
      setFade(true);
    }, 150);
  };

  // Inline warm-colored SVG icons matching the palette
  const icons = {
    // 📝 Edit / Register icon
    edit: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2C1A00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" fill="#FFE97F" />
      </svg>
    ),
    // 🍱 Box / List food icon
    box: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2C1A00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" fill="#FFF2B2" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22" x2="12" y2="12" />
      </svg>
    ),
    // 🏢 Building / NGO claim icon
    building: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2C1A00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" ry="2" fill="#FFE97F" />
        <line x1="9" y1="22" x2="9" y2="16" />
        <line x1="15" y1="22" x2="15" y2="16" />
        <path d="M9 16h6v6H9v-6z" fill="#FFFAE5" />
        <line x1="8" y1="6" x2="8" y2="6.01" />
        <line x1="16" y1="6" x2="16" y2="6.01" />
        <line x1="8" y1="11" x2="8" y2="11.01" />
        <line x1="16" y1="11" x2="16" y2="11.01" />
      </svg>
    ),
    // ⭐ Star / Points icon
    star: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2C1A00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#FFD400" />
      </svg>
    ),
    // 🔍 Search / Browse food icon
    search: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2C1A00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" fill="#FFF2B2" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    // 🚚 Truck / Deliver food icon
    truck: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2C1A00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" fill="#FFF6CC" />
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" fill="#FFE97F" />
        <circle cx="5.5" cy="18.5" r="2.5" fill="#2C1A00" />
        <circle cx="18.5" cy="18.5" r="2.5" fill="#2C1A00" />
      </svg>
    ),
    // 📋 Checklist / Task icon
    checklist: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2C1A00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="4" width="14" height="16" rx="2" ry="2" fill="#FFF2B2" />
        <path d="M9 9h6" />
        <path d="M9 13h6" />
        <path d="M9 17h4" />
        <path d="M16 2v4" />
        <path d="M8 2v4" />
      </svg>
    ),
    // 🚴 Bike / Volunteer courier icon
    bike: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2C1A00" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="5.5" cy="17.5" r="3.5" fill="#FFE97F" />
        <circle cx="18.5" cy="17.5" r="3.5" fill="#FFE97F" />
        <line x1="5.5" y1="17.5" x2="9" y2="10.5" />
        <line x1="18.5" y1="17.5" x2="14" y2="10.5" />
        <line x1="9" y1="10.5" x2="14" y2="10.5" />
        <polyline points="14 10.5 16 6.5 20 6.5" />
        <line x1="9" y1="10.5" x2="7" y2="7.5" />
        <line x1="5.5" y1="7.5" x2="8.5" y2="7.5" />
      </svg>
    )
  };

  const stepsData = {
    DONOR: [
      { icon: icons.edit, title: 'Register free', desc: 'Create your account as a food donor. Takes 30 seconds.' },
      { icon: icons.box, title: 'List your food', desc: 'Add food name, quantity, expiry time, and pickup address.' },
      { icon: icons.building, title: 'NGO claims it', desc: 'A nearby NGO sees your listing and claims it within minutes.' },
      { icon: icons.star, title: 'Earn points', desc: 'Get notified when food is picked up. Earn points and badges.' }
    ],
    NGO: [
      { icon: icons.edit, title: 'Register NGO', desc: 'Create your NGO profile with verification details in under a minute.' },
      { icon: icons.search, title: 'Browse nearby food', desc: 'See lists of freshly posted excess food available in your area.' },
      { icon: icons.truck, title: 'Claim & assign', desc: 'Claim a listing and assign a volunteer rider to collect the shipment.' },
      { icon: icons.building, title: 'Receive & distribute', desc: 'Verify details upon receipt and safely distribute meals to families.' }
    ],
    VOLUNTEER: [
      { icon: icons.edit, title: 'Join as volunteer', desc: 'Sign up as a community volunteer courier in under a minute.' },
      { icon: icons.checklist, title: 'Get task assigned', desc: 'Receive notification requests to pick up claimed food near you.' },
      { icon: icons.bike, title: 'Pick up food', desc: 'Pick up the donor\'s surplus packages and deliver to the NGO point.' },
      { icon: icons.star, title: 'Earn badges', desc: 'Gain impact points, levels, and green saver badges for each run.' }
    ]
  };

  return (
    <section id="how-it-works" className="how-section">
      <div className="container pf-how-container">
        
        {/* Top Label & Headline */}
        <div style={{ textAlign: 'center' }}>
          <SectionLabel text="Simple as sharing a meal" />
          <h2 className="pf-how-headline">How Plateful works</h2>
        </div>

        {/* Tab Selection */}
        <div className="pf-tabs-wrapper">
          <div className="pf-tabs-container">
            <button
              onClick={() => handleTabChange('DONOR')}
              className={`pf-tab-button ${activeTab === 'DONOR' ? 'active' : ''}`}
            >
              🍱 I'm a Donor
            </button>
            <button
              onClick={() => handleTabChange('NGO')}
              className={`pf-tab-button ${activeTab === 'NGO' ? 'active' : ''}`}
            >
              🏢 I'm an NGO
            </button>
            <button
              onClick={() => handleTabChange('VOLUNTEER')}
              className={`pf-tab-button ${activeTab === 'VOLUNTEER' ? 'active' : ''}`}
            >
              🚴 I'm a Volunteer
            </button>
          </div>
        </div>

        {/* Step Cards Grid */}
        <div className={`pf-how-grid ${fade ? 'fade-in' : 'fade-out'}`}>
          {stepsData[activeTab].map((step, idx) => (
            <div key={idx} className="pf-how-card">
              {/* Step circle badge */}
              <div className="pf-how-badge">{idx + 1}</div>
              
              {/* SVG Icon */}
              <div className="pf-how-icon-container">
                {step.icon}
              </div>

              <h3 className="pf-how-card-title">{step.title}</h3>
              <p className="pf-how-card-desc">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '48px' }}>
          <Link to="/register" className="btn btn-primary">
            Get started — it's free →
          </Link>
        </div>

      </div>

      {/* Styled Inline Styles */}
      <style>{`
        .how-section {
          background-color: #FFFAE5;
          padding: 88px 0;
          font-family: 'Nunito', sans-serif;
        }

        .pf-how-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .pf-how-headline {
          font-size: 38px;
          font-weight: 800;
          color: #2C1A00;
          text-align: center;
          margin-top: 12px;
        }

        /* Tabs centered design */
        .pf-tabs-wrapper {
          display: flex;
          justify-content: center;
          margin-top: 36px;
          margin-bottom: 52px;
        }

        .pf-tabs-container {
          background-color: #FFF6CC;
          border-radius: 50px;
          padding: 5px;
          display: inline-flex;
          border: 1.5px solid #FFEE99;
        }

        .pf-tab-button {
          background-color: transparent;
          color: #7a6200;
          padding: 10px 24px;
          border-radius: 50px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.25s ease;
          border: none;
          font-family: inherit;
        }

        .pf-tab-button.active {
          background-color: #FFD400;
          color: #2C1A00;
          box-shadow: 0 2px 8px rgba(255, 212, 0, 0.3);
        }

        /* Step cards grid horizontal layout */
        .pf-how-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .pf-how-grid.fade-in {
          opacity: 1;
        }
        
        .pf-how-grid.fade-out {
          opacity: 0;
          transition: opacity 0.15s ease;
        }

        .pf-how-card {
          background-color: #FFFFFF;
          border: 1.5px solid #FFEE99;
          border-radius: 20px;
          padding: 32px 24px;
          box-shadow: 0 4px 20px rgba(255, 212, 0, 0.10);
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
        }

        .pf-how-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(255, 212, 0, 0.20);
          border-color: #FFD400;
        }

        /* Step circle badge */
        .pf-how-badge {
          width: 48px;
          height: 48px;
          background-color: #FFD400;
          color: #2C1A00;
          font-size: 20px;
          font-weight: 800;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }

        .pf-how-icon-container {
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .pf-how-card-title {
          font-size: 17px;
          font-weight: 800;
          color: #2C1A00;
          margin-top: 16px;
        }

        .pf-how-card-desc {
          font-size: 14px;
          color: #7a6200;
          line-height: 1.7;
          margin-top: 8px;
        }

        /* Connector dashes between cards */
        @media (min-width: 768px) {
          .pf-how-card:not(:last-of-type)::after {
            content: '';
            position: absolute;
            top: 56px; /* center with step number badge */
            right: -21px; /* spans the 20px gap between grid items */
            width: 20px;
            border-top: 2.5px dashed #FFEE99;
            pointer-events: none;
          }
        }

        @media (max-width: 767px) {
          .pf-how-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          
          .pf-how-card {
            align-items: center;
            text-align: center;
            padding: 28px 20px;
          }
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;
