import API from './api';

const authService = {
  login: async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    return res.data;
  },

  register: async (formData) => {
    const res = await API.post('/auth/register', formData);
    return res.data;
  },
};

export default authService;
