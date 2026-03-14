import React from 'react';
import { formatDate, statusBadgeClass, foodTypeEmoji, truncate } from '../utils/helpers';

const DonationCard = ({ donation, actions }) => {
  const {
    foodName, description, quantity, quantityUnit,
    foodType, pickupAddress, city, pickupTime,
    bestBefore, status, donorName, donorPhone,
    claimedByNgoName, createdAt,
  } = donation;

  return (
    <div style={styles.card}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <span style={styles.emoji}>{foodTypeEmoji(foodType)}</span>
          <div>
            <h3 style={styles.foodName}>{foodName}</h3>
            {donorName && (
              <p style={styles.donor}>by {donorName}{donorPhone ? ` · ${donorPhone}` : ''}</p>
            )}
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
