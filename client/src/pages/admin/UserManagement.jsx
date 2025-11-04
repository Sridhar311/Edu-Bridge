import React, { useEffect, useMemo, useState } from 'react';
import { getAllUsers, approveTeacher, rejectTeacher, deleteUser } from '../../utils/adminApi';
import toast from 'react-hot-toast';

export default function UserManagement() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [role, setRole] = useState('all');

  const load = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      setUsers(res.data?.users || []);
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => users.filter(u => {
    const q = query.trim().toLowerCase();
    const matchQ = !q || u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
    const matchR = role === 'all' || u.role === role;
    return matchQ && matchR;
  }), [users, query, role]);

  const onApprove = async (id) => {
    try {
      await approveTeacher(id);
      toast.success('Teacher approved');
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to approve');
    }
  };
  const onReject = async (id) => {
    try {
      await rejectTeacher(id);
      toast.success('Teacher rejected');
      load();
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to reject');
    }
  };
  const onDelete = async (id) => {
    if (!confirm('Delete this user? This cannot be undone.')) return;
    try {
      await deleteUser(id);
      toast.success('User deleted');
      setUsers(prev => prev.filter(u => String(u._id) !== String(id)));
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">User Management</h2>
        <div className="flex items-center gap-2">
          <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search name/email" className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60"/>
          <select value={role} onChange={(e)=>setRole(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60">
            <option value="all">All</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
          <button onClick={load} className="px-3 py-2 rounded-lg border">Refresh</button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800/60">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="px-4 py-6 text-center text-gray-600" colSpan={5}>Loading…</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td className="px-4 py-6 text-center text-gray-600" colSpan={5}>No users</td></tr>
            ) : filtered.map(u => (
              <tr key={u._id} className="border-t border-gray-100 dark:border-gray-800">
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3 text-center"><span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800">{u.role}</span></td>
                <td className="px-4 py-3 text-center">{u.role === 'teacher' ? (u.approved ? 'approved' : 'pending') : '-'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2 justify-end">
                    {u.role === 'teacher' && !u.approved && (
                      <>
                        <button onClick={() => onApprove(u._id)} className="px-3 py-1 rounded bg-green-600 text-white">Approve</button>
                        <button onClick={() => onReject(u._id)} className="px-3 py-1 rounded bg-yellow-600 text-white">Reject</button>
                      </>
                    )}
                    <button onClick={() => onDelete(u._id)} className="px-3 py-1 rounded bg-red-600 text-white">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
