import React from 'react';

const Footer = () => (
  <footer style={styles.footer}>
    <div style={styles.inner}>
      <span>🌿 FoodShare — Reducing waste, feeding communities</span>
      <span style={styles.muted}>© {new Date().getFullYear()} All rights reserved</span>
    </div>
  </footer>
);

const styles = {
  footer: {
    background: '#fff',
    borderTop: '1px solid #e5e7eb',
    padding: '1.25rem 1.5rem',
    marginTop: 'auto',
  },
  inner: {
    maxWidth: '1200px', margin: '0 auto',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    fontSize: '13px', color: '#374151',
    flexWrap: 'wrap', gap: '0.5rem',
  },
  muted: { color: '#9ca3af' },
};

export default Footer;
