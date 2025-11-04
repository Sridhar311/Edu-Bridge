import api from './api';

export const createOrder = async (courseId) => {
  const res = await api.post('/student/enroll/create-order', { courseId });
  return res.data;
};

export const verifyPayment = async (payload) => {
  const res = await api.post('/student/enroll/verify-payment', payload);
  return res.data;
};

export const getMyEnrollments = async () => {
  const res = await api.get('/student/enroll/my');
  return res.data;
};

export const updateProgress = async (courseId, lectureId) => {
  const res = await api.post(`/student/courses/${courseId}/progress`, { lectureId });
  return res.data;
};
