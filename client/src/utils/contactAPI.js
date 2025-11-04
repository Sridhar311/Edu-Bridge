import api from './api';

export const submitContact = async ({ name, email, subject, message }) => {
  const res = await api.post('/contact', { name, email, subject, message });
  return res.data;
};

export const listContacts = async ({ page = 1, limit = 20 } = {}) => {
  const res = await api.get('/contact', { params: { page, limit } });
  return res.data;
};

export const deleteContact = async (id) => {
  const res = await api.delete(`/contact/${id}`);
  return res.data;
};
