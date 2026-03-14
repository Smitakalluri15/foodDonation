// Format ISO datetime → readable string
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
};

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

// Map status string → badge CSS class
export const statusBadgeClass = (status) => {
  const map = {
    AVAILABLE: 'badge-green',
    CLAIMED:   'badge-blue',
    PICKED_UP: 'badge-amber',
    COMPLETED: 'badge-gray',
    EXPIRED:   'badge-red',
    PENDING:   'badge-amber',
    ASSIGNED:  'badge-blue',
    IN_PROGRESS: 'badge-orange',
    CANCELLED: 'badge-red',
  };
  return map[status] || 'badge-gray';
};

// Food type → emoji
export const foodTypeEmoji = (type) => {
  const map = { VEG: '🥦', NON_VEG: '🍗', VEGAN: '🌱' };
  return map[type] || '🍽️';
};

// Role → display label
export const roleLabel = (role) => {
  const map = { DONOR: 'Donor', NGO: 'NGO', VOLUNTEER: 'Volunteer', ADMIN: 'Admin' };
  return map[role] || role;
};

// Truncate long text
export const truncate = (str, n = 60) =>
  str && str.length > n ? str.slice(0, n) + '...' : str;

// Extract axios error message
export const getErrorMessage = (err) =>
  err?.response?.data?.message || err?.message || 'Something went wrong';
