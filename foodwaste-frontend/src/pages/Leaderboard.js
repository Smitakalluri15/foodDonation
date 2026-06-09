import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/helpers';
import { toast } from 'react-toastify';

const getBadgeStyle = (tier) => {
  switch (tier) {
    case 'PLATINUM':
      return { background: '#f3e8ff', color: '#6b21a8', border: '1px solid #e9d5ff' };
    case 'GOLD':
      return { background: '#F0C040', color: '#664d03', border: '1px solid #e0b030' };
    case 'SILVER':
      return { background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb' };
    case 'BRONZE':
      return { background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' };
    default:
      return { background: '#f3f4f6', color: '#374151' };
  }
};

const PodiumCard = ({ donor, rank }) => {
  if (!donor) return null;

  const isFirst = rank === 1;

  const getRankEmoji = (r) => {
    if (r === 1) return '🥇';
    if (r === 2) return '🥈';
    return '🥉';
  };

  const cardStyle = {
    ...styles.podiumCard,
    ...(isFirst
      ? styles.firstPlace
      : rank === 2
      ? styles.secondPlace
      : styles.thirdPlace),
  };

  return (
    <div style={cardStyle}>
      <div style={styles.podiumRankCircle}>{getRankEmoji(rank)}</div>
      <div
        style={{
          fontWeight: '700',
          fontSize: isFirst ? '16px' : '14px',
          color: 'var(--gray-900)',
          textAlign: 'center',
          marginBottom: '4px',
        }}
      >
        {isFirst && '👑 '}
        {donor.name}
      </div>
      <div style={{ fontSize: '12px', color: 'var(--gray-500)', marginBottom: '8px' }}>
        📍 {donor.city || 'India'}
      </div>
      <div style={styles.podiumStats}>
        <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--primary)' }}>
          {donor.points}
        </div>
        <div
          style={{
            fontSize: '10px',
            color: 'var(--gray-400)',
            textTransform: 'uppercase',
            fontWeight: '600',
          }}
        >
          points
        </div>
      </div>
      <div style={{ marginTop: '10px' }}>
        <span
          className="badge"
          style={{
            ...getBadgeStyle(donor.badge),
            fontSize: '10px',
            fontWeight: '700',
            padding: '2px 8px',
            borderRadius: '12px',
          }}
        >
          {donor.badge}
        </span>
      </div>
      <div style={{ fontSize: '11px', color: 'var(--gray-500)', marginTop: '8px' }}>
        📦 {donor.donationCount} donations
      </div>
    </div>
  );
};

const Leaderboard = () => {
  const { isAuthenticated } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const response = await API.get('/leaderboard');
      setLeaderboard(response.data || []);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <SkeletonStyles />
        <div style={styles.header}>
          <div>
            <p style={styles.kicker}>Public Standings</p>
            <h1 style={styles.title}>Top Food Heroes</h1>
            <p style={styles.sub}>Donors making the biggest difference</p>
          </div>
        </div>

        {/* Podium Skeletons */}
        <div style={styles.podiumRow}>
          {[2, 1, 3].map((n) => (
            <div
              key={n}
              className="skeleton-pulse"
              style={{
                width: n === 1 ? '240px' : '200px',
                height: n === 1 ? '260px' : n === 2 ? '220px' : '200px',
                borderRadius: '16px',
                marginBottom: '1rem',
              }}
            />
          ))}
        </div>

        {/* Table Skeletons */}
        <div
          className="card"
          style={{ height: '300px', display: 'flex', flexDirection: 'column', gap: '15px' }}
        >
          <div
            className="skeleton-pulse"
            style={{ width: '20%', height: '20px', borderRadius: '4px' }}
          />
          <div className="skeleton-pulse" style={{ flex: 1, borderRadius: '8px' }} />
        </div>
      </div>
    );
  }

  const podiumList = leaderboard.slice(0, 3);
  const remainingList = leaderboard.slice(3);

  return (
    <div className="page">
      <SkeletonStyles />
      <div style={styles.header}>
        <div>
          <p style={styles.kicker}>Public Standings</p>
          <h1 style={styles.title}>Top Food Heroes</h1>
          <p style={styles.sub}>Donors making the biggest difference</p>
        </div>
        <button className="btn btn-secondary" onClick={fetchLeaderboard}>
          ↻ Refresh List
        </button>
      </div>

      {/* Podium Grid */}
      <div style={styles.podiumRow}>
        {/* Second Place (Left) */}
        {podiumList[1] && <PodiumCard donor={podiumList[1]} rank={2} />}
        {/* First Place (Middle) */}
        {podiumList[0] && <PodiumCard donor={podiumList[0]} rank={1} />}
        {/* Third Place (Right) */}
        {podiumList[2] && <PodiumCard donor={podiumList[2]} rank={3} />}
      </div>

      {/* Ranks 4-10 Standings Table */}
      {remainingList.length > 0 && (
        <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
          <h3
            style={{
              fontSize: '15px',
              fontWeight: '700',
              marginBottom: '1rem',
              color: '#374151',
            }}
          >
            Standings Ranks 4 – 10
          </h3>
          <div style={styles.tableWrap}>
            <table>
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Rank</th>
                  <th>Name</th>
                  <th>City</th>
                  <th>Donations</th>
                  <th>Points</th>
                  <th>Tier Badge</th>
                </tr>
              </thead>
              <tbody>
                {remainingList.map((donor) => (
                  <tr key={donor.rank}>
                    <td style={{ fontWeight: '700', color: 'var(--gray-500)' }}>
                      #{donor.rank}
                    </td>
                    <td style={{ fontWeight: 600 }}>{donor.name}</td>
                    <td>{donor.city || '—'}</td>
                    <td>{donor.donationCount}</td>
                    <td style={{ fontWeight: '700', color: 'var(--info)' }}>
                      ⭐️ {donor.points} pts
                    </td>
                    <td>
                      <span
                        className="badge"
                        style={{
                          ...getBadgeStyle(donor.badge),
                          fontSize: '10px',
                          fontWeight: '700',
                          padding: '2px 8px',
                          borderRadius: '12px',
                        }}
                      >
                        {donor.badge}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CTA Button for unauthenticated users */}
      {!isAuthenticated() && (
        <div style={styles.ctaRow}>
          <div className="card" style={styles.ctaCard}>
            <div
              style={{
                fontSize: '16px',
                fontWeight: '700',
                color: 'var(--gray-900)',
                marginBottom: '6px',
              }}
            >
              Want to see your name here?
            </div>
            <p
              style={{
                fontSize: '13px',
                color: 'var(--gray-500)',
                margin: '0 0 1.25rem 0',
                lineHeight: 1.4,
              }}
            >
              Register as a donor on our platform to start posting donations, earning points, and
              claiming your spot on the leaderboard!
            </p>
            <Link to="/register" className="btn btn-primary">
              Join the Leaderboard — Start Donating!
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

const SkeletonStyles = () => (
  <style>{`
    @keyframes skeleton-pulse {
      0% { background-color: #f3f4f6; }
      50% { background-color: #e5e7eb; }
      100% { background-color: #f3f4f6; }
    }
    .skeleton-pulse {
      animation: skeleton-pulse 1.5s infinite ease-in-out;
    }
  `}</style>
);

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  kicker: {
    fontSize: '12px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: 'var(--primary)',
    fontWeight: 700,
    marginBottom: '6px',
  },
  title: { fontSize: '28px', fontWeight: 800, color: 'var(--gray-900)', margin: 0 },
  sub: { color: 'var(--gray-500)', marginTop: '4px', fontSize: '14px' },
  podiumRow: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: '20px',
    margin: '2rem 0 3rem 0',
    flexWrap: 'wrap',
  },
  podiumCard: {
    background: '#fff',
    borderRadius: '16px',
    border: '1px solid var(--gray-200)',
    boxShadow: 'var(--shadow)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '1.5rem 1rem',
    position: 'relative',
  },
  firstPlace: {
    width: '230px',
    minHeight: '260px',
    border: '2px solid #F0C040',
    boxShadow: '0 10px 25px rgba(240, 192, 64, 0.15)',
    zIndex: 3,
    transform: 'translateY(-10px)',
  },
  secondPlace: {
    width: '200px',
    minHeight: '220px',
    zIndex: 2,
  },
  thirdPlace: {
    width: '200px',
    minHeight: '200px',
    zIndex: 1,
  },
  podiumRankCircle: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    marginBottom: '12px',
    background: 'var(--gray-50)',
    border: '1px solid var(--gray-100)',
  },
  podiumStats: {
    textAlign: 'center',
    background: 'var(--gray-50)',
    padding: '4px 12px',
    borderRadius: '8px',
    width: '85%',
    border: '1px solid var(--gray-100)',
  },
  tableWrap: { overflowX: 'auto' },
  ctaRow: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1.5rem',
  },
  ctaCard: {
    width: '100%',
    maxWidth: '500px',
    textAlign: 'center',
    padding: '1.5rem',
    border: '1px dashed var(--primary)',
    background: 'rgba(239, 68, 68, 0.01)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
};

export default Leaderboard;
