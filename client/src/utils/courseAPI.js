import api from './api';

export const createCourse = async (formData, onProgress) => {
  const res = await api.post('/courses', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 10 * 60 * 1000, // 10 minutes for large videos
    onUploadProgress: (evt) => {
      if (!onProgress) return;
      const total = evt.total || evt.currentTarget?.getResponseHeader?.('Content-Length');
      if (total) {
        const percent = Math.round((evt.loaded * 100) / total);
        onProgress(percent);
      }
    },
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
  });
  return res.data;
};

export const updateCourse = async (id, formData, onProgress) => {
  const res = await api.put(`/courses/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 10 * 60 * 1000,
    onUploadProgress: (evt) => {
      if (!onProgress) return;
      const total = evt.total || evt.currentTarget?.getResponseHeader?.('Content-Length');
      if (total) {
        const percent = Math.round((evt.loaded * 100) / total);
        onProgress(percent);
      }
    },
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
  });
  return res.data;
};

export const deleteCourse = async (id) => {
  const res = await api.delete(`/courses/${id}`);
  return res.data;
};

export const getMyCourses = async () => {
  const res = await api.get('/courses/my');
  return res.data;
};

export const getAllCourses = async () => {
  const res = await api.get('/courses/all');
  return res.data;
};

export const getCourseById = async (id) => {
  const res = await api.get(`/courses/${id}`);
  return res.data;
};

// Public listing/detail
export const getCoursesPublic = async ({ page = 1, limit = 12, search = '' } = {}) => {
  const params = new URLSearchParams();
  params.set('page', page);
  params.set('limit', limit);
  if (search) params.set('search', search);
  const res = await api.get(`/courses/public?${params.toString()}`);
  return res.data;
};

export const getCoursePublic = async (id) => {
  const res = await api.get(`/courses/public/${id}`);
  return res.data;
};
