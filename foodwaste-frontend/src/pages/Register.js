import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { getErrorMessage } from '../utils/helpers';

const Register = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    phone: '', address: '', city: '', role: 'DONOR',
    orgName: '', registrationNumber: '',
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match');
    }
    setLoading(true);
    try {
      const { confirmPassword, ...payload } = form;
      const data = await authService.register(payload);
      login(data, data.token);
      const redirects = { DONOR: '/donor', NGO: '/ngo', VOLUNTEER: '/volunteer' };
      navigate(redirects[data.role] || '/');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const isNgo = form.role === 'NGO';

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}>🌿 FoodShare</div>
        <h2 style={styles.title}>Create your account</h2>
        <p style={styles.sub}>Join the community — it's free</p>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={submit}>
          {/* Role selector */}
          <div style={styles.roleRow}>
            {['DONOR', 'NGO', 'VOLUNTEER'].map((r) => (
              <button
                type="button" key={r}
                style={{ ...styles.roleBtn, ...(form.role === r ? styles.roleBtnActive : {}) }}
                onClick={() => setForm({ ...form, role: r })}
              >
                {r === 'DONOR' ? '🍽️' : r === 'NGO' ? '🏢' : '🚴'} {r}
              </button>
            ))}
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Full Name *</label>
              <input name="name" className="form-control" placeholder="John Doe"
                value={form.name} onChange={handle} required />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input name="phone" className="form-control" placeholder="+91 9999999999"
                value={form.phone} onChange={handle} />
            </div>
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input name="email" type="email" className="form-control" placeholder="you@example.com"
              value={form.email} onChange={handle} required />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Password *</label>
              <input name="password" type="password" className="form-control" placeholder="Min 6 chars"
                value={form.password} onChange={handle} required />
            </div>
            <div className="form-group">
              <label>Confirm Password *</label>
              <input name="confirmPassword" type="password" className="form-control" placeholder="••••••••"
                value={form.confirmPassword} onChange={handle} required />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>City</label>
              <input name="city" className="form-control" placeholder="Hyderabad"
                value={form.city} onChange={handle} />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input name="address" className="form-control" placeholder="Street address"
                value={form.address} onChange={handle} />
            </div>
          </div>

          {/* NGO-only fields */}
          {isNgo && (
            <div style={styles.ngoSection}>
              <p style={styles.ngoLabel}>NGO Details</p>
              <div className="form-group">
                <label>Organisation Name *</label>
                <input name="orgName" className="form-control" placeholder="Helping Hands Foundation"
                  value={form.orgName} onChange={handle} required={isNgo} />
              </div>
              <div className="form-group">
                <label>Registration Number</label>
                <input name="registrationNumber" className="form-control" placeholder="NGO/REG/12345"
                  value={form.registrationNumber} onChange={handle} />
              </div>
            </div>
          )}

          <button
            type="submit" className="btn btn-primary"
            style={{ width: '100%', padding: '0.65rem', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p style={styles.switchText}>
          Already have an account? <Link to="/login" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: 'calc(100vh - 64px)', display: 'flex',
    alignItems: 'center', justifyContent: 'center', padding: '2rem',
    background: '#f0fdf4',
  },
  card: {
    background: '#fff', borderRadius: '16px', padding: '2.5rem',
    width: '100%', maxWidth: '560px',
    boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
    border: '1px solid #e5e7eb',
  },
  logo:  { fontSize: '22px', fontWeight: 800, color: '#16a34a', marginBottom: '1.25rem' },
  title: { fontSize: '22px', fontWeight: 700, marginBottom: '4px' },
  sub:   { color: '#9ca3af', fontSize: '14px', marginBottom: '1.5rem' },
  roleRow: { display: 'flex', gap: '8px', marginBottom: '1.25rem' },
  roleBtn: {
    flex: 1, padding: '8px', fontSize: '13px', fontWeight: '600',
    border: '1.5px solid #e5e7eb', borderRadius: '8px',
    cursor: 'pointer', background: '#fff', color: '#6b7280',
  },
  // ← was using borderColor (conflicts with border shorthand), now uses border
  roleBtnActive: {
    flex: 1, padding: '8px', fontSize: '13px', fontWeight: '600',
    border: '1.5px solid #16a34a', borderRadius: '8px',
    cursor: 'pointer', background: '#f0fdf4', color: '#16a34a',
  },
  ngoSection: { background: '#f0fdf4', borderRadius: '8px', padding: '1rem', marginBottom: '1rem' },
  ngoLabel:   { fontSize: '12px', fontWeight: '600', color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' },
  switchText: { textAlign: 'center', fontSize: '13px', color: '#6b7280', marginTop: '1.25rem' },
  link: { color: '#16a34a', fontWeight: '500' },
};

export default Register;
