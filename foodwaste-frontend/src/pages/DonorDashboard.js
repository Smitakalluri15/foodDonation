import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import donationService from '../services/donationService';
import DonationCard from '../components/DonationCard';
import PointsCard from '../components/PointsCard';
import PointsHistory from '../components/PointsHistory';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/helpers';
import { toast } from 'react-toastify';
import API from '../services/api';

const Confetti = () => {
  const particles = Array.from({ length: 45 });
  return (
    <div className="confetti-container">
      <style>{`
        .confetti-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          pointer-events: none;
          z-index: 9999;
          overflow: hidden;
          animation: fade-out 3s forwards;
        }
        .confetti-particle {
          position: absolute;
          top: -10px;
          left: var(--left);
          width: var(--size);
          height: var(--size);
          background-color: var(--color);
          border-radius: 4px;
          transform: rotate(var(--rotation));
          animation: fall 2.5s var(--delay) cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        @keyframes fall {
          0% {
            top: -10px;
            transform: rotate(var(--rotation)) translateY(0) translateX(0);
            opacity: 1;
          }
          100% {
            top: 100vh;
            transform: rotate(calc(var(--rotation) + 720deg)) translateX(var(--drift));
            opacity: 0;
          }
        }
        @keyframes fade-out {
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
      {particles.map((_, i) => {
        const left = `${Math.random() * 100}%`;
        const delay = `${Math.random() * 0.8}s`;
        const size = `${Math.random() * 8 + 6}px`;
        const color = ['#f43f5e', '#3b82f6', '#10b981', '#eab308', '#a855f7', '#ec4899'][Math.floor(Math.random() * 6)];
        const rotation = `${Math.random() * 360}deg`;
        const drift = `${Math.random() * 200 - 100}px`;

        const style = {
          '--left': left,
          '--delay': delay,
          '--size': size,
          '--color': color,
          '--rotation': rotation,
          '--drift': drift,
        };

        return <div key={i} className="confetti-particle" style={style} />;
      })}
    </div>
  );
};

const DonorDashboard = () => {
  const { user }               = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [pointsData, setPointsData] = useState(null);
  const [pointsLoading, setPointsLoading] = useState(true);
  const [leaderboardRank, setLeaderboardRank] = useState(null);

  const fetchLeaderboardRank = async () => {
    try {
      const response = await API.get('/leaderboard');
      const list = response.data || [];
      const found = list.find((item) => item.name?.trim() === user?.name?.trim());
      if (found) {
        setLeaderboardRank(found.rank);
      } else {
        setLeaderboardRank(null);
      }
    } catch (err) {
      console.warn('Could not fetch leaderboard data for teaser:', err);
    }
  };

  const fetchPoints = async () => {
    try {
      const response = await API.get('/donors/me/points');
      setPointsData(response.data);
    } catch (err) {
      console.warn('Could not fetch points ledger data:', err);
    } finally {
      setPointsLoading(false);
    }
  };

  const fetchDonations = async () => {
    try {
      const data = await donationService.getMyDonations();
      const sorted = [...data].sort((a, b) => {
        const isAvailA = a.status === 'AVAILABLE';
        const isAvailB = b.status === 'AVAILABLE';

        if (isAvailA && !isAvailB) return -1;
        if (!isAvailA && isAvailB) return 1;

        if (isAvailA && isAvailB) {
          const timeA = a.bestBefore ? new Date(a.bestBefore).getTime() : Infinity;
          const timeB = b.bestBefore ? new Date(b.bestBefore).getTime() : Infinity;
          return timeA - timeB;
        }

        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });
      setDonations(sorted);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
    fetchPoints();
    fetchLeaderboardRank();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.name]);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this donation?')) return;
    try {
      await donationService.cancelDonation(id);
      toast.success('Donation cancelled');
      fetchDonations();
      fetchPoints(); // refresh points details upon status changes
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const stats = {
    total:     donations.length,
    available: donations.filter((d) => d.status === 'AVAILABLE').length,
    claimed:   donations.filter((d) => d.status === 'CLAIMED').length,
    completed: donations.filter((d) => d.status === 'COMPLETED').length,
  };

  const isCelebrationTier =
    pointsData && (pointsData.badge === 'GOLD' || pointsData.badge === 'PLATINUM');

  return (
    <div className="page">
      <style>{`
        .leaderboard-teaser {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1.25rem;
          border-radius: 12px;
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border: 1px solid #bbf7d0;
          color: #166534;
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.2s ease-in-out;
          margin-bottom: 1.5rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }
        .leaderboard-teaser:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(22, 101, 52, 0.12);
          border-color: #86efac;
          background: linear-gradient(135deg, #f0fdf4 0%, #bbf7d0 100%);
        }
        .teaser-arrow {
          transition: transform 0.2s ease;
        }
        .leaderboard-teaser:hover .teaser-arrow {
          transform: translateX(4px);
        }
      `}</style>
      {isCelebrationTier && <Confetti />}
      <div style={styles.welcome}>
        <div>
          <h1 style={styles.heading}>Welcome, {user?.name?.split(' ')[0]} 👋</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Track and manage your food donations
          </p>
        </div>
        <Link to="/add-donation" className="btn btn-primary">+ Add Donation</Link>
      </div>

      {/* Leaderboard Teaser */}
      <Link to="/leaderboard" className="leaderboard-teaser">
        {leaderboardRank ? (
          <span>You are ranked #{leaderboardRank} on the leaderboard <span className="teaser-arrow">→</span></span>
        ) : (
          <span>Start donating to claim a spot on the leaderboard! <span className="teaser-arrow">→</span></span>
        )}
      </Link>

      {/* Points Card */}
      {!pointsLoading && pointsData && (
        <PointsCard pointsData={pointsData} />
      )}

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon green">🍽️</div>
          <div><div className="stat-label">Total Posted</div><div className="stat-value">{stats.total}</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <div><div className="stat-label">Available</div><div className="stat-value">{stats.available}</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">🏢</div>
          <div><div className="stat-label">Claimed</div><div className="stat-value">{stats.claimed}</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber">🎉</div>
          <div><div className="stat-label">Completed</div><div className="stat-value">{stats.completed}</div></div>
        </div>
      </div>

      {/* Donations list */}
      <div className="section-header">
        <h2 className="section-title">My Donations</h2>
      </div>

      {loading && <div className="loading-center"><div className="spinner" /></div>}
      {error   && <div className="alert alert-danger">{error}</div>}

      {!loading && donations.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🍱</div>
          <p>You haven't posted any donations yet.</p>
          <Link to="/add-donation" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Post your first donation
          </Link>
        </div>
      )}

      <div className="grid-3">
        {donations.map((d) => (
          <DonationCard
            key={d.id}
            donation={d}
            actions={
              d.status === 'AVAILABLE' && (
                <>
                  <Link to={`/edit-donation/${d.id}`} className="btn btn-secondary btn-sm">Edit</Link>
                  <button className="btn btn-danger btn-sm" onClick={() => handleCancel(d.id)}>
                    Cancel
                  </button>
                </>
              )
            }
          />
        ))}
      </div>

      {/* Points history */}
      {!pointsLoading && pointsData && (
        <PointsHistory history={pointsData.history || []} />
      )}
    </div>
  );
};

const styles = {
  welcome: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem',
  },
  heading: { fontSize: '26px', fontWeight: 700, marginBottom: '4px' },
};

export default DonorDashboard;
