import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import donationService from '../services/donationService';
import { useAuth } from '../context/AuthContext';
import { formatDateTime, statusBadgeClass, getErrorMessage } from '../utils/helpers';
import { toast } from 'react-toastify';

const VolunteerDashboard = () => {
  const { user }             = useAuth();
  const [myTasks, setMyTasks]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState('');

  const fetchMyTasks = async () => {
    try {
      const data = await donationService.getMyTasks();
      setMyTasks(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMyTasks(); }, []);

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

  const stats = {
    total:    myTasks.length,
    active:   myTasks.filter((t) => ['ASSIGNED', 'IN_PROGRESS'].includes(t.status)).length,
    completed: myTasks.filter((t) => t.status === 'COMPLETED').length,
  };

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
            <TaskCard key={t.id} task={t} onComplete={handleComplete} />
          ))}
        </div>
      )}
    </div>
  );
};

const TaskCard = ({ task, onComplete }) => {
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
};

export default VolunteerDashboard;
