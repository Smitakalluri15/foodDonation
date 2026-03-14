import API from './api';

const donationService = {
  // Donor
  addDonation:    (data)       => API.post('/donations/add', data).then(r => r.data),
  getMyDonations: ()           => API.get('/donations/my').then(r => r.data),
  updateDonation: (id, data)   => API.put(`/donations/${id}`, data).then(r => r.data),
  cancelDonation: (id)         => API.patch(`/donations/${id}/cancel`).then(r => r.data),

  // NGO / All
  getAvailable:   (city = '')  => API.get(`/donations/available${city ? `?city=${city}` : ''}`).then(r => r.data),
  claimDonation:  (id)         => API.post(`/donations/${id}/claim`).then(r => r.data),
  getById:        (id)         => API.get(`/donations/${id}`).then(r => r.data),

  // NGO dashboard
  getClaimedByNgo: ()          => API.get('/ngo/donations/claimed').then(r => r.data),
  getNgoTasks:    ()           => API.get('/ngo/tasks').then(r => r.data),

  // Volunteer
  getOpenTasks:      ()        => API.get('/volunteer/tasks/open').then(r => r.data),
  getMyTasks:        ()        => API.get('/volunteer/tasks/my').then(r => r.data),
  acceptTask:        (id)      => API.post(`/volunteer/tasks/${id}/accept`).then(r => r.data),
  completeTask:      (id)      => API.post(`/volunteer/tasks/${id}/complete`).then(r => r.data),
};

export default donationService;
