import React, { useState } from 'react';

const FoodTicker = () => {
  const [isPaused, setIsPaused] = useState(false);

  const row1Items = [
    '🍚 Steamed Rice', '🥘 Dal Tadka', '🫓 Roti', '🍜 Biryani', 
    '🥗 Raita', '🫕 Sabzi', '🧁 Laddoo', '🥣 Poha', 
    '🥙 Wrap', '🍱 Tiffin Box', '🍛 Rajma', '🥞 Dosa', 
    '🫙 Pickle', '🍲 Khichdi'
  ];

  const row2Items = [
    '🧆 Vada', '🍮 Halwa', '🌽 Bhutta', '🥧 Kheer', 
    '🍞 Pav', '🍝 Upma', '🌶 Achar', '🥩 Kebab', 
    '🍋 Nimbu Pani', '☕ Chai', '🌿 Chutney', '🥪 Kati Roll', 
    '🎂 Cake', '🍕 Pizza'
  ];

  // Repeat each list 3 times side-by-side for a seamless looping layout
  const row1List = [...row1Items, ...row1Items, ...row1Items];
  const row2List = [...row2Items, ...row2Items, ...row2Items];

  return (
    <section 
      className="pf-food-ticker-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container">
        {/* Label above ticker */}
        <h2 className="pf-ticker-heading">
          Foods being shared on Plateful right now 🍽️
        </h2>

        {/* Ticker rows wrapper with edge fade mask */}
        <div className={`pf-ticker-rows-container ${isPaused ? 'pf-ticker-paused' : ''}`}>
          
          {/* Row 1 (scrolls LEFT) */}
          <div className="pf-ticker-row-wrapper left-scroll">
            <div className="pf-ticker-track-left">
              {row1List.map((item, idx) => (
                <div key={`row1-${idx}`} className="pf-food-pill">
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Row 2 (scrolls RIGHT) */}
          <div className="pf-ticker-row-wrapper right-scroll">
            <div className="pf-ticker-track-right">
              {row2List.map((item, idx) => (
                <div key={`row2-${idx}`} className="pf-food-pill">
                  {item}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Note below */}
        <div className="pf-ticker-footer-note">
          Hover to pause &middot; All food listed is 100% free
        </div>
      </div>

      {/* Component Styles & Looping Keyframe Animations */}
      <style>{`
        .pf-food-ticker-section {
          background-color: #FFF6CC; /* --y2 slightly deeper yellow-cream */
          padding: 52px 0;
          overflow: hidden;
          font-family: 'Nunito', sans-serif;
        }

        .pf-ticker-heading {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: #7a6200; /* --med label color */
          text-align: center;
          margin-bottom: 28px;
        }

        /* Container for two rows with edge fade masks */
        .pf-ticker-rows-container {
          display: flex;
          flex-direction: column;
          gap: 14px;
          mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%);
        }

        .pf-ticker-row-wrapper {
          display: flex;
          width: 100%;
          overflow: hidden;
        }

        /* Left looping track */
        .pf-ticker-track-left {
          display: flex;
          white-space: nowrap;
          animation: tickerLeft 28s linear infinite;
        }

        /* Right looping track */
        .pf-ticker-track-right {
          display: flex;
          white-space: nowrap;
          animation: tickerRight 34s linear infinite;
        }

        /* Paused states */
        .pf-ticker-paused .pf-ticker-track-left,
        .pf-ticker-paused .pf-ticker-track-right {
          animation-play-state: paused !important;
        }

        /* Food pill styling */
        .pf-food-pill {
          background-color: #FFFFFF;
          border: 1.5px solid #FFEE99; /* --y4 border */
          border-radius: 50px;
          padding: 9px 22px;
          font-size: 14px;
          font-weight: 600;
          color: #2C1A00; /* --dark text */
          white-space: nowrap;
          margin: 0 8px;
          box-shadow: 0 2px 8px rgba(255, 212, 0, 0.15);
          transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
          user-select: none;
          cursor: pointer;
        }

        .pf-food-pill:hover {
          background-color: #FFF2B2; /* --y3 hover state */
          border-color: #FFD400; /* --y10 hover border */
          transform: scale(1.02);
        }

        .pf-ticker-footer-note {
          font-size: 12px;
          color: #7a6200;
          text-align: center;
          margin-top: 24px;
          opacity: 0.7;
          font-weight: 600;
        }

        /* Infinite marquee scroll animations */
        @keyframes tickerLeft {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-33.333%);
          }
        }

        @keyframes tickerRight {
          from {
            transform: translateX(-33.333%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  );
};

export default FoodTicker;
