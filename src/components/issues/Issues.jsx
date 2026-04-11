// Issues.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Issues() {
  const [issues, setIssues] = useState([]);
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editIssue, setEditIssue] = useState(null);
  const [newIssue, setNewIssue] = useState({ title: '', description: '', repoId: '' });
  const [creating, setCreating] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const d = darkMode;
  const bg = d ? 'bg-gray-950' : 'bg-gray-50';
  const text = d ? 'text-white' : 'text-gray-900';
  const muted = d ? 'text-gray-400' : 'text-gray-500';
  const card = d ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';
  const inputBg = d ? 'bg-gray-950 border-gray-800 text-gray-100 placeholder-gray-600' : 'bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-400';
  const navBg = d ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [issueRes, repoRes] = await Promise.all([
          fetch(`https://devsync-874r.onrender.com/issue/all`, { headers }),
          fetch(`https://devsync-874r.onrender.com/repo/user/${userId}`, { headers }),
        ]);
        const issueData = await issueRes.json();
        const repoData = await repoRes.json();
        setIssues(Array.isArray(issueData) ? issueData : []);
        setRepositories(Array.isArray(repoData) ? repoData : []);
      } catch (err) {
        console.log('Error fetching issues', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = issues.filter((issue) => {
    const matchStatus = filterStatus === 'all' || issue.status === filterStatus;
    const matchSearch = !searchQuery.trim() || issue.title?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch(`https://devsync-874r.onrender.com/issue/create/${newIssue.repoId}`, {
        method: 'POST', headers,
        body: JSON.stringify({ title: newIssue.title, description: newIssue.description }),
      });
      const data = await res.json();
      if (res.ok) {
        setIssues((prev) => [...prev, { ...data, status: 'open' }]);
        setShowCreateModal(false);
        setNewIssue({ title: '', description: '', repoId: '' });
      }
    } catch (err) {
      console.log('Error creating issue', err);
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch(`https://devsync-874r.onrender.com/issue/update/${editIssue._id}`, {
        method: 'PUT', headers,
        body: JSON.stringify({ title: editIssue.title, description: editIssue.description, status: editIssue.status }),
      });
      if (res.ok) {
        setIssues((prev) => prev.map((i) => (i._id === editIssue._id ? { ...i, ...editIssue } : i)));
        setShowEditModal(false);
        setEditIssue(null);
      }
    } catch (err) {
      console.log('Error editing issue', err);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (issueId) => {
    if (!window.confirm('Delete this issue?')) return;
    try {
      await fetch(`https://devsync-874r.onrender.com/issue/delete/${issueId}`, { method: 'DELETE', headers });
      setIssues((prev) => prev.filter((i) => i._id !== issueId));
    } catch (err) {
      console.log('Error deleting issue', err);
    }
  };

  const handleStatusChange = async (issueId, status) => {
    try {
      await fetch(`https://devsync-874r.onrender.com/issue/update/${issueId}`, {
        method: 'PUT', headers,
        body: JSON.stringify({ status }),
      });
      setIssues((prev) => prev.map((i) => (i._id === issueId ? { ...i, status } : i)));
    } catch (err) {
      console.log('Error updating status', err);
    }
  };

  const statusConfig = {
    open: { color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', icon: '◎' },
    'in-progress': { color: 'text-yellow-400', border: 'border-yellow-500/30', bg: 'bg-yellow-500/10', icon: '◑' },
    closed: { color: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-500/10', icon: '✕' },
  };

  const counts = {
    all: issues.length,
    open: issues.filter(i => i.status === 'open' || !i.status).length,
    'in-progress': issues.filter(i => i.status === 'in-progress').length,
    closed: issues.filter(i => i.status === 'closed').length,
  };

  return (
    <div className={`min-h-screen ${bg} ${text}`} style={{ fontFamily: "'Courier New', monospace" }}>

      {/* Navbar */}
      <nav className={`${navBg} border-b px-6 py-4 flex items-center justify-between sticky top-0 z-30`}>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className={`${muted} hover:text-emerald-400 text-sm transition`}>
            ← Dashboard
          </button>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 text-lg">⚑</span>
            <span className={`font-black tracking-widest uppercase text-sm ${text}`}>Issues</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-yellow-400">☀</span>
            <button onClick={() => setDarkMode(!darkMode)}
              className={`w-11 h-6 rounded-full transition-colors relative ${darkMode ? 'bg-yellow-500' : 'bg-gray-300'}`}>
              <span className={`absolute top-1 w-4 h-4 rounded-full transition-all bg-white ${darkMode ? 'left-6' : 'left-1'}`}></span>
            </button>
            <span className="text-xs text-gray-400">🌙</span>
          </div>
          <button onClick={() => setShowCreateModal(true)}
            className="bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-lg transition">
            + New Issue
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(counts).map(([status, count]) => (
            <div key={status} className={`${card} border rounded-xl p-4 cursor-pointer transition hover:border-yellow-500/30`}
              onClick={() => setFilterStatus(status)}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs uppercase tracking-widest ${muted}`}>{status}</span>
                <span className={statusConfig[status]?.icon ? statusConfig[status].color : 'text-yellow-400'}>
                  {statusConfig[status]?.icon || '◈'}
                </span>
              </div>
              <p className={`text-2xl font-black ${text}`}>{count}</p>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <span className={`absolute left-4 top-1/2 -translate-y-1/2 ${muted} text-sm`}>⌕</span>
            <input type="text" placeholder="Search issues..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full border text-sm rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition ${inputBg}`}
            />
          </div>
          <div className={`flex gap-1 border rounded-lg p-1 ${d ? 'bg-gray-900 border-gray-800' : 'bg-gray-100 border-gray-200'}`}>
            {['all', 'open', 'in-progress', 'closed'].map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className={`px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition ${
                  filterStatus === s ? 'bg-emerald-500 text-gray-950' : `${muted}`
                }`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Issues List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4 animate-pulse text-emerald-400">⬡</div>
            <p className={`text-sm ${muted}`}>Loading issues...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={`text-center py-20 border border-dashed rounded-xl ${d ? 'border-gray-800' : 'border-gray-300'}`}>
            <p className={`${muted} text-sm mb-4`}>No issues found</p>
            <button onClick={() => setShowCreateModal(true)} className="text-emerald-400 hover:text-emerald-300 text-sm">
              + Raise first issue
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((issue) => {
              const sc = statusConfig[issue.status] || statusConfig.open;
              return (
                <div key={issue._id} className={`${card} border rounded-xl p-5 transition group hover:border-emerald-500/30`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <span className={`mt-0.5 flex-shrink-0 ${sc.color}`}>{sc.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap mb-1">
                          <h3 className={`font-black text-sm ${text}`}>{issue.title}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${sc.color} ${sc.border} ${sc.bg}`}>
                            {issue.status || 'open'}
                          </span>
                        </div>
                        <p className={`${muted} text-xs leading-relaxed line-clamp-2`}>
                          {issue.description || 'No description.'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition flex-shrink-0">
                      {issue.status !== 'closed' && (
                        <button
                          onClick={() => handleStatusChange(issue._id, issue.status === 'open' ? 'in-progress' : 'closed')}
                          className={`text-xs ${muted} hover:text-yellow-400 border ${d ? 'border-gray-700 hover:border-yellow-500/30' : 'border-gray-300'} px-2.5 py-1.5 rounded-lg transition`}>
                          {issue.status === 'open' ? '▶ Start' : '✓ Close'}
                        </button>
                      )}
                      {issue.status === 'closed' && (
                        <button onClick={() => handleStatusChange(issue._id, 'open')}
                          className={`text-xs ${muted} hover:text-emerald-400 border ${d ? 'border-gray-700' : 'border-gray-300'} px-2.5 py-1.5 rounded-lg transition`}>
                          ↺ Reopen
                        </button>
                      )}
                      <button onClick={() => { setEditIssue({ ...issue }); setShowEditModal(true); }}
                        className={`text-xs ${muted} hover:text-emerald-400 border ${d ? 'border-gray-700 hover:border-emerald-500/30' : 'border-gray-300'} px-2.5 py-1.5 rounded-lg transition`}>
                        ✎ Edit
                      </button>
                      <button onClick={() => handleDelete(issue._id)}
                        className={`text-xs text-red-400/60 hover:text-red-400 border ${d ? 'border-gray-700 hover:border-red-500/30' : 'border-gray-300'} px-2.5 py-1.5 rounded-lg transition`}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Issue Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className={`${d ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-8 w-full max-w-md`}>
            <h2 className={`${text} font-black text-lg mb-6`}>Raise Issue</h2>
            <form onSubmit={handleCreate} className="space-y-5">
              <div>
                <label className={`block ${muted} text-xs uppercase tracking-widest mb-2`}>Repository</label>
                <select value={newIssue.repoId} onChange={(e) => setNewIssue({ ...newIssue, repoId: e.target.value })} required
                  className={`w-full border text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 transition ${inputBg}`}>
                  <option value="">Select repository</option>
                  {repositories.map((r) => (
                    <option key={r._id} value={r._id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={`block ${muted} text-xs uppercase tracking-widest mb-2`}>Title</label>
                <input type="text" placeholder="Bug: something broke..." value={newIssue.title}
                  onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })} required
                  className={`w-full border text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 transition ${inputBg}`}
                />
              </div>
              <div>
                <label className={`block ${muted} text-xs uppercase tracking-widest mb-2`}>Description</label>
                <textarea placeholder="Describe the issue in detail..." value={newIssue.description}
                  onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })} rows={4}
                  className={`w-full border text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 transition resize-none ${inputBg}`}
                />
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowCreateModal(false)}
                  className={`flex-1 border ${d ? 'border-gray-700 text-gray-400' : 'border-gray-300 text-gray-500'} text-sm py-3 rounded-lg transition`}>
                  Cancel
                </button>
                <button type="submit" disabled={creating}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-gray-950 font-bold text-sm py-3 rounded-lg transition">
                  {creating ? 'Raising...' : 'Raise Issue →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Issue Modal */}
      {showEditModal && editIssue && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className={`${d ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border rounded-xl p-8 w-full max-w-md`}>
            <h2 className={`${text} font-black text-lg mb-6`}>Edit Issue</h2>
            <form onSubmit={handleEdit} className="space-y-5">
              <div>
                <label className={`block ${muted} text-xs uppercase tracking-widest mb-2`}>Title</label>
                <input type="text" value={editIssue.title}
                  onChange={(e) => setEditIssue({ ...editIssue, title: e.target.value })} required
                  className={`w-full border text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 transition ${inputBg}`}
                />
              </div>
              <div>
                <label className={`block ${muted} text-xs uppercase tracking-widest mb-2`}>Description</label>
                <textarea value={editIssue.description || ''}
                  onChange={(e) => setEditIssue({ ...editIssue, description: e.target.value })} rows={4}
                  className={`w-full border text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 transition resize-none ${inputBg}`}
                />
              </div>
              <div>
                <label className={`block ${muted} text-xs uppercase tracking-widest mb-2`}>Status</label>
                <select value={editIssue.status || 'open'}
                  onChange={(e) => setEditIssue({ ...editIssue, status: e.target.value })}
                  className={`w-full border text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-emerald-500 transition ${inputBg}`}>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowEditModal(false)}
                  className={`flex-1 border ${d ? 'border-gray-700 text-gray-400' : 'border-gray-300 text-gray-500'} text-sm py-3 rounded-lg transition`}>
                  Cancel
                </button>
                <button type="submit" disabled={creating}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-gray-950 font-bold text-sm py-3 rounded-lg transition">
                  {creating ? 'Saving...' : 'Save Changes →'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Issues;
