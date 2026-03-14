import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  const dashboardLink = () => {
    if (!user) return '/register';
    const map = { DONOR: '/donor', NGO: '/ngo', VOLUNTEER: '/volunteer', ADMIN: '/admin' };
    return map[user.role] || '/';
  };

  return (
    <div>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.heroBadge}>🌿 Fighting hunger, reducing waste</div>
          <h1 style={styles.heroTitle}>
            Surplus food finds its way<br />
            <span style={styles.heroGreen}>to those who need it</span>
          </h1>
          <p style={styles.heroSub}>
            Connecting donors, NGOs, and volunteers to rescue food before it goes to waste.
            Simple, transparent, and impactful.
          </p>
          <div style={styles.heroBtns}>
            {isAuthenticated() ? (
              <Link to={dashboardLink()} className="btn btn-primary btn-lg">
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
                <Link to="/login"    className="btn btn-outline btn-lg">Sign In</Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={styles.statsSection}>
        <div className="container">
          <div className="grid-4">
            {[
              { icon: '🍱', value: '12,400+', label: 'Meals Saved' },
              { icon: '🏢', value: '85+',     label: 'NGOs Onboarded' },
              { icon: '🚴', value: '320+',    label: 'Volunteers Active' },
              { icon: '🌍', value: '18',      label: 'Cities Covered' },
            ].map((s) => (
              <div key={s.label} style={styles.statBox}>
                <div style={styles.statEmoji}>{s.icon}</div>
                <div style={styles.statVal}>{s.value}</div>
                <div style={styles.statLbl}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={styles.howSection}>
        <div className="container">
          <h2 style={styles.sectionTitle}>How it works</h2>
          <div className="grid-3" style={{ marginTop: '2rem' }}>
            {[
              { step: '1', icon: '🍽️', role: 'Donors',     color: '#dcfce7', text: 'Restaurants, hotels, and households post surplus food with pickup details.' },
              { step: '2', icon: '🏢', role: 'NGOs',        color: '#dbeafe', text: 'NGOs browse available donations and claim what they can distribute.' },
              { step: '3', icon: '🚴', role: 'Volunteers',  color: '#fef9c3', text: 'Volunteers accept pickup tasks and deliver food to NGO collection points.' },
            ].map((item) => (
              <div key={item.role} style={{ ...styles.howCard, borderTop: `4px solid ${item.color}` }}>
                <div style={{ ...styles.stepBadge, background: item.color }}>{item.step}</div>
                <div style={styles.howIcon}>{item.icon}</div>
                <h3 style={styles.howRole}>{item.role}</h3>
                <p style={styles.howText}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!isAuthenticated() && (
        <section style={styles.cta}>
          <div style={styles.ctaInner}>
            <h2 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '0.75rem' }}>
              Ready to make a difference?
            </h2>
            <p style={{ color: '#e5e7eb', marginBottom: '1.5rem', fontSize: '16px' }}>
              Join as a donor, NGO, or volunteer — it takes less than a minute.
            </p>
            <Link to="/register" className="btn btn-lg" style={styles.ctaBtn}>
              Create Free Account →
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

const styles = {
  hero: {
    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #f0fdf4 100%)',
    padding: '5rem 1.5rem',
    textAlign: 'center',
  },
  heroInner: { maxWidth: '680px', margin: '0 auto' },
  heroBadge: {
    display: 'inline-block',
    background: '#fff', border: '1px solid #bbf7d0',
    borderRadius: '20px', padding: '4px 16px',
    fontSize: '13px', color: '#16a34a', fontWeight: '500',
    marginBottom: '1.25rem',
  },
  heroTitle: { fontSize: '44px', fontWeight: 800, lineHeight: 1.15, color: '#111827', marginBottom: '1rem' },
  heroGreen: { color: '#16a34a' },
  heroSub: { fontSize: '17px', color: '#6b7280', lineHeight: 1.7, marginBottom: '2rem' },
  heroBtns: { display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' },

  statsSection: { padding: '3rem 0', background: '#fff', borderBottom: '1px solid #f3f4f6' },
  statBox: { textAlign: 'center', padding: '1rem' },
  statEmoji: { fontSize: '32px', marginBottom: '0.5rem' },
  statVal:  { fontSize: '28px', fontWeight: 800, color: '#111827' },
  statLbl:  { fontSize: '13px', color: '#9ca3af', marginTop: '2px' },

  howSection: { padding: '4rem 0', background: '#f9fafb' },
  sectionTitle: { textAlign: 'center', fontSize: '28px', fontWeight: 700, color: '#111827' },
  howCard: {
    background: '#fff', borderRadius: '12px', padding: '1.75rem',
    border: '1px solid #e5e7eb', position: 'relative',
  },
  stepBadge: {
    width: '28px', height: '28px', borderRadius: '50%',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, fontSize: '14px', color: '#374151', marginBottom: '1rem',
  },
  howIcon: { fontSize: '36px', marginBottom: '0.75rem' },
  howRole: { fontSize: '18px', fontWeight: 700, marginBottom: '0.5rem', color: '#111827' },
  howText: { fontSize: '14px', color: '#6b7280', lineHeight: 1.7 },

  cta: { background: '#16a34a', padding: '4rem 1.5rem', textAlign: 'center', color: '#fff' },
  ctaInner: { maxWidth: '560px', margin: '0 auto' },
  ctaBtn: { background: '#fff', color: '#16a34a', fontWeight: 700 },
};

export default Home;
