import React, { useState } from 'react';

const formatRelativeTime = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
};

const PointsHistory = ({ history = [] }) => {
  const [expanded, setExpanded] = useState(false);

  if (history.length === 0) {
    return (
      <div className="card" style={styles.container}>
        <h3 style={styles.title}>⭐️ Points Ledger History</h3>
        <div style={styles.emptyState}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🌱</div>
          <p style={{ margin: 0, fontSize: '13.5px' }}>Start donating to earn points!</p>
        </div>
      </div>
    );
  }

  const displayedHistory = expanded ? history : history.slice(0, 10);

  return (
    <div className="card" style={styles.container}>
      <h3 style={styles.title}>⭐️ Points Ledger History</h3>

      <div style={styles.timeline}>
        {displayedHistory.map((item, index) => {
          const isPositive = item.delta > 0;
          return (
            <div key={item.id || index} style={styles.timelineItem}>
              {/* Vertical line connecting entries */}
              {index < displayedHistory.length - 1 && (
                <div style={styles.timelineLine} />
              )}

              {/* Status Indicator Dot */}
              <div
                style={{
                  ...styles.timelineDot,
                  backgroundColor: isPositive ? 'var(--info, #10b981)' : 'var(--primary, #ef4444)',
                }}
              />

              {/* Content Panel */}
              <div style={styles.timelineContent}>
                <div style={styles.itemHeader}>
                  <span style={styles.reasonText}>{item.reason}</span>
                  <span
                    className="badge"
                    style={{
                      ...styles.deltaBadge,
                      backgroundColor: isPositive ? '#dcfce7' : '#fee2e2',
                      color: isPositive ? '#166534' : '#991b1b',
                    }}
                  >
                    {isPositive ? '+' : ''}
                    {item.delta} pts
                  </span>
                </div>
                <div style={styles.timeText}>
                  {formatRelativeTime(item.createdAt)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {history.length > 10 && (
        <div style={styles.expandRow}>
          <button style={styles.expandBtn} onClick={() => setExpanded((prev) => !prev)}>
            {expanded ? 'Show Less ↑' : `Show All History (${history.length} entries) ↓`}
          </button>
        </div>
      )}
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
    marginTop: '1.75rem',
  },
  title: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--gray-900)',
    marginBottom: '1.25rem',
  },
  timeline: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
    paddingLeft: '6px',
  },
  timelineItem: {
    position: 'relative',
    display: 'flex',
    gap: '16px',
    alignItems: 'flex-start',
  },
  timelineDot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    zIndex: 2,
    flexShrink: 0,
    marginTop: '6px',
    border: '2px solid #fff',
    boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
  },
  timelineLine: {
    position: 'absolute',
    left: '4px',
    top: '12px',
    bottom: '-20px',
    width: '2px',
    backgroundColor: 'var(--gray-200)',
    zIndex: 1,
  },
  timelineContent: {
    flex: 1,
    background: 'var(--gray-50)',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid var(--gray-100)',
  },
  itemHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
  },
  reasonText: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--gray-800)',
  },
  deltaBadge: {
    fontSize: '11px',
    fontWeight: '700',
    padding: '2px 8px',
    borderRadius: '20px',
    flexShrink: 0,
  },
  timeText: {
    fontSize: '10.5px',
    color: 'var(--gray-400)',
    marginTop: '4px',
  },
  emptyState: {
    padding: '2.5rem 1rem',
    textAlign: 'center',
    color: 'var(--gray-500)',
  },
  expandRow: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1.25rem',
  },
  expandBtn: {
    background: 'transparent',
    border: 'none',
    color: 'var(--primary)',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '6px 12px',
    borderRadius: '6px',
    transition: 'background-color 0.15s',
  },
};

export default PointsHistory;
