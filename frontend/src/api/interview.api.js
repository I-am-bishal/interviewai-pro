import api from './axios';

export const interviewApi = {
  start: async (mode, title, level) => {
    const res = await api.post('/interviews/start', { mode, title, level });
    return res.data.data.interview;
  },

  submitAnswer: async (interviewId, answer, questionIndex) => {
    const res = await api.post(`/interviews/${interviewId}/answer`, { answer, questionIndex });
    return res.data.data;
  },

  complete: async (interviewId, metadata) => {
    const res = await api.post(`/interviews/${interviewId}/complete`, metadata);
    return res.data.data.interview;
  },

  list: async (params = {}) => {
    const res = await api.get('/interviews', { params });
    return res.data.data;
  },

  getById: async (id) => {
    const res = await api.get(`/interviews/${id}`);
    return res.data.data.interview;
  },

  delete: async (id) => {
    await api.delete(`/interviews/${id}`);
  },
};
