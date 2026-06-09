import React, { useEffect, useState } from 'react';
import { formatDate, statusBadgeClass, foodTypeEmoji, truncate } from '../utils/helpers';
import API from '../services/api';

const getExpiryStatus = (bestBeforeStr) => {
  if (!bestBeforeStr) return 'ok';
  const bestBefore = new Date(bestBeforeStr);
  const now = new Date();
  const diffMs = bestBefore.getTime() - now.getTime();

  if (diffMs < 0) return 'expired';

  const diffHours = diffMs / (1000 * 60 * 60);
  if (diffHours <= 6) return 'critical';
  if (diffHours <= 24) return 'warning';
  if (diffHours <= 48) return 'soon';
  return 'ok';
};

const DonationCard = ({ donation, actions }) => {
  const {
    id, foodName, description, quantity, quantityUnit,
    foodType, pickupAddress, city, pickupTime,
    bestBefore, status, donorName, donorPhone,
    claimedByNgoName, createdAt,
  } = donation;

  const [ratings, setRatings] = useState([]);
  const [ratingsLoading, setRatingsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchRatings = async () => {
      try {
        const response = await API.get(`/ratings/donation/${id}`);
        if (active) {
          setRatings(response.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch ratings for card', err);
      } finally {
        if (active) setRatingsLoading(false);
      }
    };
    if (id) {
      fetchRatings();
    } else {
      setRatingsLoading(false);
    }
    return () => {
      active = false;
    };
  }, [id]);

  const ratingCount = ratings.length;
  const ratingAverage = ratingCount > 0
    ? (ratings.reduce((sum, r) => sum + r.score, 0) / ratingCount).toFixed(1)
    : null;

  const renderExpiryBadge = () => {
    const expStatus = getExpiryStatus(bestBefore);
    if (expStatus === 'ok') return null;

    let badgeClass = '';
    let label = '';

    if (expStatus === 'expired') {
      badgeClass = 'badge-red';
      label = 'Expired';
    } else if (expStatus === 'critical') {
      const now = new Date();
      const diffMs = new Date(bestBefore).getTime() - now.getTime();
      const remainingHours = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60)));
      badgeClass = 'badge-red';
      label = `Expires in ${remainingHours} hour${remainingHours !== 1 ? 's' : ''}`;
    } else if (expStatus === 'warning') {
      badgeClass = 'badge-orange';
      label = 'Expires tomorrow';
    } else if (expStatus === 'soon') {
      badgeClass = 'badge-amber';
      label = 'Expiring soon';
    }

    return (
      <span className={`badge ${badgeClass}`} style={{ fontSize: '11px', fontWeight: '600', marginTop: '4px', display: 'inline-flex' }}>
        ⏳ {label}
      </span>
    );
  };

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <span style={styles.emoji}>{foodTypeEmoji(foodType)}</span>
          <div>
            <h3 style={styles.foodName}>{foodName}</h3>
            <div style={{ marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
              {ratingsLoading ? (
                <span style={{ fontSize: '11px', color: '#9ca3af' }}>Loading rating...</span>
              ) : ratingAverage ? (
                <span style={{ fontSize: '12.5px', color: '#eab308', fontWeight: '700' }}>
                  ★ {ratingAverage} <span style={{ color: '#6b7280', fontWeight: '400', fontSize: '11px' }}>({ratingCount} rating{ratingCount !== 1 ? 's' : ''})</span>
                </span>
              ) : (
                <span style={{ fontSize: '11.5px', color: '#9ca3af', fontStyle: 'italic' }}>No ratings yet</span>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
              {renderExpiryBadge()}
              {donorName && (
                <p style={styles.donor}>by {donorName}{donorPhone ? ` · ${donorPhone}` : ''}</p>
              )}
            </div>
          </div>
        </div>
        <span className={`badge ${statusBadgeClass(status)}`}>{status}</span>
      </div>

      {/* Body */}
      <div style={styles.body}>
        {description && (
          <p style={styles.description}>{truncate(description)}</p>
        )}
        <div style={styles.infoGrid}>
          <InfoRow icon="📦" label="Quantity" value={`${quantity} ${quantityUnit || ''}`} />
          <InfoRow icon="📍" label="Pickup"   value={`${pickupAddress}${city ? `, ${city}` : ''}`} />
          {pickupTime && (
            <InfoRow icon="🕐" label="Pickup time" value={formatDate(pickupTime)} />
          )}
          {bestBefore && (
            <InfoRow icon="⏳" label="Best before" value={formatDate(bestBefore)} />
          )}
          {claimedByNgoName && (
            <InfoRow icon="🏢" label="Claimed by" value={claimedByNgoName} />
          )}
          <InfoRow icon="📅" label="Posted" value={formatDate(createdAt)} />
        </div>
      </div>

      {/* Actions */}
      {actions && (
        <div style={styles.actions}>
          {actions}
        </div>
      )}
    </div>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
    <span style={{ fontSize: '14px', flexShrink: 0 }}>{icon}</span>
    <span style={{ fontSize: '13px', color: '#6b7280', flexShrink: 0 }}>{label}:</span>
    <span style={{ fontSize: '13px', color: '#374151', fontWeight: '500' }}>{value}</span>
  </div>
);

const styles = {
  card: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.07)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    padding: '1.1rem 1.25rem 0.75rem',
    borderBottom: '1px solid #f3f4f6',
  },
  titleRow: { display: 'flex', gap: '10px', alignItems: 'flex-start' },
  emoji:    { fontSize: '28px', lineHeight: 1 },
  foodName: { fontSize: '15px', fontWeight: '600', color: '#111827', marginBottom: '2px' },
  donor:    { fontSize: '12px', color: '#9ca3af' },
  body: { padding: '0.85rem 1.25rem', flex: 1 },
  description: {
    fontSize: '13px', color: '#6b7280',
    marginBottom: '0.75rem', lineHeight: '1.5',
  },
  infoGrid: { display: 'flex', flexDirection: 'column', gap: '5px' },
  actions: {
    padding: '0.85rem 1.25rem',
    borderTop: '1px solid #f3f4f6',
    display: 'flex', gap: '8px', flexWrap: 'wrap',
  },
};

export default DonationCard;
