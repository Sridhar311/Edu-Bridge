import api from './api';

export const getAllUsers = async () => {
  const res = await api.get('/admin/users');
  return res.data;
};

export const approveTeacher = async (id) => {
  const res = await api.put(`/admin/approve-teacher/${id}`);
  return res.data;
};

export const rejectTeacher = async (id) => {
  const res = await api.put(`/admin/reject-teacher/${id}`);
  return res.data;
};

export const deleteUser = async (id) => {
  const res = await api.delete(`/admin/user/${id}`);
  return res.data;
};

export const getAllCourses = async () => {
  const res = await api.get('/admin/courses');
  return res.data;
};

export const deleteCourse = async (id) => {
  const res = await api.delete(`/admin/course/${id}`);
  return res.data;
};

export const getStats = async () => {
  const res = await api.get('/admin/stats');
  return res.data;
};
