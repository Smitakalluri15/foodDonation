import React, { useEffect, useState, useRef } from 'react';
import API from '../services/api';

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

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const response = await API.get('/notifications');
      setNotifications(response.data || []);
    } catch (err) {
      console.warn('Notifications endpoint not available, loading mocks:', err);
      // Clean mock data matching typical user interactions
      const mockList = [
        {
          id: 1,
          text: 'A volunteer has been assigned to pick up your donation of Fresh Tomatoes!',
          type: 'success',
          createdAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(), // 12 mins ago
          unread: true,
        },
        {
          id: 2,
          text: 'Your donation of Milk is expiring in 4 hours.',
          type: 'warning',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
          unread: true,
        },
        {
          id: 3,
          text: 'Welcome to FoodShare! Start sharing food waste today.',
          type: 'info',
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
          unread: false,
        },
      ];
      setNotifications(mockList);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('click', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen]);

  const handleMarkAllRead = async () => {
    try {
      await API.put('/notifications/mark-all-read');
    } catch (err) {
      console.warn('Mark all read endpoint not implemented yet:', err);
    }
    // Update local state so it responds instantly
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleToggle = () => setIsOpen((prev) => !prev);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '🔔';
    }
  };

  return (
    <div style={styles.container} ref={bellRef}>
      <button style={styles.bellBtn} onClick={handleToggle} aria-label="Notifications">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          width="22"
          height="22"
          style={{ color: '#4b5563' }}
        >
          <path d="M12 22a2.01 2.01 0 0 0 2-2h-4a2.01 2.01 0 0 0 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
        </svg>
        {unreadCount > 0 && (
          <span style={styles.badge}>{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div style={styles.dropdown}>
          <div style={styles.dropdownHeader}>
            <span style={styles.headerTitle}>Notifications</span>
            {unreadCount > 0 && (
              <button style={styles.markReadBtn} onClick={handleMarkAllRead}>
                Mark all read
              </button>
            )}
          </div>
          <div style={styles.list}>
            {notifications.length === 0 ? (
              <div style={styles.emptyState}>No notifications yet</div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} style={styles.item}>
                  <span style={styles.itemIcon}>{getNotificationIcon(n.type)}</span>
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        ...styles.itemText,
                        fontWeight: n.unread ? '700' : '400',
                      }}
                    >
                      {n.text}
                    </p>
                    <p style={styles.itemTime}>{formatRelativeTime(n.createdAt)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    display: 'inline-block',
  },
  bellBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    position: 'relative',
    padding: '6px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s',
  },
  badge: {
    position: 'absolute',
    top: '2px',
    right: '2px',
    background: '#ef4444',
    color: '#fff',
    borderRadius: '50%',
    fontSize: '9px',
    fontWeight: '700',
    width: '15px',
    height: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1.5px solid #fff',
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: '38px',
    width: '280px',
    background: '#fff',
    borderRadius: '10px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  dropdownHeader: {
    padding: '10px 14px',
    borderBottom: '1px solid #f3f4f6',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#f9fafb',
  },
  headerTitle: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#1f2937',
  },
  markReadBtn: {
    background: 'none',
    border: 'none',
    color: '#3b82f6',
    fontSize: '11px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: 0,
  },
  list: {
    maxHeight: '260px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
  },
  item: {
    padding: '10px 14px',
    borderBottom: '1px solid #f3f4f6',
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
  },
  itemIcon: {
    fontSize: '16px',
    flexShrink: 0,
    marginTop: '2px',
  },
  itemText: {
    fontSize: '12px',
    lineHeight: '1.4',
    color: '#374151',
    margin: 0,
  },
  itemTime: {
    fontSize: '10px',
    color: '#9ca3af',
    marginTop: '4px',
    margin: 0,
  },
  emptyState: {
    padding: '2rem 1rem',
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: '12.5px',
  },
};

export default NotificationBell;
