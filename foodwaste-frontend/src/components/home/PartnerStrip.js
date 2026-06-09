import React from 'react';
import { Link } from 'react-router-dom';

const PartnerStrip = () => {
  const ngoList = [
    'Akshaya Patra',
    'Robin Hood Army',
    'No Food Waste',
    'Feeding India',
    'GreenHope Foundation',
    'HelpAge India',
    'Smile Foundation',
    'Goonj',
    'Annamrita',
    'Magic Bus',
    'CRY India',
    'Udayan Care',
    'Deepalaya',
    'Prayas'
  ];

  // Repeat content 3 times for a seamless loop animation
  const displayNGOs = [...ngoList, ...ngoList, ...ngoList];

  return (
    <section className="partner-strip-section">
      <div className="container pf-partner-container">
        
        {/* Section Label */}
        <p className="partner-section-label">
          NGOs and food banks already on Plateful
        </p>

        {/* Scrolling Ticker Wrap */}
        <div className="partner-ticker-container">
          <div className="partner-ticker-track">
            {displayNGOs.map((ngo, idx) => (
              <div key={idx} className="ngo-pill">
                <span className="ngo-dot" />
                <span className="ngo-name">{ngo}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Below Strip Footer */}
        <div className="partner-footer">
          Is your NGO not listed?{' '}
          <Link to="/register?role=NGO" className="partner-link">
            Partner with Plateful →
          </Link>
        </div>

      </div>

      {/* Styled Embed Code */}
      <style>{`
        .partner-strip-section {
          background-color: #FFFFFF;
          padding: 56px 0;
          border-top: 1.5px solid #FFEE99;
          border-bottom: 1.5px solid #FFEE99;
          overflow: hidden;
          font-family: 'Nunito', sans-serif;
        }

        .pf-partner-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .partner-section-label {
          text-align: center;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #7a6200;
          font-weight: 700;
          margin-bottom: 32px;
        }

        /* Edge Fade Masking */
        .partner-ticker-container {
          overflow: hidden;
          width: 100%;
          mask-image: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%);
        }

        .partner-ticker-track {
          display: flex;
          white-space: nowrap;
          width: max-content;
          animation: stripLeft 38s linear infinite;
        }

        /* Hover Pause */
        .partner-ticker-track:hover {
          animation-play-state: paused;
        }

        /* NGO pill styling */
        .ngo-pill {
          display: inline-flex;
          align-items: center;
          background-color: #FFFAE5;
          border: 1.5px solid #FFEE99;
          border-radius: 50px;
          padding: 10px 24px;
          font-size: 14px;
          font-weight: 600;
          color: #2C1A00;
          white-space: nowrap;
          margin: 0 10px;
          box-shadow: 0 2px 8px rgba(255, 212, 0, 0.10);
          transition: all 0.2s ease;
          cursor: pointer;
        }

        .ngo-pill:hover {
          background-color: #FFF2B2;
          border-color: #FFD400;
        }

        /* Green status indicator dot */
        .ngo-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: #4CAF7D;
          margin-right: 8px;
          display: inline-block;
          vertical-align: middle;
        }

        .ngo-name {
          display: inline-block;
          vertical-align: middle;
        }

        /* Bottom helper link */
        .partner-footer {
          text-align: center;
          margin-top: 28px;
          font-size: 14px;
          color: #7a6200;
        }

        .partner-link {
          color: #2C1A00;
          font-weight: 700;
          text-decoration: underline dotted #FFD400;
          transition: color 0.2s ease;
        }

        .partner-link:hover {
          color: #7a6200;
        }

        /* Scrolling Animation Keyframes */
        @keyframes stripLeft {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-33.3333%);
          }
        }
      `}</style>
    </section>
  );
};

export default PartnerStrip;
