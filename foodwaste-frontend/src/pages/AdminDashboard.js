import React, { useEffect, useState } from 'react';
import adminService from '../services/adminService';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const STATUS_COLORS = {
  AVAILABLE: '#1D9E75',  // Teal
  CLAIMED: '#3b82f6',    // Blue
  COMPLETED: '#10b981',  // Green
  EXPIRED: '#6b7280',    // Gray
  CANCELLED: '#ef4444',  // Red
};

const getBadgeName = (points) => {
  if (points >= 150) return 'PLATINUM';
  if (points >= 100) return 'GOLD';
  if (points >= 50) return 'SILVER';
  return 'BRONZE';
};

const getBadgeStyle = (badge) => {
  switch (badge) {
    case 'PLATINUM':
      return { background: '#f3e8ff', color: '#6b21a8', border: '1px solid #e9d5ff' };
    case 'GOLD':
      return { background: '#fef9c3', color: '#854d0e', border: '1px solid #fef08a' };
    case 'SILVER':
      return { background: '#f3f4f6', color: '#374151', border: '1px solid #e5e7eb' };
    case 'BRONZE':
      return { background: '#fef3c7', color: '#92400e', border: '1px solid #fde68a' };
    default:
      return { background: '#f3f4f6', color: '#374151' };
  }
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [pendingVolunteers, setPendingVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userTableRefresh, setUserTableRefresh] = useState(false);

  const fetchAllData = async (showSkeleton = true) => {
    if (showSkeleton) setLoading(true);
    setError('');
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

  useEffect(() => {
    fetchAllData(true);
  }, [userTableRefresh]);

  const handleApprove = async (id) => {
    try {
      await adminService.approveVolunteer(id);
      setPendingVolunteers((prev) => prev.filter((v) => v.id !== id));
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
      const statsData = await adminService.getStats();
      setStats(statsData);
    } catch (err) {
      setError('Could not update user status');
    }
  };

  return (
    <div style={styles.page}>
      <SkeletonStyles />
      <div style={styles.header}>
        <div>
          <p style={styles.kicker}>Admin • Insight</p>
          <h1 style={styles.title}>Platform Health</h1>
          <p style={styles.sub}>Real-time overview of users, donations, and logistics.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button className="btn btn-secondary" onClick={() => fetchAllData(true)}>
            ↻ Refresh Stats
          </button>
          <div style={styles.badge}>FoodShare Console</div>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        /* Loading Skeletons */
        <>
          {/* Row 1 Stats Skeletons */}
          <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="card"
                style={{
                  height: '95px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <div
                  className="skeleton-pulse"
                  style={{ width: '45%', height: '14px', borderRadius: '4px' }}
                />
                <div
                  className="skeleton-pulse"
                  style={{ width: '70%', height: '24px', borderRadius: '4px' }}
                />
              </div>
            ))}
          </div>

          {/* Row 2 Charts Skeletons */}
          <div className="grid-2" style={{ marginBottom: '1.5rem', gap: '1.25rem' }}>
            <div
              className="card"
              style={{ height: '380px', display: 'flex', flexDirection: 'column', gap: '15px' }}
            >
              <div
                className="skeleton-pulse"
                style={{ width: '30%', height: '20px', borderRadius: '4px' }}
              />
              <div className="skeleton-pulse" style={{ flex: 1, borderRadius: '8px' }} />
            </div>
            <div
              className="card"
              style={{ height: '380px', display: 'flex', flexDirection: 'column', gap: '15px' }}
            >
              <div
                className="skeleton-pulse"
                style={{ width: '30%', height: '20px', borderRadius: '4px' }}
              />
              <div className="skeleton-pulse" style={{ flex: 1, borderRadius: '8px' }} />
            </div>
          </div>

          {/* Row 3 Leaderboard Skeleton */}
          <div
            className="card"
            style={{
              marginBottom: '1.5rem',
              height: '280px',
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
            }}
          >
            <div
              className="skeleton-pulse"
              style={{ width: '25%', height: '20px', borderRadius: '4px' }}
            />
            <div className="skeleton-pulse" style={{ flex: 1, borderRadius: '8px' }} />
          </div>
        </>
      ) : (
        stats && (
          <>
            {/* Row 1 — 4 stat cards in a grid */}
            <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
              <div className="card" style={{ ...styles.statCard, borderLeft: '4px solid #3b82f6' }}>
                <div style={styles.cardLabel}>Total Donations</div>
                <div style={styles.cardValue}>{stats.totalDonations ?? 0}</div>
              </div>
              <div className="card" style={{ ...styles.statCard, borderLeft: '4px solid #1D9E75' }}>
                <div style={styles.cardLabel}>Active Now</div>
                <div style={styles.cardValue}>{stats.activeDonations ?? 0}</div>
              </div>
              <div className="card" style={{ ...styles.statCard, borderLeft: '4px solid #10b981' }}>
                <div style={styles.cardLabel}>Completed</div>
                <div style={styles.cardValue}>{stats.completedDonations ?? 0}</div>
              </div>
              <div className="card" style={{ ...styles.statCard, borderLeft: '4px solid #8b5cf6' }}>
                <div style={styles.cardLabel}>Total Users</div>
                <div style={styles.cardValue}>{stats.totalUsers ?? 0}</div>
              </div>
            </div>

            {/* Row 2 — side by side charts */}
            <div className="grid-2" style={{ marginBottom: '1.5rem', gap: '1.25rem' }}>
              <div className="card" style={{ padding: '1.25rem' }}>
                <h3
                  style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    marginBottom: '1rem',
                    color: '#374151',
                  }}
                >
                  Donations by City
                </h3>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.donationsByCity || []}
                      margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                    >
                      <XAxis dataKey="city" tick={{ fontSize: 11, fill: '#6b7280' }} />
                      <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} />
                      <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '6px' }} />
                      <Bar dataKey="count" fill="#1D9E75" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card" style={{ padding: '1.25rem' }}>
                <h3
                  style={{
                    fontSize: '15px',
                    fontWeight: '700',
                    marginBottom: '1rem',
                    color: '#374151',
                  }}
                >
                  Donations by Status
                </h3>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={(stats.donationsByStatus || []).map((item) => ({
                          name: item.status,
                          value: item.count,
                        }))}
                        cx="50%"
                        cy="42%"
                        innerRadius={55}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {(stats.donationsByStatus || []).map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={STATUS_COLORS[entry.status] || '#9ca3af'}
                          />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '6px' }} />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        wrapperStyle={{ fontSize: '11px', color: '#4b5563' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Row 3 — Top donors leaderboard table */}
            <div className="card" style={{ marginBottom: '1.5rem', padding: '1.25rem' }}>
              <h3
                style={{
                  fontSize: '15px',
                  fontWeight: '700',
                  marginBottom: '1rem',
                  color: '#374151',
                }}
              >
                🏆 Donor Leaderboard
              </h3>
              <div style={styles.tableWrap}>
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: '100px' }}>Rank</th>
                      <th>Name</th>
                      <th>Donations Submitted</th>
                      <th>Points Earned</th>
                      <th>Level Badge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {!stats.topDonors || stats.topDonors.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          style={{ textAlign: 'center', padding: '1rem', color: 'var(--gray-500)' }}
                        >
                          No donors on the leaderboard yet.
                        </td>
                      </tr>
                    ) : (
                      stats.topDonors.map((donor, idx) => {
                        const rank = idx + 1;
                        const badge = getBadgeName(donor.points || 0);
                        return (
                          <tr key={idx}>
                            <td
                              style={{
                                fontWeight: '700',
                                color:
                                  rank === 1
                                    ? '#eab308'
                                    : rank === 2
                                    ? '#9ca3af'
                                    : rank === 3
                                    ? '#b45309'
                                    : '#6b7280',
                              }}
                            >
                              {rank === 1
                                ? '🥇 1st'
                                : rank === 2
                                ? '🥈 2nd'
                                : rank === 3
                                ? '🥉 3rd'
                                : `#${rank}`}
                            </td>
                            <td style={{ fontWeight: 600, color: 'var(--gray-900)' }}>
                              {donor.name}
                            </td>
                            <td>{donor.donationCount ?? 0}</td>
                            <td style={{ fontWeight: '600', color: 'var(--info)' }}>
                              ⭐️ {donor.points ?? 0} pts
                            </td>
                            <td>
                              <span
                                className="badge"
                                style={{
                                  ...getBadgeStyle(badge),
                                  fontSize: '11px',
                                  fontWeight: '600',
                                  padding: '2px 8px',
                                  borderRadius: '20px',
                                }}
                              >
                                {badge}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pending volunteer approvals table */}
            <div className="card" style={{ marginBottom: '1.25rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.75rem',
                }}
              >
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
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '1rem' }}>
                          No pending volunteers
                        </td>
                      </tr>
                    )}
                    {pendingVolunteers.map((v) => (
                      <tr key={v.id}>
                        <td>#{v.id}</td>
                        <td style={{ fontWeight: 600 }}>{v.name}</td>
                        <td>{v.email}</td>
                        <td>{v.city || '—'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleApprove(v.id)}
                            >
                              Approve
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleReject(v.id)}
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Donations + Users tables */}
            <div className="grid-2" style={{ gap: '1.25rem', marginBottom: '1.5rem' }}>
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
                          <td>
                            <span className={`badge badge-${statusColor(d.status)}`}>
                              {d.status}
                            </span>
                          </td>
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
                        <th>Aadhaar Number</th>
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
                          <td>
                            <span className="badge badge-gray">{u.role}</span>
                          </td>
                          <td style={{ fontFamily: 'monospace' }}>
                            {u.role === 'DONOR' ? (u.aadhaarNumber || 'Not submitted') : '—'}
                          </td>
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
          </>
        )
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

const SkeletonStyles = () => (
  <style>{`
    @keyframes skeleton-pulse {
      0% { background-color: #f3f4f6; }
      50% { background-color: #e5e7eb; }
      100% { background-color: #f3f4f6; }
    }
    .skeleton-pulse {
      animation: skeleton-pulse 1.5s infinite ease-in-out;
    }
  `}</style>
);

const styles = {
  page: { maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    gap: '1rem',
    flexWrap: 'wrap',
  },
  kicker: {
    fontSize: '12px',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#ef4444',
    fontWeight: 700,
    marginBottom: '6px',
  },
  title: { fontSize: '32px', fontWeight: 800, color: '#111827', margin: 0 },
  sub: { color: '#6b7280', marginTop: '4px' },
  badge: {
    background: '#fee2e2',
    color: '#b91c1c',
    padding: '8px 12px',
    borderRadius: '999px',
    fontWeight: 600,
  },
  card: {
    background: '#fff',
    borderRadius: '14px',
    padding: '1rem 1.25rem',
    border: '1px solid #f3f4f6',
    boxShadow: '0 18px 30px rgba(0,0,0,0.05)',
  },
  statCard: {
    background: '#fff',
    borderRadius: '12px',
    padding: '1.25rem',
    border: '1px solid #e5e7eb',
    boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  cardLabel: { fontSize: '13px', color: '#6b7280', fontWeight: '500', marginBottom: '6px' },
  cardValue: { fontSize: '26px', fontWeight: 800, color: '#111827' },
  panel: {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '14px',
    boxShadow: '0 18px 30px rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },
  panelHead: {
    padding: '1rem 1.25rem',
    borderBottom: '1px solid #f3f4f6',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  panelTitle: { fontSize: '18px', fontWeight: 700 },
  panelSub: { fontSize: '13px', color: '#6b7280', marginTop: '4px' },
  tableWrap: { overflowX: 'auto' },
};

export default AdminDashboard;
