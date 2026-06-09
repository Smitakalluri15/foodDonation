import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import donationService from '../services/donationService';
import { useAuth } from '../context/AuthContext';
import { formatDateTime, statusBadgeClass, getErrorMessage } from '../utils/helpers';
import { toast } from 'react-toastify';
import StarRating from '../components/StarRating';

const VolunteerDashboard = () => {
  const { user, token, login, logout } = useAuth();
  const [myTasks, setMyTasks]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');
  const [ratingTarget, setRatingTarget] = useState(null);
  const [fetchingDonor, setFetchingDonor] = useState(false);
  const [checking, setChecking] = useState(false);

  const fetchMyTasks = async () => {
    if (user && user.role === 'VOLUNTEER' && user.approved === false) {
      setLoading(false);
      return;
    }
    try {
      const data = await donationService.getMyTasks();
      setMyTasks(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { fetchMyTasks(); }, []);

  const handleCheckStatus = async () => {
    setChecking(true);
    try {
      const data = await donationService.getMyTasks();
      login({ ...user, approved: true }, token);
      setMyTasks(data);
      toast.success('Your volunteer profile has been approved! Welcome aboard 🚴');
    } catch (err) {
      const msg = getErrorMessage(err);
      if (msg.includes('pending approval') || msg.includes('administrator')) {
        toast.info('Verification in progress. We will notify you once approved!');
      } else {
        toast.error(msg || 'Unable to verify status. Please try again.');
      }
    } finally {
      setChecking(false);
    }
  };

  const handleComplete = async (taskId) => {
    if (!window.confirm('Mark this task as completed?')) return;
    try {
      await donationService.completeTask(taskId);
      toast.success('Task marked as completed!');
      fetchMyTasks();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleOpenRating = async (donationId) => {
    setFetchingDonor(true);
    try {
      const data = await donationService.getById(donationId);
      setRatingTarget({
        donationId,
        rateeId: data.donorId,
        rateeName: data.donorName,
      });
    } catch (err) {
      toast.error('Unable to retrieve donor details for rating.');
    } finally {
      setFetchingDonor(false);
    }
  };

  const stats = {
    total:    myTasks.length,
    active:   myTasks.filter((t) => ['ASSIGNED', 'IN_PROGRESS'].includes(t.status)).length,
    completed: myTasks.filter((t) => t.status === 'COMPLETED').length,
  };

  if (user && user.role === 'VOLUNTEER' && user.approved === false) {
    return (
      <div style={styles.pendingContainer}>
        <PendingStyles />
        <div style={styles.pendingCard}>
          <div style={styles.pendingIconContainer}>
            <div style={styles.pulseContainer}>
              <div className="pulse-ring" />
              <div style={styles.pulseDot}>🚴</div>
            </div>
          </div>
          <h2 style={styles.pendingTitle}>Profile Under Review</h2>
          <p style={styles.pendingSub}>
            Hi <strong>{user.name}</strong>, thank you for joining Plateful! 💚
          </p>
          <p style={styles.pendingDescription}>
            Every volunteer profile is manually reviewed by our administration team to ensure safety and quality coordination for food distribution. This typically takes up to 24 hours.
          </p>
          
          <div style={styles.detailsBox}>
            <div style={styles.detailsTitle}>Submitted Information</div>
            <div style={styles.detailsRow}>
              <span style={styles.detailsLabel}>Email:</span>
              <span style={styles.detailsValue}>{user.email}</span>
            </div>
            {user.city && (
              <div style={styles.detailsRow}>
                <span style={styles.detailsLabel}>City:</span>
                <span style={styles.detailsValue}>{user.city}</span>
              </div>
            )}
            <div style={styles.detailsRow}>
              <span style={styles.detailsLabel}>Verification:</span>
              <span style={{ ...styles.detailsValue, color: '#eab308', fontWeight: 700 }}>
                ⏳ Pending Admin Approval
              </span>
            </div>
          </div>

          <div style={styles.pendingActions}>
            <button 
              className="btn btn-primary" 
              style={styles.pendingBtn}
              onClick={handleCheckStatus}
              disabled={checking}
            >
              {checking ? 'Verifying Status...' : 'Check Approval Status ↻'}
            </button>
            <button 
              className="btn btn-secondary" 
              style={styles.pendingBtnSec}
              onClick={logout}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>Volunteer Dashboard</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            Welcome, {user?.name} — Thank you for making a difference 💚
          </p>
        </div>
        <Link to="/pickup-tasks" className="btn btn-primary">
          Browse Open Tasks
        </Link>
      </div>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-icon blue">📋</div>
          <div><div className="stat-label">Total Tasks</div><div className="stat-value">{stats.total}</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber">🚴</div>
          <div><div className="stat-label">Active</div><div className="stat-value">{stats.active}</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">🎉</div>
          <div><div className="stat-label">Completed</div><div className="stat-value">{stats.completed}</div></div>
        </div>
      </div>

      {/* My Tasks */}
      <div className="section-header">
        <h2 className="section-title">My Pickup Tasks</h2>
      </div>

      {error   && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="loading-center"><div className="spinner" /></div>}

      {!loading && myTasks.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🚴</div>
          <p>You haven't accepted any tasks yet.</p>
          <Link to="/pickup-tasks" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            See open tasks
          </Link>
        </div>
      )}

      {!loading && myTasks.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {myTasks.map((t) => (
            <TaskCard
              key={t.id}
              task={t}
              onComplete={handleComplete}
              onRate={handleOpenRating}
              fetchingDonor={fetchingDonor}
            />
          ))}
        </div>
      )}

      {/* Star Rating Modal */}
      {ratingTarget && (
        <div style={styles.modalOverlay} onClick={() => setRatingTarget(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Rate Donation</h3>
              <button
                style={styles.modalCloseBtn}
                onClick={() => setRatingTarget(null)}
              >
                &times;
              </button>
            </div>
            <div style={{ padding: '1.25rem' }}>
              <StarRating
                donationId={ratingTarget.donationId}
                rateeId={ratingTarget.rateeId}
                rateeName={ratingTarget.rateeName}
                onSuccess={fetchMyTasks}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const TaskCard = ({ task, onComplete, onRate, fetchingDonor }) => {
  const isActive = ['ASSIGNED', 'IN_PROGRESS'].includes(task.status);
  return (
    <div style={styles.taskCard}>
      <div style={styles.taskLeft}>
        <div style={styles.taskIcon}>🛵</div>
        <div>
          <div style={styles.taskFood}>{task.foodName}</div>
          <div style={styles.taskMeta}>
            📍 {task.pickupAddress}{task.city ? `, ${task.city}` : ''}
          </div>
          <div style={styles.taskMeta}>
            🏢 {task.ngoName} &nbsp;·&nbsp; 📦 {task.quantity} {task.quantityUnit}
          </div>
          {task.pickupTime && (
            <div style={styles.taskMeta}>🕐 {formatDateTime(task.pickupTime)}</div>
          )}
        </div>
      </div>
      <div style={styles.taskRight}>
        <span className={`badge ${statusBadgeClass(task.status)}`}>{task.status}</span>
        {isActive && (
          <button
            className="btn btn-primary btn-sm"
            style={{ marginTop: '8px' }}
            onClick={() => onComplete(task.id)}
          >
            Mark Complete ✓
          </button>
        )}
        {task.status === 'COMPLETED' && (
          <button
            className="btn btn-outline btn-sm"
            style={{ marginTop: '8px' }}
            onClick={() => onRate(task.donationId)}
            disabled={fetchingDonor}
          >
            ⭐️ Rate Donation
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem',
  },
  heading: { fontSize: '26px', fontWeight: 700, marginBottom: '4px' },
  taskCard: {
    background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb',
    padding: '1.1rem 1.25rem', display: 'flex',
    justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  taskLeft:  { display: 'flex', gap: '12px', alignItems: 'flex-start', flex: 1 },
  taskIcon:  { fontSize: '26px', flexShrink: 0 },
  taskFood:  { fontWeight: 600, fontSize: '15px', color: '#111827', marginBottom: '4px' },
  taskMeta:  { fontSize: '13px', color: '#6b7280', marginBottom: '2px' },
  taskRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 },
  modalOverlay: {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
    display: 'flex', justifyContent: 'center', alignItems: 'center',
    zIndex: 2000,
  },
  modalContent: {
    background: '#fff', borderRadius: '12px', width: '90%', maxWidth: '400px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.15)', overflow: 'hidden',
    animation: 'modal-slide-up 0.2s ease-out',
  },
  modalHeader: {
    padding: '1rem 1.25rem', borderBottom: '1px solid #e5e7eb',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
  },
  modalTitle: { fontSize: '16px', fontWeight: 700, color: '#111827' },
  modalCloseBtn: {
    background: 'transparent', border: 'none', fontSize: '24px',
    color: '#9ca3af', cursor: 'pointer', lineStyle: 'none',
  },
  pendingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    fontFamily: "'Nunito', sans-serif",
    padding: '2rem 1rem',
  },
  pendingCard: {
    background: '#FFFFFF',
    borderRadius: '24px',
    padding: '40px 32px',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 8px 32px rgba(255, 212, 0, 0.12)',
    border: '1.5px solid #FFEE99',
    textAlign: 'center',
  },
  pendingIconContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  pulseContainer: {
    position: 'relative',
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseDot: {
    position: 'relative',
    zIndex: 2,
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: '#FFFAE5',
    border: '1.5px solid #FFEE99',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
  },
  pendingTitle: {
    fontSize: '24px',
    fontWeight: 800,
    color: '#2C1A00',
    marginBottom: '8px',
  },
  pendingSub: {
    fontSize: '15px',
    color: '#7a6200',
    marginBottom: '16px',
  },
  pendingDescription: {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.6',
    marginBottom: '28px',
  },
  detailsBox: {
    backgroundColor: '#FFFAE5',
    border: '1.5px solid #FFEE99',
    borderRadius: '16px',
    padding: '16px 20px',
    textAlign: 'left',
    marginBottom: '28px',
  },
  detailsTitle: {
    fontSize: '12px',
    fontWeight: 800,
    color: '#7a6200',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '10px',
  },
  detailsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '4px 0',
    fontSize: '13px',
  },
  detailsLabel: {
    color: '#7a6200',
    fontWeight: 600,
  },
  detailsValue: {
    color: '#2C1A00',
    fontWeight: 600,
  },
  pendingActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  pendingBtn: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    fontWeight: 700,
    borderRadius: '50px',
    fontFamily: "'Nunito', sans-serif",
  },
  pendingBtnSec: {
    width: '100%',
    padding: '12px',
    fontSize: '14px',
    fontWeight: 700,
    borderRadius: '50px',
    backgroundColor: '#fff',
    border: '1.5px solid #FFEE99',
    color: '#7a6200',
    fontFamily: "'Nunito', sans-serif",
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  },
};

const PendingStyles = () => (
  <style>{`
    @keyframes pulse-ring {
      0% { transform: scale(0.95); opacity: 0.5; }
      50% { transform: scale(1.1); opacity: 0.3; }
      100% { transform: scale(0.95); opacity: 0.5; }
    }
    .pulse-ring {
      position: absolute;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background-color: #FFFAE5;
      border: 2px dashed #FFD400;
      animation: pulse-ring 3s infinite ease-in-out;
      z-index: 1;
    }
  `}</style>
);

export default VolunteerDashboard;
