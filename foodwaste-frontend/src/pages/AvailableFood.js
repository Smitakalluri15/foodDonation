import React, { useEffect, useState } from 'react';
import donationService from '../services/donationService';
import DonationCard from '../components/DonationCard';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../utils/helpers';
import { toast } from 'react-toastify';

const AvailableFood = () => {
  const { user }               = useAuth();
  const [donations, setDonations] = useState([]);
  const [filtered, setFiltered]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [claiming, setClaiming]   = useState(null);

  // Filters
  const [search, setSearch]       = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const fetchDonations = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await donationService.getAvailable();
      const sorted = [...data].sort((a, b) => {
        const timeA = a.bestBefore ? new Date(a.bestBefore).getTime() : Infinity;
        const timeB = b.bestBefore ? new Date(b.bestBefore).getTime() : Infinity;
        return timeA - timeB;
      });
      setDonations(sorted);
      setFiltered(sorted);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  useEffect(() => {
    const handleWsAlert = (e) => {
      const data = e.detail;
      if (data && ['DONATION_CREATED', 'DONATION_CLAIMED'].includes(data.type)) {
        fetchDonations(true); // Silent reload in the background
      }
    };

    window.addEventListener('plateful-ws-alert', handleWsAlert);
    return () => {
      window.removeEventListener('plateful-ws-alert', handleWsAlert);
    };
  }, []);

  // Client-side filtering
  useEffect(() => {
    let result = [...donations];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) => d.foodName.toLowerCase().includes(q) ||
               d.description?.toLowerCase().includes(q)
      );
    }
    if (cityFilter) {
      result = result.filter((d) =>
        d.city?.toLowerCase().includes(cityFilter.toLowerCase())
      );
    }
    if (typeFilter) {
      result = result.filter((d) => d.foodType === typeFilter);
    }
    setFiltered(result);
  }, [search, cityFilter, typeFilter, donations]);

  const handleClaim = async (donationId) => {
    if (!window.confirm('Claim this donation for your NGO?')) return;
    setClaiming(donationId);
    try {
      await donationService.claimDonation(donationId);
      toast.success('Donation claimed! A pickup task has been created.');
      fetchDonations();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setClaiming(null);
    }
  };

  const cities = [...new Set(donations.map((d) => d.city).filter(Boolean))];

  const isNgo = user?.role === 'NGO';

  return (
    <div className="page">
      <div style={styles.header}>
        <div>
          <h1 style={styles.heading}>Available Food Donations</h1>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>
            {filtered.length} donation{filtered.length !== 1 ? 's' : ''} available
          </p>
        </div>
        <button className="btn btn-secondary" onClick={fetchDonations}>↻ Refresh</button>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <input
          className="form-control"
          placeholder="🔍 Search food name or description…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 2, minWidth: '200px' }}
        />
        <select
          className="form-control"
          value={cityFilter}
          onChange={(e) => setCityFilter(e.target.value)}
          style={{ flex: 1, minWidth: '140px' }}
        >
          <option value="">All Cities</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          className="form-control"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={{ flex: 1, minWidth: '140px' }}
        >
          <option value="">All Types</option>
          <option value="VEG">🥦 Veg</option>
          <option value="NON_VEG">🍗 Non-Veg</option>
          <option value="VEGAN">🌱 Vegan</option>
        </select>
        {(search || cityFilter || typeFilter) && (
          <button
            className="btn btn-secondary"
            onClick={() => { setSearch(''); setCityFilter(''); setTypeFilter(''); }}
          >
            Clear
          </button>
        )}
      </div>

      {error   && <div className="alert alert-danger">{error}</div>}
      {loading && <div className="loading-center"><div className="spinner" /></div>}

      {!loading && filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🍽️</div>
          <p>{donations.length === 0 ? 'No donations available right now.' : 'No results match your filters.'}</p>
        </div>
      )}

      <div className="grid-3">
        {filtered.map((d) => (
          <DonationCard
            key={d.id}
            donation={d}
            actions={
              isNgo && d.status === 'AVAILABLE' && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleClaim(d.id)}
                  disabled={claiming === d.id}
                >
                  {claiming === d.id ? 'Claiming…' : '🤝 Claim Donation'}
                </button>
              )
            }
          />
        ))}
      </div>
    </div>
  );
};

const styles = {
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem',
  },
  heading: { fontSize: '26px', fontWeight: 700, marginBottom: '4px' },
  filters: {
    display: 'flex', gap: '10px', flexWrap: 'wrap',
    marginBottom: '1.5rem', alignItems: 'center',
  },
};

export default AvailableFood;
