import API from './api';

const getStats = async () => {
  const { data } = await API.get('/admin/stats');
  return data;
};

const getPendingVolunteers = async () => {
  const { data } = await API.get('/admin/volunteers/pending');
  return data;
};

const approveVolunteer = async (id) => {
  const { data } = await API.put(`/admin/volunteer/approve/${id}`);
  return data;
};

const rejectVolunteer = async (id) => {
  const { data } = await API.put(`/admin/volunteer/reject/${id}`);
  return data;
};

const setUserActive = async (id, active) => {
  await API.put(`/admin/users/${id}/activate`, { active });
};

const adminService = { getStats, getPendingVolunteers, approveVolunteer, rejectVolunteer, setUserActive };
export default adminService;
