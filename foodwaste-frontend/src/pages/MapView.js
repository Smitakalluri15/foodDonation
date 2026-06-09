import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { statusBadgeClass, foodTypeEmoji, getErrorMessage } from '../utils/helpers';
import { toast } from 'react-toastify';

// Centroids for common Indian cities
const CITY_COORDS = {
  'bangalore': [12.9716, 77.5946],
  'bengaluru': [12.9716, 77.5946],
  'mumbai': [19.0760, 72.8777],
  'delhi': [28.7041, 77.1025],
  'new delhi': [28.6139, 77.2090],
  'chennai': [13.0827, 80.2707],
  'kolkata': [22.5726, 88.3639],
  'hyderabad': [17.3850, 78.4867],
  'pune': [18.5204, 73.8567],
  'ahmedabad': [23.0225, 72.5714],
  'jaipur': [26.9124, 75.7873],
  'lucknow': [26.8467, 80.9462],
  'patna': [25.5941, 85.1376],
  'bhopal': [23.2599, 77.4126],
  'indore': [22.7196, 75.8577],
  'chandigarh': [30.7333, 76.7794],
};

// Haversine formula to compute distance in km
const getDistance = (lat1, lon1, lat2, lon2) => {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return Infinity;
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Get position coordinates for a donation, with spiral scattering (jitter) if no precise coords exist
const getDonationCoords = (donation, index) => {
  if (
    donation.latitude !== null &&
    donation.longitude !== null &&
    donation.latitude !== undefined &&
    donation.longitude !== undefined
  ) {
    return [donation.latitude, donation.longitude];
  }

  const cityKey = (donation.city || '').trim().toLowerCase();
  const centroid = CITY_COORDS[cityKey] || [20.5937, 78.9629];

  // Apply jitter based on the donation index to scatter pins in a golden spiral
  const angle = index * 137.5 * (Math.PI / 180);
  const radius = 0.008 * Math.sqrt(index + 1);

  return [
    centroid[0] + Math.sin(angle) * radius,
    centroid[1] + Math.cos(angle) * radius,
  ];
};

// Format expiration date to "Expires DD MMM YYYY"
const formatBestBefore = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `Expires ${day} ${month} ${year}`;
};

// Blue pulsing circle marker icon for user location
const createUserIcon = () =>
  L.divIcon({
    className: 'user-location-marker',
    html: `
      <div class="pulse-marker-container">
        <div class="pulse-ring"></div>
        <div class="pulse-dot"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

// SVG marker creator (green for precise, red for city centroid fallback)
const createDonationIcon = (color) =>
  L.divIcon({
    className: `donation-marker-${color}`,
    html: `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${
        color === 'green' ? '#10b981' : '#ef4444'
      }" width="32" height="32">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

const userIcon = createUserIcon();
const greenIcon = createDonationIcon('green');
const redIcon = createDonationIcon('red');

// MapController subcomponent to capture map instance and center initial position
const MapController = ({ userLocation, setMap }) => {
  const map = useMap();

  useEffect(() => {
    if (map) {
      setMap(map);
    }
  }, [map, setMap]);

  useEffect(() => {
    if (map && userLocation) {
      map.setView(userLocation, 12);
    }
  }, [map, userLocation]);

  return null;
};

const MapView = () => {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [geoLoading, setGeoLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [activeDonation, setActiveDonation] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all' | 'near' | 'expiring'
  const [claiming, setClaiming] = useState(null);
  const [map, setMap] = useState(null);

  // Gets user's current location via navigator.geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setGeoLoading(false);
        },
        (error) => {
          console.warn('Geolocation failed or permission denied. Fallback to center of India.', error);
          setUserLocation([20.5937, 78.9629]); // Fallback: Center of India
          setGeoLoading(false);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      console.warn('Geolocation not supported by this browser. Fallback to center of India.');
      setUserLocation([20.5937, 78.9629]);
      setGeoLoading(false);
    }
  }, []);

  const fetchDonations = async () => {
    try {
      const response = await API.get('/donations/available');
      setDonations(response.data);
    } catch (err) {
      toast.error(getErrorMessage(err));
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
        fetchDonations();
      }
    };

    window.addEventListener('plateful-ws-alert', handleWsAlert);
    return () => {
      window.removeEventListener('plateful-ws-alert', handleWsAlert);
    };
  }, []);

  // Filter application
  useEffect(() => {
    let result = [...donations];

    if (filter === 'near') {
      if (userLocation) {
        result = result.filter((d, idx) => {
          const coords = getDonationCoords(d, idx);
          const distance = getDistance(
            userLocation[0],
            userLocation[1],
            coords[0],
            coords[1]
          );
          return distance <= 50;
        });
      }
    } else if (filter === 'expiring') {
      const now = new Date();
      result = result.filter((d) => {
        if (!d.bestBefore) return false;
        const expiry = new Date(d.bestBefore);
        const diffTime = expiry - now;
        const diffHours = diffTime / (1000 * 60 * 60);
        return diffHours > 0 && diffHours <= 48;
      });
    }

    setFiltered(result);
  }, [filter, donations, userLocation]);

  const handleCardClick = (donation, index) => {
    setActiveDonation(donation);
    const coords = getDonationCoords(donation, index);
    if (map) {
      map.flyTo(coords, 14, { animate: true, duration: 1.5 });
    }
  };

  const handleClaim = async (donationId) => {
    if (!window.confirm('Claim this donation for your NGO?')) return;
    setClaiming(donationId);
    try {
      await API.post(`/donations/${donationId}/claim`);
      toast.success('Donation claimed! A pickup task has been created.');
      fetchDonations();
      setSelectedDetails(null);
      setActiveDonation(null);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setClaiming(null);
    }
  };

  if (loading || geoLoading) {
    return (
      <div className="loading-center" style={{ height: 'calc(100vh - 64px)', flexDirection: 'column' }}>
        <div className="spinner" />
        <p style={{ marginTop: '1rem', color: 'var(--gray-500)', fontSize: '15px', fontWeight: '500' }}>
          {geoLoading ? 'Retrieving your current location...' : 'Loading available donations...'}
        </p>
      </div>
    );
  }

  const isLocationFallback =
    userLocation && userLocation[0] === 20.5937 && userLocation[1] === 78.9629;

  return (
    <div className="map-view-container">
      {/* Dynamic inline styles for premium UI elements */}
      <style>{`
        .map-view-container {
          display: flex;
          height: calc(100vh - 64px);
          width: 100%;
          position: relative;
          overflow: hidden;
        }
        .map-view-sidebar {
          width: 320px;
          height: 100%;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-right: 1px solid var(--gray-200);
          display: flex;
          flex-direction: column;
          z-index: 999;
          box-shadow: 4px 0 20px rgba(0, 0, 0, 0.05);
        }
        .map-view-sidebar-header {
          padding: 1.25rem;
          border-bottom: 1px solid var(--gray-100);
        }
        .map-view-sidebar-header h2 {
          font-size: 18px;
          font-weight: 700;
          color: var(--gray-900);
          margin-bottom: 4px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .map-view-sidebar-header p {
          font-size: 13px;
          color: var(--gray-500);
        }
        .map-view-filter-bar {
          display: flex;
          padding: 0.75rem 1.25rem;
          background: var(--gray-50);
          border-bottom: 1px solid var(--gray-100);
          gap: 0.5rem;
        }
        .filter-tab {
          flex: 1;
          padding: 6px 0;
          font-size: 12px;
          font-weight: 600;
          text-align: center;
          border-radius: 6px;
          border: 1px solid transparent;
          background: transparent;
          color: var(--gray-500);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .filter-tab:hover {
          color: var(--gray-900);
          background: var(--gray-200);
        }
        .filter-tab.active {
          background: var(--primary-light);
          color: var(--primary);
          border-color: rgba(239, 68, 68, 0.15);
        }
        .map-view-cards-list {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .sidebar-card {
          background: #fff;
          border: 1px solid var(--gray-200);
          border-radius: 8px;
          padding: 0.85rem;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 1px 2px rgba(0,0,0,0.02);
        }
        .sidebar-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.05);
          border-color: var(--primary-light);
        }
        .sidebar-card.active {
          border-color: var(--primary);
          background: rgba(239, 68, 68, 0.02);
          box-shadow: 0 0 0 1px var(--primary);
        }
        .sidebar-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 6px;
        }
        .sidebar-card-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--gray-900);
          margin-right: 8px;
        }
        .sidebar-card-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
          font-size: 12px;
          color: var(--gray-500);
        }
        .map-view-map-container {
          flex: 1;
          height: 100%;
          position: relative;
          z-index: 1;
        }
        .pulse-marker-container {
          position: relative;
          width: 24px;
          height: 24px;
        }
        .pulse-dot {
          position: absolute;
          top: 6px;
          left: 6px;
          width: 12px;
          height: 12px;
          background-color: #3b82f6;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 4px rgba(0,0,0,0.35);
        }
        .pulse-ring {
          position: absolute;
          top: 0;
          left: 0;
          width: 24px;
          height: 24px;
          background-color: rgba(59, 130, 246, 0.45);
          border-radius: 50%;
          animation: marker-pulse 1.6s infinite ease-out;
        }
        @keyframes marker-pulse {
          0% {
            transform: scale(0.5);
            opacity: 1;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }
        .popup-details-btn {
          background: var(--primary);
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          width: 100%;
          margin-top: 8px;
          text-align: center;
          transition: background 0.15s;
        }
        .popup-details-btn:hover {
          background: var(--primary-dark);
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
        }
        .modal-content {
          background: #fff;
          border-radius: 12px;
          width: 90%;
          max-width: 500px;
          max-height: 85vh;
          overflow-y: auto;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          animation: modal-slide-up 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes modal-slide-up {
          from { transform: translateY(15px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .modal-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid var(--gray-100);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .modal-title {
          font-size: 18px;
          font-weight: 700;
          color: var(--gray-900);
        }
        .modal-close-btn {
          background: transparent;
          border: none;
          font-size: 24px;
          color: var(--gray-400);
          cursor: pointer;
          line-height: 1;
        }
        .modal-close-btn:hover {
          color: var(--gray-700);
        }
        .modal-body {
          padding: 1.5rem;
        }
        .modal-info-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 1rem;
        }
        .modal-info-row {
          display: flex;
          gap: 8px;
          align-items: flex-start;
        }
        .modal-info-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--gray-500);
          width: 100px;
          flex-shrink: 0;
        }
        .modal-info-value {
          font-size: 13.5px;
          color: var(--gray-800);
        }
      `}</style>

      {/* Sidebar Panel */}
      <div className="map-view-sidebar">
        <div className="map-view-sidebar-header">
          <h2>
            <span>📍</span> Food Donations Map
          </h2>
          <p>
            {filtered.length} donation{filtered.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* Filter Bar */}
        <div className="map-view-filter-bar">
          <button
            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-tab ${filter === 'near' ? 'active' : ''}`}
            onClick={() => setFilter('near')}
          >
            Near me
          </button>
          <button
            className={`filter-tab ${filter === 'expiring' ? 'active' : ''}`}
            onClick={() => setFilter('expiring')}
          >
            Expiring
          </button>
        </div>

        {/* Dynamic warning if geolocation is set to fallback but user filters by "Near me" */}
        {filter === 'near' && isLocationFallback && (
          <div
            style={{
              padding: '0.75rem 1rem',
              color: '#991b1b',
              background: '#fee2e2',
              fontSize: '12px',
              borderBottom: '1px solid #fecaca',
              lineHeight: 1.4,
            }}
          >
            ⚠️ Location access not approved or unavailable. Distance calculations are based on center of India fallback.
          </div>
        )}

        {/* Cards list */}
        <div className="map-view-cards-list">
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--gray-500)' }}>
              <div style={{ fontSize: '32px', marginBottom: '0.5rem' }}>🍽️</div>
              <p style={{ fontSize: '13px' }}>No donations match the selected filter.</p>
            </div>
          ) : (
            filtered.map((d, idx) => {
              const coords = getDonationCoords(d, idx);
              const distance = userLocation
                ? getDistance(userLocation[0], userLocation[1], coords[0], coords[1])
                : null;
              const hasPreciseCoords = d.latitude !== null && d.longitude !== null;

              return (
                <div
                  key={d.id}
                  className={`sidebar-card ${activeDonation?.id === d.id ? 'active' : ''}`}
                  onClick={() => handleCardClick(d, idx)}
                >
                  <div className="sidebar-card-header">
                    <span className="sidebar-card-title">
                      {foodTypeEmoji(d.foodType)} {d.foodName}
                    </span>
                    <span className={statusBadgeClass(d.status)} style={{ fontSize: '10px' }}>
                      {d.status}
                    </span>
                  </div>
                  <div className="sidebar-card-meta">
                    <div>
                      <strong>Qty:</strong> {d.quantity} {d.quantityUnit}
                    </div>
                    <div>
                      <strong>Loc:</strong> {d.pickupAddress || d.city}
                      {!hasPreciseCoords && (
                        <span
                          style={{
                            color: '#dc2626',
                            fontSize: '10px',
                            marginLeft: '4px',
                            background: '#fee2e2',
                            padding: '1px 4px',
                            borderRadius: '4px',
                            fontWeight: '600',
                          }}
                        >
                          City fallback
                        </span>
                      )}
                    </div>
                    {distance !== null && distance !== Infinity && (
                      <div style={{ color: 'var(--info)', fontWeight: '500' }}>
                        📍 {distance.toFixed(1)} km away
                      </div>
                    )}
                    <div style={{ color: '#d97706', fontSize: '11px', fontWeight: '500', marginTop: '2px' }}>
                      ⏳ {formatBestBefore(d.bestBefore)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Leaflet Map Section */}
      <div className="map-view-map-container">
        <MapContainer
          center={userLocation || [20.5937, 78.9629]}
          zoom={userLocation ? 12 : 5}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapController userLocation={userLocation} setMap={setMap} />

          {/* User Location Pulsing Dot */}
          {userLocation && (
            <Marker position={userLocation} icon={userIcon}>
              <Popup>
                <div style={{ textAlign: 'center', fontWeight: 'bold' }}>You are here</div>
              </Popup>
            </Marker>
          )}

          {/* Donation Markers */}
          {filtered.map((donation, idx) => {
            const coords = getDonationCoords(donation, idx);
            const isPrecise = donation.latitude !== null && donation.longitude !== null;
            const markerIcon = isPrecise ? greenIcon : redIcon;

            return (
              <Marker
                key={donation.id}
                position={coords}
                icon={markerIcon}
                eventHandlers={{
                  click: () => {
                    setActiveDonation(donation);
                    if (map) {
                      map.flyTo(coords, 14, { animate: true });
                    }
                  },
                }}
              >
                {activeDonation?.id === donation.id && (
                  <Popup onClose={() => setActiveDonation(null)}>
                    <div style={{ minWidth: '180px', fontFamily: 'inherit' }}>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: '600' }}>
                        {foodTypeEmoji(donation.foodType)} {donation.foodName}
                      </h4>
                      <div style={{ fontSize: '12px', color: '#4b5563', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <div><strong>Qty:</strong> {donation.quantity} {donation.quantityUnit}</div>
                        <div><strong>City:</strong> {donation.city}</div>
                        <div style={{ color: '#d97706', fontWeight: '500' }}>
                          ⏳ {formatBestBefore(donation.bestBefore)}
                        </div>
                        <div style={{ marginTop: '4px' }}>
                          <span className={statusBadgeClass(donation.status)} style={{ fontSize: '10px', padding: '1px 6px' }}>
                            {donation.status}
                          </span>
                        </div>
                      </div>
                      <button
                        className="popup-details-btn"
                        onClick={() => setSelectedDetails(donation)}
                      >
                        View details
                      </button>
                    </div>
                  </Popup>
                )}
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {/* Details Modal Overlay */}
      {selectedDetails && (
        <div className="modal-overlay" onClick={() => setSelectedDetails(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {foodTypeEmoji(selectedDetails.foodType)} {selectedDetails.foodName}
              </h3>
              <button className="modal-close-btn" onClick={() => setSelectedDetails(null)}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className={statusBadgeClass(selectedDetails.status)}>
                  {selectedDetails.status}
                </span>
                <span style={{ fontSize: '13px', color: 'var(--gray-500)' }}>
                  Posted by <strong>{selectedDetails.donorName || 'Anonymous'}</strong>
                </span>
              </div>

              {selectedDetails.description && (
                <div style={{ background: 'var(--gray-50)', padding: '0.85rem', borderRadius: '8px', fontSize: '13px', color: '#4b5563', border: '1px solid var(--gray-100)', marginBottom: '1rem', lineHeight: '1.5' }}>
                  {selectedDetails.description}
                </div>
              )}

              <div className="modal-info-grid">
                <div className="modal-info-row">
                  <span className="modal-info-label">Quantity</span>
                  <span className="modal-info-value">{selectedDetails.quantity} {selectedDetails.quantityUnit}</span>
                </div>
                <div className="modal-info-row">
                  <span className="modal-info-label">Address</span>
                  <span className="modal-info-value">{selectedDetails.pickupAddress || '—'}</span>
                </div>
                <div className="modal-info-row">
                  <span className="modal-info-label">City</span>
                  <span className="modal-info-value">{selectedDetails.city || '—'}</span>
                </div>
                <div className="modal-info-row">
                  <span className="modal-info-label">Expiry Date</span>
                  <span className="modal-info-value" style={{ color: '#d97706', fontWeight: '600' }}>
                    {formatBestBefore(selectedDetails.bestBefore)}
                  </span>
                </div>
              </div>

              {/* Claim Button action if NGO user and donation is available */}
              {user?.role === 'NGO' && selectedDetails.status === 'AVAILABLE' && (
                <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--gray-100)', paddingTop: '1.25rem' }}>
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', py: '0.6rem' }}
                    onClick={() => handleClaim(selectedDetails.id)}
                    disabled={claiming === selectedDetails.id}
                  >
                    {claiming === selectedDetails.id ? 'Claiming...' : '🤝 Claim Donation'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;
