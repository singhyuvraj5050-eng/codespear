import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [scrollProgress, setScrollProgress] = useState(0);

  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const [userRes, repoRes] = await Promise.all([
          fetch(`http://https://devsync-874r.onrender.com/userProfile/${userId}`, { headers }),
          fetch(`http://https://devsync-874r.onrender.com/repo/user/${userId}`, { headers }),
        ]);
        const userData = await userRes.json();
        const repoData = await repoRes.json();
        setProfile(userData);
        setFormData({ email: userData.email || '', password: '' });
        setRepos(Array.isArray(repoData) ? repoData : []);
      } catch (err) {
        console.log('Error fetching profile', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const response = await fetch(`https://devsync-874r.onrender.com/updateProfile/${userId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setProfile((prev) => ({ ...prev, email: formData.email }));
        setMessage('Profile updated successfully!');
        setEditing(false);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message || 'Update failed.');
      }
    } catch (err) {
      setMessage('Server error. Try again.', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    try {
      await fetch(`https://devsync-874r.onrender.com/deleteProfile/${userId}`, { method: 'DELETE', headers });
      localStorage.clear();
      navigate('/auth');
    } catch (err) {
      console.log('Error deleting profile', err);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-950 to-gray-900 flex items-center justify-center" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
      <div className="text-center">
        <div className="text-5xl animate-pulse text-yellow-400 mb-3">⬡</div>
        <p className="text-gray-400 text-sm">Loading your profile...</p>
      </div>
    </div>
  );

  const publicRepos = repos.filter(r => r.visiblity).length;
  const privateRepos = repos.length - publicRepos;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-950 to-gray-900 text-white transition-colors duration-300" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
      
      {/* Scroll progress bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-yellow-500 to-orange-500 z-50 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      ></div>

      {/* Animated background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-40 right-40 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-amber-500/10 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-30 backdrop-blur-xl bg-gray-950/80 border-b border-gray-800/30 px-6 py-5 flex items-center justify-between transition-all duration-300">
        <div className="flex items-center gap-3 group cursor-pointer hover:scale-105 transition-transform">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center font-black text-gray-950 shadow-lg shadow-amber-500/30">
            ⬡
          </div>
          <div>
            <span className="font-black tracking-widest uppercase text-lg bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent">CodeSphere</span>
            <p className="text-gray-500 text-xs">Profile</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-400 hover:text-emerald-400 text-sm font-bold transition-all duration-200 px-4 py-2 rounded-lg hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/30"
          >
            ← Dashboard
          </button>
          <button
            onClick={() => { localStorage.clear(); navigate('/auth'); }}
            className="border border-red-500/30 hover:border-red-500/60 text-red-400 hover:text-red-300 text-sm font-bold px-4 py-2 rounded-lg transition-all duration-200 hover:bg-red-500/10"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 relative z-10">

        {/* Profile Header */}
        <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-3xl p-8 sm:p-12 mb-12 animate-fade-in overflow-hidden relative">
          
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-cyan-500/5 pointer-events-none rounded-3xl"></div>

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">

              {/* Profile Info */}
              <div className="flex items-start gap-6 flex-1">
                <div className="w-24 h-24 bg-gradient-to-br from-amber-500/30 to-yellow-500/30 border-2 border-amber-500/40 rounded-2xl flex items-center justify-center text-5xl font-black text-amber-400 shadow-lg shadow-amber-500/20 flex-shrink-0 group hover:scale-110 transition-transform duration-300">
                  {profile?.username?.[0]?.toUpperCase() || '?'}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="mb-1">
                    <h1 className="text-4xl font-black text-white mb-1">{profile?.username}</h1>
                    <p className="text-amber-400 font-bold text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                      Developer
                    </p>
                  </div>
                  
                  <p className="text-gray-400 text-base mb-4 break-all">{profile?.email}</p>
                  
                  {/* Quick Stats */}
                  <div className="flex flex-wrap gap-6 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="text-amber-400 text-lg">◈</span>
                      <span><span className="font-bold text-white">{repos.length}</span> repositories</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="text-cyan-400 text-lg">◎</span>
                      <span><span className="font-bold text-white">{publicRepos}</span> public</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="text-gray-500 text-lg">◉</span>
                      <span><span className="font-bold text-white">{privateRepos}</span> private</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className="text-blue-400 text-lg">⚑</span>
                      <span><span className="font-bold text-white">{profile?.followedUsers?.length || 0}</span> following</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setEditing(!editing)}
                className={`px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                  editing
                    ? 'bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/50'
                    : 'bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/60 hover:scale-105'
                }`}
              >
                {editing ? '✕ Cancel' : '✎ Edit Profile'}
              </button>
            </div>

            {/* Edit Form */}
            {editing && (
              <form onSubmit={handleUpdate} className="mt-10 pt-10 border-t border-gray-800/50 space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-gray-950/50 border border-gray-700/50 text-gray-100 text-sm rounded-xl px-5 py-4 placeholder-gray-600 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-3">
                      New Password <span className="text-gray-600 normal-case text-xs ml-2">(optional)</span>
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full bg-gray-950/50 border border-gray-700/50 text-gray-100 text-sm rounded-xl px-5 py-4 placeholder-gray-600 focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Message */}
                {message && (
                  <div className={`px-5 py-4 rounded-xl text-sm font-bold flex items-center gap-3 animate-fade-in ${
                    message.includes('success')
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                      : 'bg-red-500/10 border border-red-500/30 text-red-300'
                  }`}>
                    <span>{message.includes('success') ? '✓' : '⚠'}</span>
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:from-emerald-500/50 disabled:to-cyan-500/50 disabled:cursor-not-allowed text-gray-950 font-black text-sm uppercase tracking-widest py-4 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-gray-950/30 border-t-gray-950 rounded-full animate-spin"></span>
                      Saving...
                    </>
                  ) : (
                    <>Save Changes →</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Stats Grid */}
        {!editing && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-12 animate-fade-in" style={{ animationDelay: '100ms' }}>
            {[
              { label: 'Total Repos', value: repos.length, icon: '◈', color: 'from-emerald-500/20 to-emerald-600/20', border: 'border-emerald-500/30' },
              { label: 'Public', value: publicRepos, icon: '◎', color: 'from-cyan-500/20 to-cyan-600/20', border: 'border-cyan-500/30' },
              { label: 'Private', value: privateRepos, icon: '◉', color: 'from-gray-500/20 to-gray-600/20', border: 'border-gray-500/30' },
              { label: 'Following', value: profile?.followedUsers?.length || 0, icon: '⚑', color: 'from-blue-500/20 to-blue-600/20', border: 'border-blue-500/30' },
            ].map((stat, i) => (
              <div
                key={i}
                className={`bg-gray-900/50 backdrop-blur-xl border ${stat.border} rounded-xl p-5 transition-all duration-300 hover:scale-105 hover:shadow-lg group animate-fade-in`}
                style={{ animationDelay: `${(i + 1) * 50}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <div className="relative z-10">
                  <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-2">{stat.label}</p>
                  <p className="text-3xl font-black text-white">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Repositories Section */}
        <div className="mb-16 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-amber-400 to-transparent rounded-full"></div>
              <h2 className="text-2xl font-black text-white">Repositories</h2>
              <span className="ml-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">{repos.length}</span>
            </div>
            <button
              onClick={() => navigate('/repo')}
              className="text-amber-400 hover:text-amber-300 text-sm font-bold transition-colors duration-200 hover:underline"
            >
              View all →
            </button>
          </div>

          {repos.length === 0 ? (
            <div className="text-center py-20 border-2 border-dashed border-gray-800/50 rounded-2xl transition-all duration-300 hover:border-amber-500/30 hover:bg-amber-500/5">
              <p className="text-gray-500 text-base mb-4">No repositories yet</p>
              <button
                onClick={() => navigate('/repo')}
                className="text-emerald-400 hover:text-emerald-300 font-bold text-sm transition-colors duration-200 hover:underline"
              >
                + Create your first repository
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {repos.map((repo, i) => (
                <div
                  key={repo._id}
                  onClick={() => navigate(`/repo/${repo._id}`)}
                  className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 hover:border-emerald-500/40 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl group animate-fade-in"
                  style={{ animationDelay: `${(i + 1) * 30}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-500/20 to-amber-600/20 border border-yellow-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <span className="text-yellow-400 text-lg">◈</span>
                    </div>
                    <span className={`text-xs px-3 py-1.5 rounded-full font-bold border transition-all duration-300 ${
                      repo.visiblity
                    ? 'text-yellow-400 border-yellow-500/40 bg-yellow-500/10 group-hover:border-yellow-500/60'
                        : 'text-gray-400 border-gray-700/50 bg-gray-800/30'
                    }`}>
                      {repo.visiblity ? 'Public' : 'Private'}
                    </span>
                  </div>
                  
                  <h3 className="text-white font-bold text-lg mb-2 group-hover:text-yellow-400 transition-colors duration-300">
                    {repo.name}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                    {repo.description || 'No description provided.'}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <span className="text-yellow-400">⚑</span>
                      {repo.issues?.length || 0} issues
                    </span>
                    <span className="text-gray-700 group-hover:text-yellow-400 transition-colors duration-300">→</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="bg-red-500/5 backdrop-blur-xl border border-red-500/20 rounded-2xl p-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-red-400 font-black text-lg uppercase tracking-widest mb-2">Danger Zone</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Permanently delete your account and all associated repositories. This action cannot be undone.
              </p>
            </div>
          </div>
          
          <button
            onClick={handleDelete}
            className="mt-6 bg-red-500/10 hover:bg-red-500/20 border border-red-500/40 text-red-400 hover:text-red-300 text-sm font-bold uppercase tracking-widest px-6 py-3 rounded-xl transition-all duration-200 hover:border-red-500/60 hover:scale-105"
          >
            Delete Account
          </button>
        </div>

      </div>

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

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>
    </div>
  );
}

export default Profile;
