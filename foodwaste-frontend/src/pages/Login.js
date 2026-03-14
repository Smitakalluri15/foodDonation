import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { getErrorMessage } from '../utils/helpers';

const Login = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [form, setForm]       = useState({ email: '', password: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await authService.login(form.email, form.password);
      login(data, data.token);
      const redirects = { DONOR: '/donor', NGO: '/ngo', VOLUNTEER: '/volunteer' };
      navigate(redirects[data.role] || '/');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>🌿 FoodShare</div>
        <h2 style={styles.title}>Welcome back</h2>
        <p style={styles.sub}>Sign in to your account</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={submit}>
          <div className="form-group">
            <label>Email address</label>
            <input
              name="email" type="email" className="form-control"
              placeholder="you@example.com"
              value={form.email} onChange={handle} required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              name="password" type="password" className="form-control"
              placeholder="••••••••"
              value={form.password} onChange={handle} required
            />
          </div>
          <button
            type="submit" className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem', padding: '0.65rem' }}
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        {/* Quick demo logins */}
        <div style={styles.demo}>
          <p style={styles.demoLabel}>Quick demo login:</p>
          <div style={styles.demoBtns}>
            {[
              { role: 'DONOR',     email: 'donor@demo.com',     path: '/donor' },
              { role: 'NGO',       email: 'ngo@demo.com',       path: '/ngo' },
              { role: 'VOLUNTEER', email: 'volunteer@demo.com', path: '/volunteer' },
            ].map((d) => (
              <button
                key={d.role}
                style={styles.demoBtn}
                onClick={() => setForm({ email: d.email, password: 'demo1234' })}
              >
                {d.role}
              </button>
            ))}
          </div>
        </div>

        <p style={styles.switchText}>
          Don't have an account? <Link to="/register" style={styles.link}>Register here</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: 'calc(100vh - 64px)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', padding: '2rem',
    background: '#fff1f2',
  },
  card: {
    background: '#fff', borderRadius: '16px', padding: '2.5rem',
    width: '100%', maxWidth: '420px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    border: '1px solid #e5e7eb',
  },
  logo:  { fontSize: '22px', fontWeight: 800, color: '#ef4444', marginBottom: '1.25rem' },
  title: { fontSize: '22px', fontWeight: 700, marginBottom: '4px' },
  sub:   { color: '#9ca3af', fontSize: '14px', marginBottom: '1.5rem' },
  demo:  { margin: '1.25rem 0 0', padding: '0.85rem', background: '#f9fafb', borderRadius: '8px' },
  demoLabel: { fontSize: '12px', color: '#9ca3af', marginBottom: '0.5rem' },
  demoBtns: { display: 'flex', gap: '6px' },
  demoBtn: {
    flex: 1, padding: '5px', fontSize: '12px', fontWeight: '600',
    background: '#fee2e2', color: '#b91c1c', border: 'none',
    borderRadius: '6px', cursor: 'pointer',
  },
  switchText: { textAlign: 'center', fontSize: '13px', color: '#6b7280', marginTop: '1.25rem' },
  link: { color: '#ef4444', fontWeight: '500' },
};

export default Login;
