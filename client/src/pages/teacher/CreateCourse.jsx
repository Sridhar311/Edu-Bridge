import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { createCourse } from '../../utils/courseAPI';
import Navbar from '../../components/Navbar';

export default function CreateCourse() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', price: '', category: '' });
  const [files, setFiles] = useState({ thumbnail: null, video: null, notes: null });
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFile = (e) => setFiles({ ...files, [e.target.name]: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      toast.error('Title and description are required');
      return;
    }

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (files.thumbnail) fd.append('thumbnail', files.thumbnail);
    if (files.video) fd.append('video', files.video);
    if (files.notes) fd.append('notes', files.notes);

    try {
      setSubmitting(true);
      const res = await createCourse(fd, (p) => setProgress(p));
      toast.success('Course created');
      navigate('/teacher/my-courses');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to create course');
    } finally {
      setSubmitting(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Navbar />
      <div className="pt-24 pb-10 container mx-auto px-4 max-w-5xl">
        <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Create New Course</motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
              <input name="title" value={form.title} onChange={handleChange} className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={5} className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <input name="category" value={form.category} onChange={handleChange} className="mt-1 w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/60 focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Thumbnail (image)</label>
                <input type="file" name="thumbnail" accept="image/*" onChange={handleFile} className="mt-1 block w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lecture Video</label>
                <input type="file" name="video" accept="video/*" onChange={handleFile} className="mt-1 block w-full" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes (PDF)</label>
                <input type="file" name="notes" accept="application/pdf" onChange={handleFile} className="mt-1 block w-full" />
              </div>
            </div>

            {progress > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-primary-600 h-2" style={{ width: `${progress}%` }} />
              </div>
            )}

            <button disabled={submitting} className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-secondary-600 text-white font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-60">
              {submitting ? 'Creating…' : 'Create Course'}
            </button>
          </form>

          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-6 backdrop-blur bg-white/60 dark:bg-gray-800/60">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Preview</h2>
            <div className="aspect-video w-full bg-gray-100 dark:bg-gray-900 rounded-xl flex items-center justify-center text-gray-400">{files.thumbnail ? files.thumbnail.name : 'Thumbnail preview'}</div>
            <div className="mt-4">
              <p className="text-xl font-bold text-gray-900 dark:text-white">{form.title || 'Course title'}</p>
              <p className="text-gray-600 dark:text-gray-300 line-clamp-3 mt-2">{form.description || 'Description'}</p>
              <div className="mt-3 text-gray-700 dark:text-gray-200">{form.price ? `₹${form.price}` : 'Price'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
