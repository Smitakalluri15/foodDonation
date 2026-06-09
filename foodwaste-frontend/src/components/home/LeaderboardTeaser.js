import React from 'react';
import { Link } from 'react-router-dom';

const LeaderboardTeaser = () => {
  const leaderboardData = [
    {
      rank: '👑 1',
      name: 'Ravi Kumar',
      city: 'Hyderabad',
      points: '420pts',
      tier: 'PLATINUM',
      tierStyle: { background: 'linear-gradient(135deg, #9D68F5, #6B46C1)', color: '#FFFFFF' },
      avatar: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="17" fill="#FAD0C4" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
          {/* Hair */}
          <path d="M10 16c0-5 3-7 8-7s8 2 8 7v-1c0-4-3-6-8-6s-8 2-8 6z" fill="#2C1A00"/>
          {/* Eyes & Smile */}
          <circle cx="15" cy="17" r="1" fill="#2C1A00"/>
          <circle cx="21" cy="17" r="1" fill="#2C1A00"/>
          <path d="M16 22c1 1 2 1 4 0" stroke="#2C1A00" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
          {/* Shirt */}
          <path d="M10 32c0-3 3-5 8-5s8 2 8 5" fill="#E76F51" stroke="#2C1A00" strokeWidth="1.2"/>
        </svg>
      ),
      highlight: true
    },
    {
      rank: '2',
      name: 'Priya S.',
      city: 'Bengaluru',
      points: '340pts',
      tier: 'GOLD',
      tierStyle: { backgroundColor: '#FFD400', color: '#2C1A00' },
      avatar: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="17" fill="#ECC3A4" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
          {/* Hair */}
          <path d="M9 18c0-5.5 4-10 9-10s9 4.5 9 10" fill="none" stroke="#2C1A00" strokeWidth="1.2"/>
          <path d="M9 18c0-5.5 4-10 9-10s9 4.5 9 10v2c0-2-3-6-9-6s-9 4-9 6z" fill="#2C1A00"/>
          {/* Eyes & Smile */}
          <circle cx="15" cy="18" r="1" fill="#2C1A00"/>
          <circle cx="21" cy="18" r="1" fill="#2C1A00"/>
          <path d="M16 22c1 1 2 1 4 0" stroke="#2C1A00" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
          {/* Shirt */}
          <path d="M10 32c0-3 3-5 8-5s8 2 8 5" fill="#4CAF7D" stroke="#2C1A00" strokeWidth="1.2"/>
        </svg>
      )
    },
    {
      rank: '3',
      name: 'Arjun M.',
      city: 'Pune',
      points: '285pts',
      tier: 'GOLD',
      tierStyle: { backgroundColor: '#FFD400', color: '#2C1A00' },
      avatar: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="17" fill="#FAD0C4" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
          {/* Short hair */}
          <path d="M10 15c0-2 2-3 4-3h8c2 0 4 1 4 3" fill="none" stroke="#2C1A00" strokeWidth="1.2"/>
          <path d="M10 15c0-2 2-3 4-3h8c2 0 4 1 4 3v1c0-1-2-2-4-2h-4c-2 0-4 1-4 2z" fill="#8B7355"/>
          {/* Eyes & Smile */}
          <circle cx="15" cy="18" r="1" fill="#2C1A00"/>
          <circle cx="21" cy="18" r="1" fill="#2C1A00"/>
          <path d="M16 22c1 1 2 1 4 0" stroke="#2C1A00" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
          {/* Shirt */}
          <path d="M10 32c0-3 3-5 8-5s8 2 8 5" fill="#FF9A3C" stroke="#2C1A00" strokeWidth="1.2"/>
        </svg>
      )
    },
    {
      rank: '4',
      name: 'Neha K.',
      city: 'Chennai',
      points: '210pts',
      tier: 'SILVER',
      tierStyle: { backgroundColor: '#A8A9AD', color: '#FFFFFF' },
      avatar: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="17" fill="#ECC3A4" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
          {/* Bob Hair */}
          <path d="M9 17c0-5 4-9 9-9s9 4 9 9v4c0-2-2-5-9-5s-9 3-9 5z" fill="#2C1A00"/>
          {/* Eyes & Smile */}
          <circle cx="15" cy="18" r="1" fill="#2C1A00"/>
          <circle cx="21" cy="18" r="1" fill="#2C1A00"/>
          <path d="M16 22c1 1 2 1 4 0" stroke="#2C1A00" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
          {/* Shirt */}
          <path d="M10 32c0-3 3-5 8-5s8 2 8 5" fill="#E76F51" stroke="#2C1A00" strokeWidth="1.2"/>
        </svg>
      )
    },
    {
      rank: '5',
      name: 'Vikram R.',
      city: 'Mumbai',
      points: '175pts',
      tier: 'SILVER',
      tierStyle: { backgroundColor: '#A8A9AD', color: '#FFFFFF' },
      avatar: (
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="17" fill="#FAD0C4" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
          {/* Hair */}
          <path d="M11 14c2-2 5-2 7-2s5 0 7 2" fill="none" stroke="#2C1A00" strokeWidth="1.2"/>
          {/* Eyes */}
          <circle cx="15" cy="17" r="1.2" fill="#2C1A00"/>
          <circle cx="21" cy="17" r="1.2" fill="#2C1A00"/>
          {/* Glasses */}
          <rect x="12" y="15" width="5" height="4" rx="1" stroke="#2C1A00" strokeWidth="1"/>
          <rect x="19" y="15" width="5" height="4" rx="1" stroke="#2C1A00" strokeWidth="1"/>
          <line x1="17" y1="17" x2="19" y2="17" stroke="#2C1A00" strokeWidth="1"/>
          {/* Smile */}
          <path d="M16 22c1 1 2 1 4 0" stroke="#2C1A00" strokeWidth="1.2" strokeLinecap="round" fill="none"/>
          {/* Shirt */}
          <path d="M10 32c0-3 3-5 8-5s8 2 8 5" fill="#4CAF7D" stroke="#2C1A00" strokeWidth="1.2"/>
        </svg>
      )
    }
  ];

  return (
    <section className="leaderboard-teaser-section">
      <div className="container pf-leaderboard-container">
        <div className="pf-leaderboard-grid">
          
          {/* Left Column Info */}
          <div className="pf-leaderboard-left">
            <span className="pf-leaderboard-badge-pill">
              🏆 This week's food heroes
            </span>
            <h2 className="pf-leaderboard-headline">
              Your kindness has a scoreboard.
            </h2>
            <p className="pf-leaderboard-description">
              Every donation earns you points. Climb from Bronze to Platinum. The more you share, the higher you rise.
            </p>

            {/* Tier Badges Row */}
            <div className="tier-badges-row">
              <span className="tier-pill tier-bronze">🥉 Bronze</span>
              <span className="tier-pill tier-silver">🥈 Silver</span>
              <span className="tier-pill tier-gold">🥇 Gold</span>
              <span className="tier-pill tier-platinum">💎 Platinum</span>
            </div>

            {/* Point Rules */}
            <div className="point-rules-list">
              <div className="point-rule-item">
                <span className="point-rule-emoji">🍱</span>
                <span>Donation claimed = +10 points</span>
              </div>
              <div className="point-rule-item">
                <span className="point-rule-emoji">🚴</span>
                <span>Pickup completed = +5 points</span>
              </div>
              <div className="point-rule-item">
                <span className="point-rule-emoji">🌟</span>
                <span>First donation ever = +20 bonus</span>
              </div>
            </div>

            {/* CTA Button */}
            <Link to="/leaderboard" className="pf-leaderboard-cta">
              View full leaderboard →
            </Link>
          </div>

          {/* Right Column Card */}
          <div className="pf-leaderboard-right">
            <div className="mock-leaderboard-card">
              
              {/* Card Header */}
              <div className="teaser-card-header">
                <span className="teaser-card-title">Top donors this week</span>
                <span className="teaser-card-subtitle">Updated daily</span>
              </div>

              {/* Rows List */}
              <div className="teaser-card-list">
                {leaderboardData.map((item, idx) => (
                  <div key={idx} className={`teaser-row ${item.highlight ? 'row-highlighted' : ''}`}>
                    <div className="teaser-left-info">
                      <span className="teaser-rank">{item.rank}</span>
                      <div className="teaser-avatar-wrapper">{item.avatar}</div>
                      <div style={{ marginLeft: '12px' }}>
                        <span className="teaser-name">{item.name}</span>
                        <span className="teaser-city">{item.city}</span>
                      </div>
                    </div>
                    <div className="teaser-right-info">
                      <span className="points-badge">{item.points}</span>
                      <span className="tier-badge" style={item.tierStyle}>{item.tier}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Card Footer */}
              <div className="teaser-card-footer">
                You could be here 👆
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Styled Embed Code */}
      <style>{`
        .leaderboard-teaser-section {
          background-color: #2C1A00;
          background-image: radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255, 212, 0, 0.06) 0%, transparent 70%);
          padding: 88px 0;
          font-family: 'Nunito', sans-serif;
          position: relative;
        }

        .pf-leaderboard-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .pf-leaderboard-grid {
          display: grid;
          grid-template-columns: 48fr 52fr;
          gap: 48px;
          align-items: center;
        }

        .pf-leaderboard-left {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .pf-leaderboard-badge-pill {
          display: inline-block;
          background-color: rgba(255, 212, 0, 0.15);
          border: 1.5px solid rgba(255, 212, 0, 0.25);
          color: #FFD400;
          font-size: 13px;
          font-weight: 700;
          border-radius: 50px;
          padding: 6px 18px;
          margin-bottom: 16px;
        }

        .pf-leaderboard-headline {
          font-size: 38px;
          font-weight: 800;
          color: #FFFFFF;
          margin-top: 16px;
          line-height: 1.2;
        }

        .pf-leaderboard-description {
          font-size: 16px;
          color: rgba(255, 255, 255, 0.65);
          line-height: 1.75;
          margin-top: 16px;
          max-width: 480px;
        }

        /* Tier Badges Row */
        .tier-badges-row {
          margin-top: 28px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tier-pill {
          font-size: 12px;
          font-weight: 700;
          padding: 6px 16px;
          border-radius: 50px;
          text-transform: uppercase;
        }

        .tier-bronze {
          background-color: #CD7F32;
          color: #FFFFFF;
        }

        .tier-silver {
          background-color: #A8A9AD;
          color: #FFFFFF;
        }

        .tier-gold {
          background-color: #FFD400;
          color: #2C1A00;
        }

        .tier-platinum {
          background: linear-gradient(135deg, #9D68F5, #6B46C1);
          color: #FFFFFF;
        }

        /* Point Rules */
        .point-rules-list {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .point-rule-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 2;
        }

        .point-rule-emoji {
          font-size: 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        /* CTA button styling */
        .pf-leaderboard-cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background-color: #FFD400;
          color: #2C1A00;
          border-radius: 50px;
          padding: 14px 32px;
          font-weight: 700;
          font-size: 16px;
          margin-top: 32px;
          box-shadow: 0 4px 20px rgba(255, 212, 0, 0.25);
          transition: all 0.3s ease;
          text-decoration: none;
          cursor: pointer;
        }

        .pf-leaderboard-cta:hover {
          background-color: #FFE566;
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(255, 212, 0, 0.35);
        }

        /* Mock Leaderboard Card styling */
        .mock-leaderboard-card {
          background-color: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          padding: 28px;
        }

        .teaser-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .teaser-card-title {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #FFD400;
          font-weight: 700;
        }

        .teaser-card-subtitle {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.4);
        }

        .teaser-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        }

        .row-highlighted {
          background-color: rgba(255, 212, 0, 0.08);
          margin-left: -28px;
          margin-right: -28px;
          padding-left: 28px;
          padding-right: 28px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        }

        .teaser-left-info {
          display: flex;
          align-items: center;
        }

        .teaser-rank {
          font-size: 18px;
          font-weight: 800;
          color: #FFD400;
          width: 28px;
        }

        .teaser-avatar-wrapper {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .teaser-name {
          font-size: 14px;
          color: #FFFFFF;
          font-weight: 700;
          display: block;
        }

        .teaser-city {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.45);
          display: block;
        }

        .teaser-right-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .points-badge {
          background-color: rgba(255, 212, 0, 0.15);
          color: #FFD400;
          border-radius: 50px;
          padding: 3px 10px;
          font-size: 12px;
          font-weight: 700;
        }

        .tier-badge {
          font-size: 10px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 50px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .teaser-card-footer {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.4);
          text-align: center;
          margin-top: 16px;
          font-style: italic;
        }

        @media (max-width: 991px) {
          .pf-leaderboard-grid {
            grid-template-columns: 1fr;
            gap: 44px;
          }
          
          .pf-leaderboard-left {
            align-items: center;
            text-align: center;
          }
          
          .pf-leaderboard-description {
            margin: 16px auto 0 auto;
          }
          
          .tier-badges-row, .point-rules-list {
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default LeaderboardTeaser;
