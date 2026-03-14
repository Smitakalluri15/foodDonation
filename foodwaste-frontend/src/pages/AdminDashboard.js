import React, { useEffect, useState } from 'react';
import adminService from '../services/adminService';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingVolunteers, setPendingVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userTableRefresh, setUserTableRefresh] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [statsData, pending] = await Promise.all([
          adminService.getStats(),
          adminService.getPendingVolunteers(),
        ]);
        setStats(statsData);
        setPendingVolunteers(pending || []);
      } catch (err) {
        setError('Unable to load admin metrics');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleApprove = async (id) => {
    try {
      await adminService.approveVolunteer(id);
      setPendingVolunteers((prev) => prev.filter((v) => v.id !== id));
      // refresh stats/users briefly
      setUserTableRefresh((x) => !x);
    } catch (err) {
      setError('Could not approve volunteer');
    }
  };

  const handleReject = async (id) => {
    try {
      await adminService.rejectVolunteer(id);
      setPendingVolunteers((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      setError('Could not reject volunteer');
    }
  };

  const toggleUser = async (id, active) => {
    try {
      await adminService.setUserActive(id, active);
      // refresh stats/users shown (simple: refetch stats)
      const statsData = await adminService.getStats();
      setStats(statsData);
    } catch (err) {
      setError('Could not update user status');
    }
  };

  const metricCards = stats ? [
    { label: 'Total Users', value: stats.totalUsers },
    { label: 'Donors', value: stats.donors },
    { label: 'NGOs', value: stats.ngos },
    { label: 'Volunteers', value: stats.volunteers },
    { label: 'Total Donations', value: stats.totalDonations },
    { label: 'Active Donations', value: stats.activeDonations },
    { label: 'Completed Pickups', value: stats.completedPickups },
    { label: 'Open Pickups', value: stats.pendingPickups },
    { label: 'Cities Covered', value: stats.cities },
  ] : [];

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <p style={styles.kicker}>Admin • Insight</p>
          <h1 style={styles.title}>Platform Health</h1>
          <p style={styles.sub}>Real-time overview of users, donations, and logistics.</p>
        </div>
        <div style={styles.badge}>FoodShare Console</div>
      </div>

      {loading && <div className="loading-center"><div className="spinner" /></div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && stats && (
        <>
          {/* Pending volunteers FIRST */}
          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div>
                <div style={styles.panelTitle}>Volunteer approvals</div>
                <div style={styles.panelSub}>Approve pending volunteers</div>
              </div>
            </div>
            <div style={styles.tableWrap}>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>City</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingVolunteers.length === 0 && (
                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '1rem' }}>No pending volunteers</td></tr>
                  )}
                  {pendingVolunteers.map((v) => (
                    <tr key={v.id}>
                      <td>#{v.id}</td>
                      <td style={{ fontWeight: 600 }}>{v.name}</td>
                      <td>{v.email}</td>
                      <td>{v.city || '—'}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <button className="btn btn-primary btn-sm" onClick={() => handleApprove(v.id)}>Approve</button>
                          <button className="btn btn-secondary btn-sm" onClick={() => handleReject(v.id)}>Reject</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Metrics cards */}
          <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
            {metricCards.map((m) => (
              <div key={m.label} style={styles.card}>
                <div style={styles.cardLabel}>{m.label}</div>
                <div style={styles.cardValue}>{m.value}</div>
              </div>
            ))}
          </div>

          {/* Donations + Users */}
          <div className="grid-2" style={{ gap: '1.25rem' }}>
            <div style={styles.panel}>
              <div style={styles.panelHead}>
                <div>
                  <div style={styles.panelTitle}>Recent Donations</div>
                  <div style={styles.panelSub}>Latest 8 submissions</div>
                </div>
              </div>
              <div style={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Food</th>
                      <th>Status</th>
                      <th>City</th>
                      <th>Donor</th>
                      <th>NGO</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentDonations?.map((d) => (
                      <tr key={d.id}>
                        <td>#{d.id}</td>
                        <td style={{ fontWeight: 600 }}>{d.foodName}</td>
                        <td><span className={`badge badge-${statusColor(d.status)}`}>{d.status}</span></td>
                        <td>{d.city || '—'}</td>
                        <td>{d.donorName || '—'}</td>
                        <td>{d.ngoName || '—'}</td>
                        <td>{formatDate(d.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={styles.panel}>
              <div style={styles.panelHead}>
                <div>
                  <div style={styles.panelTitle}>Users</div>
                  <div style={styles.panelSub}>Latest 10 accounts</div>
                </div>
              </div>
              <div style={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>City</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.users?.map((u) => (
                      <tr key={u.id}>
                        <td>#{u.id}</td>
                        <td style={{ fontWeight: 600 }}>{u.name}</td>
                        <td>{u.email}</td>
                        <td><span className="badge badge-gray">{u.role}</span></td>
                        <td>{u.city || '—'}</td>
                        <td>
                          <span className={`badge ${u.active ? 'badge-green' : 'badge-red'}`}>
                            {u.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => toggleUser(u.id, !u.active)}
                          >
                            {u.active ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div>
                <div style={styles.panelTitle}>Volunteer approvals</div>
                <div style={styles.panelSub}>Approve pending volunteers</div>
              </div>
            </div>
              <div style={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>City</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingVolunteers.length === 0 && (
                      <tr><td colSpan="5" style={{ textAlign: 'center', padding: '1rem' }}>No pending volunteers</td></tr>
                    )}
                    {pendingVolunteers.map((v) => (
                      <tr key={v.id}>
                        <td>#{v.id}</td>
                        <td style={{ fontWeight: 600 }}>{v.name}</td>
                        <td>{v.email}</td>
                        <td>{v.city || '—'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            <button className="btn btn-primary btn-sm" onClick={() => handleApprove(v.id)}>Approve</button>
                            <button className="btn btn-secondary btn-sm" onClick={() => handleReject(v.id)}>Reject</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const formatDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString();
};

const statusColor = (status) => {
  if (status === 'AVAILABLE') return 'gray';
  if (status === 'CLAIMED' || status === 'PICKED_UP') return 'orange';
  if (status === 'COMPLETED') return 'green';
  return 'red';
};

const styles = {
  page: { maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', gap: '1rem', flexWrap: 'wrap' },
  kicker: { fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#ef4444', fontWeight: 700, marginBottom: '6px' },
  title: { fontSize: '32px', fontWeight: 800, color: '#111827', margin: 0 },
  sub:   { color: '#6b7280', marginTop: '4px' },
  badge: { background: '#fee2e2', color: '#b91c1c', padding: '8px 12px', borderRadius: '999px', fontWeight: 600 },
  card: {
    background: '#fff',
    borderRadius: '14px',
    padding: '1rem 1.25rem',
    border: '1px solid #f3f4f6',
    boxShadow: '0 18px 30px rgba(0,0,0,0.05)',
  },
  cardLabel: { fontSize: '13px', color: '#6b7280', marginBottom: '6px' },
  cardValue: { fontSize: '26px', fontWeight: 800, color: '#111827' },
  panel: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '14px',
    boxShadow: '0 18px 30px rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },
  panelHead: { padding: '1rem 1.25rem', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  panelTitle: { fontSize: '18px', fontWeight: 700 },
  panelSub: { fontSize: '13px', color: '#6b7280', marginTop: '4px' },
  tableWrap: { overflowX: 'auto' },
};

export default AdminDashboard;
