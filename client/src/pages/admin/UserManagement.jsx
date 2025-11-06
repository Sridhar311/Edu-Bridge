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
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">User Management</h2>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <input 
            value={query} 
            onChange={(e)=>setQuery(e.target.value)} 
            placeholder="Search name/email" 
            className="flex-1 px-3 sm:px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
          />
          <select 
            value={role} 
            onChange={(e)=>setRole(e.target.value)} 
            className="px-3 sm:px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:ring-2 focus:ring-primary-500 outline-none"
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="teacher">Teachers</option>
            <option value="admin">Admins</option>
          </select>
          <button 
            onClick={load} 
            className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors text-sm font-medium"
          >
            <i className="fas fa-sync-alt mr-2"></i>Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Loading users...</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-users text-2xl text-gray-400"></i>
          </div>
          <p className="text-gray-600 dark:text-gray-400">No users found</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Email</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">Role</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">Status</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u._id} className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-4 py-3 text-gray-900 dark:text-white">{u.name}</td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{u.email}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 capitalize">{u.role}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {u.role === 'teacher' ? (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${u.approved ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'}`}>
                          {u.approved ? 'Approved' : 'Pending'}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-center">
                        {u.role === 'teacher' && !u.approved && (
                          <>
                            <button onClick={() => onApprove(u._id)} className="px-3 py-1.5 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors text-xs font-medium">
                              <i className="fas fa-check mr-1"></i>Approve
                            </button>
                            <button onClick={() => onReject(u._id)} className="px-3 py-1.5 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700 transition-colors text-xs font-medium">
                              <i className="fas fa-times mr-1"></i>Reject
                            </button>
                          </>
                        )}
                        <button onClick={() => onDelete(u._id)} className="px-3 py-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors text-xs font-medium">
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3">
            {filtered.map(u => (
              <div key={u._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{u.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 break-all">{u.email}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 capitalize ml-2 flex-shrink-0">
                    {u.role}
                  </span>
                </div>
                
                {u.role === 'teacher' && (
                  <div className="mb-3 flex items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${u.approved ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'}`}>
                      {u.approved ? 'Approved' : 'Pending'}
                    </span>
                  </div>
                )}

                <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  {u.role === 'teacher' && !u.approved && (
                    <>
                      <button 
                        onClick={() => onApprove(u._id)} 
                        className="flex-1 px-3 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        <i className="fas fa-check mr-1"></i>Approve
                      </button>
                      <button 
                        onClick={() => onReject(u._id)} 
                        className="flex-1 px-3 py-2 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700 transition-colors text-sm font-medium"
                      >
                        <i className="fas fa-times mr-1"></i>Reject
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => onDelete(u._id)} 
                    className="${u.role === 'teacher' && !u.approved ? 'w-auto px-4' : 'flex-1'} py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    <i className="fas fa-trash mr-1"></i>Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
