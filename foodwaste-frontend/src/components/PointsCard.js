import React from 'react';

const PointsCard = ({ pointsData }) => {
  if (!pointsData) return null;

  const {
    points = 0,
    badge = 'BRONZE',
    nextBadge = 'SILVER',
    pointsToNextBadge = 0,
    donationCount = 0,
  } = pointsData;

  const getProgressPercent = () => {
    if (badge === 'PLATINUM') return 100;
    let start = 0;
    let end = 50;

    if (badge === 'SILVER') {
      start = 50;
      end = 150;
    } else if (badge === 'GOLD') {
      start = 150;
      end = 300;
    }

    const currentProgress = points - start;
    const totalRequired = end - start;
    return Math.min(100, Math.max(0, (currentProgress / totalRequired) * 100));
  };

  const percent = getProgressPercent();

  const getBadgeClass = (tier) => {
    switch (tier) {
      case 'PLATINUM':
        return 'platinum-shimmer';
      case 'GOLD':
        return 'badge-yellow';
      case 'SILVER':
        return 'badge-gray';
      case 'BRONZE':
        return 'badge-amber';
      default:
        return 'badge-gray';
    }
  };

  const getBadgeStyle = (tier) => {
    switch (tier) {
      case 'PLATINUM':
        return {
          background: 'linear-gradient(120deg, #6b21a8, #d97706, #6b21a8)',
          backgroundSize: '200% auto',
          color: '#ffffff',
          fontWeight: '700',
          border: '1px solid #d8b4fe',
          boxShadow: '0 4px 10px rgba(107, 33, 168, 0.2)',
        };
      case 'GOLD':
        return {
          background: '#fef9c3',
          color: '#854d0e',
          border: '1px solid #fef08a',
        };
      case 'SILVER':
        return {
          background: 'var(--gray-100)',
          color: 'var(--gray-700)',
          border: '1px solid var(--gray-200)',
        };
      case 'BRONZE':
        return {
          background: '#ffedd5',
          color: '#c2410c',
          border: '1px solid #fed7aa',
        };
      default:
        return {};
    }
  };

  return (
    <div className="card" style={styles.container}>
      <style>{`
        @keyframes shimmer-effect {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .platinum-shimmer {
          animation: shimmer-effect 2.5s infinite linear;
        }
      `}</style>

      {/* Top Section */}
      <div style={styles.topSection}>
        <div style={styles.pointsBlock}>
          <span style={styles.starIcon}>⭐️</span>
          <span style={styles.pointsNum}>{points}</span>
          <span style={styles.pointsText}>points</span>
        </div>
        <span
          className={`badge ${getBadgeClass(badge)}`}
          style={{ ...styles.badgeStyle, ...getBadgeStyle(badge) }}
        >
          🏆 {badge}
        </span>
      </div>

      {/* Progress Bar */}
      <div style={styles.progressContainer}>
        {badge === 'PLATINUM' ? (
          <div style={styles.maxTierText}>🎉 Max tier achieved! You are a Platinum Legend.</div>
        ) : (
          <>
            <div style={styles.progressLabel}>
              <span>Progress to next tier</span>
              <span style={{ fontWeight: '700', color: 'var(--primary)' }}>
                {pointsToNextBadge} pts to {nextBadge}
              </span>
            </div>
            <div style={styles.progressBarBg}>
              <div
                style={{
                  ...styles.progressBarFill,
                  width: `${percent}%`,
                  background:
                    badge === 'GOLD'
                      ? 'linear-gradient(90deg, #f59e0b, #eab308)'
                      : 'var(--primary)',
                }}
              />
            </div>
          </>
        )}
      </div>

      {/* Mini Stat Boxes */}
      <div style={styles.statsRow}>
        <div style={styles.statBox}>
          <div style={styles.statNum}>{donationCount}</div>
          <div style={styles.statLabel}>Total Donations</div>
        </div>
        <div style={styles.statBox}>
          <div style={styles.statNum}>{points}</div>
          <div style={styles.statLabel}>Points Earned</div>
        </div>
        <div style={styles.statBox}>
          <div
            style={{
              fontSize: '18px',
              fontWeight: '700',
              textTransform: 'capitalize',
              color: badge === 'GOLD' ? '#d97706' : badge === 'PLATINUM' ? '#6b21a8' : 'var(--primary)',
            }}
          >
            {badge.toLowerCase()}
          </div>
          <div style={styles.statLabel}>Current Level</div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '1.5rem',
    borderRadius: '14px',
    background: '#fff',
    border: '1px solid var(--gray-200)',
    boxShadow: 'var(--shadow)',
    marginBottom: '1.75rem',
  },
  topSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    marginBottom: '1.25rem',
  },
  pointsBlock: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '6px',
  },
  starIcon: {
    fontSize: '24px',
  },
  pointsNum: {
    fontSize: '32px',
    fontWeight: '800',
    color: 'var(--gray-900)',
    lineHeight: '1',
  },
  pointsText: {
    fontSize: '14px',
    color: 'var(--gray-500)',
    fontWeight: '500',
  },
  badgeStyle: {
    fontSize: '12px',
    fontWeight: '700',
    padding: '4px 12px',
    borderRadius: '20px',
    textTransform: 'uppercase',
  },
  progressContainer: {
    marginBottom: '1.5rem',
  },
  progressLabel: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12.5px',
    color: 'var(--gray-500)',
    marginBottom: '8px',
    fontWeight: '500',
  },
  progressBarBg: {
    width: '100%',
    height: '8px',
    background: 'var(--gray-100)',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: '10px',
    transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  maxTierText: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#6b21a8',
    background: '#f3e8ff',
    padding: '8px 12px',
    borderRadius: '6px',
    textAlign: 'center',
    border: '1px solid #e9d5ff',
  },
  statsRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '1rem',
    borderTop: '1px solid var(--gray-100)',
    paddingTop: '1.25rem',
  },
  statBox: {
    flex: 1,
    textAlign: 'center',
    background: 'var(--gray-50)',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid var(--gray-100)',
  },
  statNum: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--gray-900)',
    marginBottom: '2px',
  },
  statLabel: {
    fontSize: '11px',
    color: 'var(--gray-500)',
    fontWeight: '500',
  },
};

export default PointsCard;
