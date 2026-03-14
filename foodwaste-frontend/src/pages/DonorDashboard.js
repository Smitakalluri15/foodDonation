import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import donationService from '../services/donationService';
import DonationCard from '../components/DonationCard';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/helpers';
import { toast } from 'react-toastify';

const DonorDashboard = () => {
  const { user }               = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');

  const fetchDonations = async () => {
    try {
      const data = await donationService.getMyDonations();
      setDonations(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDonations(); }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this donation?')) return;
    try {
      await donationService.cancelDonation(id);
      toast.success('Donation cancelled');
      fetchDonations();
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

  return (
    <div className="page">
      <div style={styles.welcome}>
        <div>
          <h1 style={styles.heading}>Welcome, {user?.name?.split(' ')[0]} 👋</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Track and manage your food donations
          </p>
        </div>
        <Link to="/add-donation" className="btn btn-primary">+ Add Donation</Link>
      </div>

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
