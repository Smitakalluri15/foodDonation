import React, { useEffect, useState } from 'react';
import { connectFeed, fetchRecentFeed } from '../services/feedService';

const LiveFeed = () => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // load recent
    fetchRecentFeed()
      .then((data) => setEvents(data || []))
      .catch(() => setError('Unable to load recent activity'));

    // subscribe live
    const disconnect = connectFeed((ev) => {
      setEvents((prev) => [ev, ...prev].slice(0, 50));
    });
    return () => disconnect();
  }, []);

  return (
    <div className="page" style={{ maxWidth: '900px' }}>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ fontWeight: 800, fontSize: '20px', marginBottom: '6px' }}>Live Rescue Feed</div>
        <p style={{ color: '#6b7280', margin: 0 }}>Real-time updates as donations move from posted to delivered.</p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {events.map((e) => (
          <div key={`${e.id}-${e.createdAt}`} className="card" style={{ padding: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
              <div>
                <div style={{ fontWeight: 700 }}>{formatTitle(e.type)}</div>
                <div style={{ color: '#6b7280', fontSize: '14px', marginTop: '4px' }}>{e.message}</div>
              </div>
              <div style={{ fontSize: '12px', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                {new Date(e.createdAt).toLocaleString()}
              </div>
            </div>
            {e.city && <div style={{ color: '#ef4444', fontSize: '12px', marginTop: '6px' }}>📍 {e.city}</div>}
          </div>
        ))}
        {events.length === 0 && !error && (
          <div className="card">No activity yet. Post a donation to see live updates.</div>
        )}
      </div>
    </div>
  );
};

const formatTitle = (type) => type?.replace(/_/g, ' ') || 'Activity';

export default LiveFeed;
