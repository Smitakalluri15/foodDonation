import React, { useEffect, useState } from 'react';
import donationService from '../services/donationService';
import { formatDateTime, statusBadgeClass, getErrorMessage } from '../utils/helpers';
import { toast } from 'react-toastify';

const PickupTasks = () => {
  const [tasks, setTasks]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [accepting, setAccepting] = useState(null);
  const [error, setError]       = useState('');
  const [cityFilter, setCityFilter] = useState('');

  const fetchTasks = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await donationService.getOpenTasks();
      setTasks(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const handleWsAlert = (e) => {
      const data = e.detail;
      if (data && ['DONATION_CLAIMED', 'TASK_ACCEPTED'].includes(data.type)) {
        fetchTasks(true); // Silent reload in the background
      }
    };

    window.addEventListener('plateful-ws-alert', handleWsAlert);
    return () => {
      window.removeEventListener('plateful-ws-alert', handleWsAlert);
    };
  }, []);

  const handleAccept = async (taskId) => {
    if (!window.confirm('Accept this pickup task?')) return;
    setAccepting(taskId);
    try {
      await donationService.acceptTask(taskId);
      toast.success('Task accepted! Check your dashboard.');
      fetchTasks();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setAccepting(null);
    }
  };

  const cities = [...new Set(tasks.map((t) => t.city).filter(Boolean))];

  const filtered = cityFilter
    ? tasks.filter((t) => t.city?.toLowerCase().includes(cityFilter.toLowerCase()))
    : tasks;

  return (
    <div className="page">
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>Open Pickup Tasks</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            {filtered.length} task{filtered.length !== 1 ? 's' : ''} waiting for a volunteer
          </p>
        </div>
        <button className="btn btn-secondary" onClick={fetchTasks}>↻ Refresh</button>
      </div>

      {/* City filter */}
      <div style={styles.filterRow}>
        <select
          className="form-control"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          style={{ maxWidth: '200px' }}
        >
          <option value="">All Cities</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {cityFilter && (
          <button className="btn btn-secondary" onClick={() => setCityFilter('')}>
            Clear
          </button>
        )}
      </div>

      {error   && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="loading-center"><div className="spinner" /></div>}

      {!loading && filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🚴</div>
          <p>No open tasks right now. Check back soon!</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.map((task) => (
          <div key={task.id} style={styles.taskCard}>
            {/* Left */}
            <div style={styles.taskLeft}>
              <div style={styles.taskBadge}>🛵</div>
              <div style={{ flex: 1 }}>
                <div style={styles.taskTitle}>{task.foodName}</div>
                <div style={styles.taskRow}>
                  <span style={styles.chip}>📦 {task.quantity} {task.quantityUnit}</span>
                  {task.city && <span style={styles.chip}>📍 {task.city}</span>}
                  <span className={`badge ${statusBadgeClass(task.status)}`}>{task.status}</span>
                </div>
                <div style={styles.taskDetail}>
                  <span>📮 Pickup: {task.pickupAddress}</span>
                </div>
                <div style={styles.taskDetail}>
                  <span>🏢 NGO: {task.ngoName}</span>
                  {task.pickupTime && (
                    <span style={{ marginLeft: '1rem' }}>🕐 {formatDateTime(task.pickupTime)}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Right — Accept button */}
            <div style={styles.taskRight}>
              <button
                className="btn btn-primary"
                onClick={() => handleAccept(task.id)}
                disabled={accepting === task.id}
                style={{ whiteSpace: 'nowrap' }}
              >
                {accepting === task.id ? 'Accepting…' : '✋ Accept Task'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem',
  },
  heading:   { fontSize: '26px', fontWeight: 700, marginBottom: '4px' },
  filterRow: { display: 'flex', gap: '10px', marginBottom: '1.5rem', alignItems: 'center' },
  taskCard: {
    background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb',
    padding: '1.25rem', display: 'flex',
    justifyContent: 'space-between', alignItems: 'center',
    gap: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    flexWrap: 'wrap',
  },
  taskLeft:  { display: 'flex', gap: '14px', alignItems: 'flex-start', flex: 1, minWidth: '260px' },
  taskBadge: {
    width: '44px', height: '44px', borderRadius: '10px',
    background: '#dcfce7', display: 'flex', alignItems: 'center',
    justifyContent: 'center', fontSize: '22px', flexShrink: 0,
  },
  taskTitle: { fontWeight: 600, fontSize: '16px', color: '#111827', marginBottom: '6px' },
  taskRow:   { display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '6px' },
  chip: {
    background: '#f3f4f6', color: '#374151',
    fontSize: '12px', padding: '2px 8px', borderRadius: '20px',
  },
  taskDetail: { fontSize: '13px', color: '#6b7280', marginBottom: '3px' },
  taskRight: { flexShrink: 0 },
};

export default PickupTasks;
