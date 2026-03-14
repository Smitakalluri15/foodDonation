import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import donationService from '../services/donationService';
import { useAuth } from '../context/AuthContext';
import { formatDateTime, statusBadgeClass, getErrorMessage } from '../utils/helpers';
import { toast } from 'react-toastify';

const NGODashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [tab, setTab]           = useState('tasks'); // 'tasks' | 'browse'

  const fetchTasks = async () => {
    try {
      const data = await donationService.getNgoTasks();
      setTasks(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const stats = {
    total:     tasks.length,
    pending:   tasks.filter((t) => t.status === 'PENDING').length,
    assigned:  tasks.filter((t) => t.status === 'ASSIGNED').length,
    completed: tasks.filter((t) => t.status === 'COMPLETED').length,
  };

  return (
    <div className="page">
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>NGO Dashboard</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            {user?.orgName || user?.name} — Managing food distribution
          </p>
        </div>
        <Link to="/available-food" className="btn btn-primary">
          Browse Available Food
        </Link>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon blue">📋</div>
          <div><div className="stat-label">Total Claims</div><div className="stat-value">{stats.total}</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber">⏳</div>
          <div><div className="stat-label">Awaiting Pickup</div><div className="stat-value">{stats.pending}</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon orange">🚴</div>
          <div><div className="stat-label">In Transit</div><div className="stat-value">{stats.assigned}</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">✅</div>
          <div><div className="stat-label">Completed</div><div className="stat-value">{stats.completed}</div></div>
        </div>
      </div>

      {/* Pickup Tasks Table */}
      <div className="section-header">
        <h2 className="section-title">Claimed Donations & Pickup Tasks</h2>
      </div>

      {error   && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="loading-center"><div className="spinner" /></div>}

      {!loading && tasks.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🏢</div>
          <p>You haven't claimed any donations yet.</p>
          <Link to="/available-food" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Browse Available Food
          </Link>
        </div>
      )}

      {!loading && tasks.length > 0 && (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Food</th>
                  <th>Pickup Address</th>
                  <th>Qty</th>
                  <th>Pickup Time</th>
                  <th>Volunteer</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((t) => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 500, color: '#111827' }}>{t.foodName}</td>
                    <td>{t.pickupAddress}{t.city ? `, ${t.city}` : ''}</td>
                    <td>{t.quantity} {t.quantityUnit}</td>
                    <td>{formatDateTime(t.pickupTime)}</td>
                    <td>
                      {t.volunteerName
                        ? <span style={{ color: '#16a34a', fontWeight: 500 }}>{t.volunteerName}</span>
                        : <span style={{ color: '#9ca3af', fontSize: '13px' }}>Not assigned yet</span>
                      }
                    </td>
                    <td>
                      <span className={`badge ${statusBadgeClass(t.status)}`}>{t.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem',
  },
  heading: { fontSize: '26px', fontWeight: 700, marginBottom: '4px' },
};

export default NGODashboard;
