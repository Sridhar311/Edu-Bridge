import api from './api';

export const createOrder = async (courseId) => {
  const res = await api.post('/payment/create-order', { courseId });
  return res.data;
};

export const verifyPayment = async (payload) => {
  const res = await api.post('/payment/verify', payload);
  return res.data;
};

export const getMyEnrollments = async () => {
  const res = await api.get('/payment/my');
  return res.data;
};

export const getAllTransactions = async () => {
  const res = await api.get('/payment/all');
  return res.data;
};

export const enrollFree = async (courseId) => {
  const res = await api.post('/payment/enroll-free', { courseId });
  return res.data;
};

export const sandboxPay = async (courseId) => {
  const res = await api.post('/payment/sandbox/pay', { courseId });
  return res.data;
};
