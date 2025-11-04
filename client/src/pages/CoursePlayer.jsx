import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { getMyEnrollments } from '../utils/studentAPI';
import { updateProgress } from '../utils/studentAPI';
import ProgressBar from '../components/ProgressBar';
import Navbar from '../components/Navbar';

export default function CoursePlayer() {
  const { id } = useParams(); // courseId
  const [enrollment, setEnrollment] = useState(null);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await getMyEnrollments();
        const list = res.data || [];
        const found = list.find((e) => String(e.course?._id || e.course?.id) === String(id));
        if (!found) {
          toast.error('You are not enrolled in this course');
          return;
        }
        setEnrollment(found);
      } catch (err) {
        toast.error(err?.response?.data?.message || 'Failed to load course');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const lectures = useMemo(() => {
    const c = enrollment?.course || {};
    if (Array.isArray(c.lectures) && c.lectures.length > 0) return c.lectures;
    if (c.videoUrl) return [{ title: c.title || 'Lecture', videoUrl: c.videoUrl, description: c.description, order: 1 }];
    return [];
  }, [enrollment]);

  const completedSet = useMemo(() => new Set(enrollment?.completedLectures || []), [enrollment]);

  const onMarkComplete = async () => {
    if (!lectures[current]) return;
    const lectureId = String(lectures[current]._id || lectures[current].order || current);
    try {
      setMarking(true);
      const res = await updateProgress(id, lectureId);
      const payload = res?.data || {};
      const updated = payload.data || payload; // support either shape
      setEnrollment((prev) => prev ? { ...prev, completedLectures: updated.completedLectures, progressPercent: updated.progressPercent } : prev);
      toast.success('Marked as completed');
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update progress');
    } finally {
      setMarking(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Navbar />
      <div className="pt-24 flex items-center justify-center text-gray-600 dark:text-gray-300">Loading…</div>
    </div>
  );
  if (!enrollment) return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Navbar />
      <div className="pt-24 text-center text-gray-600 dark:text-gray-300">Not enrolled</div>
    </div>
  );

  const currentLecture = lectures[current];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <Navbar />
      <div className="pt-24 pb-10 container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="aspect-video bg-black rounded-xl overflow-hidden">
              {currentLecture?.videoUrl ? (
                <video key={current} className="w-full h-full" controls src={currentLecture.videoUrl} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">No video</div>
              )}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{currentLecture?.title || 'Lecture'}</h1>
                <p className="text-gray-600 dark:text-gray-300 mt-1">{currentLecture?.description}</p>
              </div>
              <button onClick={onMarkComplete} disabled={marking} className="px-4 py-2 rounded-lg bg-primary-600 text-white disabled:opacity-60">
                {marking ? 'Saving…' : 'Mark complete'}
              </button>
            </div>
            <div className="mt-4">
              <ProgressBar value={enrollment?.progressPercent || 0} />
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">Progress: {enrollment?.progressPercent || 0}%</div>
            </div>

            {enrollment?.course?.notesUrl && (
              <a href={enrollment.course.notesUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                <i className="fas fa-file-pdf" /> Download Notes
              </a>
            )}
          </div>

          <div>
            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 shadow-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">Lectures</div>
              </div>
              <div className="max-h-[60vh] overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
                {lectures.map((l, i) => {
                  const lid = String(l._id || l.order || i);
                  const done = completedSet.has(lid);
                  return (
                    <button key={lid} onClick={() => setCurrent(i)} className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 ${i === current ? 'bg-gray-50 dark:bg-gray-800' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div className="text-gray-900 dark:text-white font-medium line-clamp-1">{l.title || `Lecture ${i + 1}`}</div>
                        {done && <span className="text-xs text-green-600"><i className="fas fa-check-circle" /> Done</span>}
                      </div>
                      {l.duration ? <div className="text-xs text-gray-500 mt-1">{Math.round(l.duration)} min</div> : null}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
