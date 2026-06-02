import api from './axios';

// ── Analytics ──────────────────────────────────────────────────────────────
export const analyticsApi = {
  summary: async () => {
    const res = await api.get('/analytics/summary');
    return res.data.data;
  },
  trend: async (days = 30) => {
    const res = await api.get('/analytics/trend', { params: { days } });
    return res.data.data;
  },
  leaderboard: async () => {
    const res = await api.get('/analytics/leaderboard');
    return res.data.data;
  },
};

// ── Coding ─────────────────────────────────────────────────────────────────
export const codingApi = {
  getProblems: async (params = {}) => {
    const res = await api.get('/coding/problems', { params });
    return res.data.data.problems;
  },
  getProblem: async (id) => {
    const res = await api.get(`/coding/problems/${id}`);
    return res.data.data.problem;
  },
  submit: async (payload) => {
    const res = await api.post('/coding/submit', payload);
    return res.data.data.submission;
  },
  getSubmissions: async () => {
    const res = await api.get('/coding/submissions');
    return res.data.data.submissions;
  },
};

// ── Resume ─────────────────────────────────────────────────────────────────
export const resumeApi = {
  upload: async (file, targetRole) => {
    const form = new FormData();
    form.append('resume', file);
    if (targetRole) form.append('targetRole', targetRole);
    const res = await api.post('/resume/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data.resume;
  },
  getLatest: async () => {
    const res = await api.get('/resume');
    return res.data.data.resume;
  },
  getAll: async () => {
    const res = await api.get('/resume/all');
    return res.data.data.resumes;
  },
};

// ── User ───────────────────────────────────────────────────────────────────
export const userApi = {
  updateProfile: async (updates) => {
    const res = await api.put('/users/profile', updates);
    return res.data.data.user;
  },
  updatePassword: async (currentPassword, newPassword) => {
    await api.put('/users/password', { currentPassword, newPassword });
  },
};
