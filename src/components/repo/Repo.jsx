import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Repo() {
  const [repositories, setRepositories] = useState([]);
  const [allRepos, setAllRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editRepo, setEditRepo] = useState(null);
  const [newRepo, setNewRepo] = useState({ name: '', description: '', visiblity: false });
  const [creating, setCreating] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const d = darkMode;
  const bg = d ? 'from-gray-950 via-gray-950 to-gray-900' : 'from-gray-50 via-white to-gray-100';
  const text = d ? 'text-white' : 'text-gray-900';
  const muted = d ? 'text-gray-400' : 'text-gray-600';
  const card = d ? 'bg-gray-900/50 border-gray-800/50 backdrop-blur-xl' : 'bg-white/50 border-gray-200/50 backdrop-blur-xl';
  const inputBg = d ? 'bg-gray-900/50 border-gray-700/50 text-gray-100 placeholder-gray-600' : 'bg-gray-100/50 border-gray-300/50 text-gray-900 placeholder-gray-400';
  const navBg = d ? 'bg-gray-950/80 border-gray-800/30 backdrop-blur-xl' : 'bg-white/80 border-gray-200/30 backdrop-blur-xl';

  useEffect(() => {
    const fetchRepos = async () => {
      setLoading(true);
      try {
        const [myRes, allRes] = await Promise.all([
          fetch(`https://devsync-874r.onrender.com/repo/user/${userId}`, { headers }),
          fetch(`https://devsync-874r.onrender.com/repo/all`, { headers }),
        ]);
        const myData = await myRes.json();
        const allData = await allRes.json();
        setRepositories(Array.isArray(myData) ? myData : []);
        setAllRepos(Array.isArray(allData) ? allData : []);
      } catch (err) {
        console.log('Error fetching repos', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / totalScroll) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const source = activeTab === 'my' ? repositories : allRepos;
  const filtered = !searchQuery.trim()
    ? source
    : source.filter((r) => r.name?.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch('https://devsync-874r.onrender.com/createRepo', {
        method: 'POST', headers,
        body: JSON.stringify({ ...newRepo, owner: userId }),
      });
      const data = await res.json();
      if (res.ok) {
        setRepositories((prev) => [...prev, { ...newRepo, _id: data.repositaryId, issues: [] }]);
        setShowCreateModal(false);
        setNewRepo({ name: '', description: '', visiblity: false });
      }
    } catch (err) {
      console.log('Error creating repo', err);
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch(`https://devsync-874r.onrender.com/repo/update/${editRepo._id}`, {
        method: 'PUT', headers,
        body: JSON.stringify({ description: editRepo.description }),
      });
      if (res.ok) {
        setRepositories((prev) =>
          prev.map((r) => (r._id === editRepo._id ? { ...r, description: editRepo.description } : r))
        );
        setShowEditModal(false);
        setEditRepo(null);
      }
    } catch (err) {
      console.log('Error editing repo', err);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (repoId) => {
    if (!window.confirm('Delete this repository?')) return;
    try {
      await fetch(`https://devsync-874r.onrender.com/repo/delete/${repoId}`, { method: 'DELETE', headers });
      setRepositories((prev) => prev.filter((r) => r._id !== repoId));
    } catch (err) {
      console.log('Error deleting repo', err);
    }
  };

  const handleToggle = async (repoId) => {
    try {
      const res = await fetch(`https://devsync-874r.onrender.com/repo/toggle/${repoId}`, { headers });
      const data = await res.json();
      setRepositories((prev) =>
        prev.map((r) => (r._id === repoId ? { ...r, visiblity: data.repositary?.visiblity } : r))
      );
    } catch (err) {
      console.log('Error toggling', err);
    }
  };

  const publicCount = repositories.filter(r => r.visiblity).length;
  const privateCount = repositories.filter(r => !r.visiblity).length;
  const totalIssues = repositories.reduce((a, r) => a + (r.issues?.length || 0), 0);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bg} ${text} transition-colors duration-300`} style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
      
      {/* Scroll progress bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 z-50 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      ></div>

      {/* Animated background orbs */}
      {d && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 right-40 w-96 h-96 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl opacity-40 animate-pulse"></div>
          <div className="absolute -bottom-40 left-20 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-emerald-500/10 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      )}

      {/* Navbar */}
      <nav className={`${navBg} border-b ${d ? 'border-gray-800/30' : 'border-gray-200/30'} px-6 py-5 flex items-center justify-between sticky top-0 z-30 transition-all duration-300`}>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard')} 
            className={`${muted} hover:text-yellow-400 text-sm font-bold transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-yellow-500/10`}
          >
            ← Dashboard
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-500 flex items-center justify-center font-black text-gray-950 shadow-lg shadow-amber-500/30">
              ◈
            </div>
            <span className={`font-black tracking-widest uppercase text-lg bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent`}>Repositories</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Dark/Light Toggle */}
          <div className="flex items-center gap-3 bg-gray-800/30 px-3 py-2 rounded-lg">
            <button
              title="Light mode"
              onClick={() => setDarkMode(false)}
              className={`text-lg transition-all duration-300 ${!darkMode ? 'scale-125 text-yellow-400' : 'opacity-50 hover:opacity-100'}`}
            >
              ☀
            </button>
            <div className="w-px h-4 bg-gray-600/50"></div>
            <button
              title="Dark mode"
              onClick={() => setDarkMode(true)}
              className={`text-lg transition-all duration-300 ${darkMode ? 'scale-125 text-blue-400' : 'opacity-50 hover:opacity-100'}`}
            >
              🌙
            </button>
          </div>

          {/* Create Button */}
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-gray-950 font-black text-sm uppercase tracking-widest px-6 py-2.5 rounded-lg transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105"
          >
            + New Repo
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 relative z-10">

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12 animate-fade-in">
          {[
            { label: 'My Repos', value: repositories.length, icon: '◈', color: 'from-emerald-500/20 to-emerald-600/20', border: 'border-emerald-500/30' },
            { label: 'Public', value: publicCount, icon: '◎', color: 'from-cyan-500/20 to-cyan-600/20', border: 'border-cyan-500/30' },
            { label: 'Private', value: privateCount, icon: '◉', color: 'from-gray-500/20 to-gray-600/20', border: 'border-gray-500/30' },
            { label: 'Total Issues', value: totalIssues, icon: '⚑', color: 'from-yellow-500/20 to-yellow-600/20', border: 'border-yellow-500/30' },
          ].map((stat, i) => (
            <div 
              key={i} 
              className={`${card} border ${stat.border} rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl group animate-fade-in`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs uppercase tracking-widest font-bold ${muted}`}>{stat.label}</span>
                  <span className="text-2xl group-hover:scale-125 transition-transform duration-300">{stat.icon}</span>
                </div>
                <p className={`text-4xl font-black ${text}`}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Search + Tabs */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
          {/* Search Bar */}
          <div className="relative flex-1">
            <span className={`absolute left-4 top-1/2 -translate-y-1/2 ${muted} text-lg`}>⌕</span>
            <input 
              type="text" 
              placeholder="Search repositories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full border text-sm rounded-xl pl-12 pr-5 py-3.5 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 ${inputBg}`}
            />
          </div>

          {/* Tab Toggle */}
          <div className={`flex gap-1 border ${d ? 'bg-gray-900/50 border-gray-800/50' : 'bg-white/50 border-gray-200/50'} rounded-xl p-1 backdrop-blur-xl`}>
            {['my', 'explore'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => { setActiveTab(tab); setSearchQuery(''); }}
                className={`px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                  activeTab === tab 
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-gray-950 shadow-lg shadow-emerald-500/30' 
                    : `${muted} hover:text-emerald-400`
                }`}
              >
                {tab === 'my' ? `Mine (${repositories.length})` : `Explore (${allRepos.length})`}
              </button>
            ))}
          </div>
        </div>

        {/* Repos List */}
        {loading ? (
          <div className="text-center py-24 animate-fade-in">
            <div className="text-5xl mb-4 animate-pulse text-emerald-400">⬡</div>
            <p className={`text-base ${muted}`}>Loading repositories...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={`text-center py-24 border-2 border-dashed ${d ? 'border-gray-800/50' : 'border-gray-300/50'} rounded-2xl transition-all duration-300 hover:border-emerald-500/30 hover:bg-emerald-500/5 animate-fade-in`}>
            <p className={`${muted} text-base mb-4`}>No repositories found</p>
            {activeTab === 'my' && (
              <button 
                onClick={() => setShowCreateModal(true)} 
                className="text-emerald-400 hover:text-emerald-300 font-bold text-sm transition-colors duration-200 hover:underline"
              >
                + Create your first repository
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in" style={{ animationDelay: '300ms' }}>
            {filtered.map((repo, i) => (
              <div 
                key={repo._id} 
                className={`${card} border ${d ? 'border-gray-800/50' : 'border-gray-200/50'} rounded-2xl p-6 transition-all duration-300 hover:border-emerald-500/40 hover:shadow-2xl hover:scale-102 group animate-fade-in`}
                style={{ animationDelay: `${(i + 1) * 30}ms` }}
              >
                <div className="flex items-start justify-between gap-6">
                  {/* Repo Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/30 to-emerald-600/30 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-emerald-400 text-lg">◈</span>
                      </div>
                      <h3 className={`font-black text-base ${text} group-hover:text-emerald-400 transition-colors duration-300`}>
                        {repo.name}
                      </h3>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs px-3 py-1.5 rounded-full font-bold border transition-all duration-300 ${
                          repo.visiblity
                            ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10 group-hover:border-emerald-500/60'
                            : `${muted} ${d ? 'border-gray-700/50 bg-gray-800/30' : 'border-gray-300/50 bg-gray-100/30'}`
                        }`}>
                          {repo.visiblity ? '◎ Public' : '◉ Private'}
                        </span>
                        
                        <span className={`text-xs px-3 py-1.5 rounded-full font-bold border ${d ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400' : 'border-yellow-400/30 bg-yellow-400/10 text-yellow-600'}`}>
                          ⚑ {repo.issues?.length || 0}
                        </span>
                      </div>
                    </div>
                    
                    <p className={`${muted} text-sm leading-relaxed ml-13 line-clamp-2 group-hover:text-gray-300 transition-colors duration-300`}>
                      {repo.description || 'No description provided.'}
                    </p>
                  </div>

                  {/* Actions */}
                  {activeTab === 'my' && (
                    <div className="flex items-center gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex-wrap justify-end">
                      <button 
                        onClick={() => { setEditRepo({ ...repo }); setShowEditModal(true); }}
                        className={`text-xs font-bold px-4 py-2 rounded-lg border transition-all duration-300 ${d ? 'border-gray-700/50 text-gray-400 hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/5' : 'border-gray-300/50 text-gray-600 hover:text-emerald-600 hover:border-emerald-400/40'}`}
                      >
                        ✎ Edit
                      </button>
                      <button 
                        onClick={() => handleToggle(repo._id)}
                        className={`text-xs font-bold px-4 py-2 rounded-lg border transition-all duration-300 ${d ? 'border-gray-700/50 text-gray-400 hover:text-yellow-400 hover:border-yellow-500/40 hover:bg-yellow-500/5' : 'border-gray-300/50 text-gray-600 hover:text-yellow-600 hover:border-yellow-400/40'}`}
                      >
                        ⇄ Toggle
                      </button>
                      <button 
                        onClick={() => navigate(`/repo/${repo._id}`)}
                        className={`text-xs font-bold px-4 py-2 rounded-lg border transition-all duration-300 ${d ? 'border-gray-700/50 text-gray-400 hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/5' : 'border-gray-300/50 text-gray-600 hover:text-emerald-600 hover:border-emerald-400/40'}`}
                      >
                        View →
                      </button>
                      <button 
                        onClick={() => handleDelete(repo._id)}
                        className={`text-xs font-bold px-4 py-2 rounded-lg border transition-all duration-300 text-red-400 hover:text-red-300 border-red-500/30 hover:border-red-500/60 hover:bg-red-500/5`}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in">
          <div className={`${card} border ${d ? 'border-gray-800/50' : 'border-gray-200/50'} rounded-2xl p-8 w-full max-w-md shadow-2xl transform transition-all duration-300 animate-scale-in`}>
            <h2 className={`${text} font-black text-2xl mb-2`}>Create Repository</h2>
            <p className={`${muted} text-sm mb-8`}>Start a new project and collaborate with your team</p>
            
            <form onSubmit={handleCreate} className="space-y-6">
              <div>
                <label className={`block ${muted} text-xs font-bold uppercase tracking-widest mb-3`}>Repository Name</label>
                <input 
                  type="text" 
                  placeholder="my-awesome-project" 
                  value={newRepo.name}
                  onChange={(e) => setNewRepo({ ...newRepo, name: e.target.value })} 
                  required
                  className={`w-full border text-sm rounded-xl px-5 py-3.5 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 ${inputBg}`}
                />
              </div>

              <div>
                <label className={`block ${muted} text-xs font-bold uppercase tracking-widest mb-3`}>Description</label>
                <textarea 
                  placeholder="What's this project about?" 
                  value={newRepo.description}
                  onChange={(e) => setNewRepo({ ...newRepo, description: e.target.value })} 
                  rows={4}
                  className={`w-full border text-sm rounded-xl px-5 py-3.5 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 resize-none ${inputBg}`}
                />
              </div>

              <div className="flex items-center justify-between bg-gray-800/30 rounded-xl p-4 border border-gray-700/30">
                <div>
                  <p className={`${text} font-bold text-sm`}>Repository Visibility</p>
                  <p className={`${muted} text-xs`}>{newRepo.visiblity ? 'Public - Anyone can see' : 'Private - Only you'}</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => setNewRepo({ ...newRepo, visiblity: !newRepo.visiblity })}
                  className={`relative w-12 h-7 rounded-full transition-all duration-300 ${newRepo.visiblity ? 'bg-gradient-to-r from-emerald-500 to-cyan-500' : 'bg-gray-700'}`}
                >
                  <span className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all duration-300 ${newRepo.visiblity ? 'left-6' : 'left-1'}`}></span>
                </button>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className={`flex-1 border ${d ? 'border-gray-700/50 text-gray-400 hover:text-gray-300 hover:bg-gray-800/30' : 'border-gray-300/50 text-gray-600 hover:text-gray-700 hover:bg-gray-100/30'} text-sm font-bold py-3.5 rounded-xl transition-all duration-300`}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={creating || !newRepo.name.trim()}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:from-emerald-500/50 disabled:to-cyan-500/50 disabled:cursor-not-allowed text-gray-950 font-black text-sm uppercase tracking-widest py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-gray-950/30 border-t-gray-950 rounded-full animate-spin"></span>
                      Creating...
                    </>
                  ) : (
                    <>Create Repo →</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editRepo && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 animate-fade-in">
          <div className={`${card} border ${d ? 'border-gray-800/50' : 'border-gray-200/50'} rounded-2xl p-8 w-full max-w-md shadow-2xl transform transition-all duration-300 animate-scale-in`}>
            <h2 className={`${text} font-black text-2xl mb-2`}>Edit Repository</h2>
            <p className={`${muted} text-sm mb-8`}>{editRepo.name}</p>
            
            <form onSubmit={handleEdit} className="space-y-6">
              <div>
                <label className={`block ${muted} text-xs font-bold uppercase tracking-widest mb-3`}>Description</label>
                <textarea 
                  value={editRepo.description || ''}
                  onChange={(e) => setEditRepo({ ...editRepo, description: e.target.value })} 
                  rows={5}
                  placeholder="Update the description..."
                  className={`w-full border text-sm rounded-xl px-5 py-3.5 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 resize-none ${inputBg}`}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowEditModal(false)}
                  className={`flex-1 border ${d ? 'border-gray-700/50 text-gray-400 hover:text-gray-300 hover:bg-gray-800/30' : 'border-gray-300/50 text-gray-600 hover:text-gray-700 hover:bg-gray-100/30'} text-sm font-bold py-3.5 rounded-xl transition-all duration-300`}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={creating}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:from-emerald-500/50 disabled:to-cyan-500/50 disabled:cursor-not-allowed text-gray-950 font-black text-sm uppercase tracking-widest py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-gray-950/30 border-t-gray-950 rounded-full animate-spin"></span>
                      Saving...
                    </>
                  ) : (
                    <>Save Changes →</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .hover:scale-102:hover {
          transform: scale(1.02);
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}

export default Repo;
