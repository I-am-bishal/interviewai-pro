import api from './axios';

export const authApi = {
  register: async (data) => {
    const res = await api.post('/auth/register', data);
    return res.data.data;
  },

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    return res.data.data;
  },

  refresh: async (refreshToken) => {
    const res = await api.post('/auth/refresh', { refreshToken });
    return res.data.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
  },

  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data.data.user;
  },
};
