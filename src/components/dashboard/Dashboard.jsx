/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [repositories, setRepositories] = useState([]);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [username, setUsername] = useState('');
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
  const navBg = d ? 'bg-gray-950/80 border-gray-800/30 backdrop-blur-xl' : 'bg-white/80 border-gray-200/30 backdrop-blur-xl';
  const hoverBg = d ? 'hover:bg-gray-800/50' : 'hover:bg-gray-100/50';

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [myRes, issueRes, userRes] = await Promise.all([
          fetch(`https://devsync-874r.onrender.com/repo/user/${userId}`, { headers }),
          fetch(`https://devsync-874r.onrender.com/issue/all`, { headers }),
          fetch(`https://devsync-874r.onrender.com/userProfile/${userId}`, { headers }),
        ]);
        const myData = await myRes.json();
        const issueData = await issueRes.json();
        const userData = await userRes.json();
        setRepositories(Array.isArray(myData) ? myData : []);
        setIssues(Array.isArray(issueData) ? issueData : []);
        setUsername(userData?.username || 'Developer');
      } catch (err) {
        console.log('Error fetching data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
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

  const openIssues = issues.filter(i => i.status === 'open' || !i.status).length;
  const inProgressIssues = issues.filter(i => i.status === 'in-progress').length;
  const closedIssues = issues.filter(i => i.status === 'closed').length;
  const publicRepos = repositories.filter(r => r.visiblity).length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const stats = [
    { label: 'Total Repos', value: repositories.length, icon: '◈', color: 'from-emerald-500/20 to-emerald-600/20', border: 'border-emerald-500/30', text: 'text-emerald-400' },
    { label: 'Public Repos', value: publicRepos, icon: '◎', color: 'from-blue-500/20 to-blue-600/20', border: 'border-blue-500/30', text: 'text-blue-400' },
    { label: 'Total Issues', value: issues.length, icon: '⚑', color: 'from-yellow-500/20 to-yellow-600/20', border: 'border-yellow-500/30', text: 'text-yellow-400' },
    { label: 'Open Issues', value: openIssues, icon: '◑', color: 'from-red-500/20 to-red-600/20', border: 'border-red-500/30', text: 'text-red-400' },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bg} ${text} transition-colors duration-300`} style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
      
      {/* Scroll progress bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 z-50 transition-all duration-300"
        style={{ width: `${scrollProgress}%` }}
      ></div>

      {/* Background orbs */}
      {d && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-20 right-40 w-96 h-96 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl opacity-40 animate-pulse"></div>
          <div className="absolute bottom-40 left-20 w-96 h-96 bg-gradient-to-tr from-blue-500/10 to-amber-500/10 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      )}

      {/* Navbar */}
      <nav className={`${navBg} border-b ${d ? 'border-gray-800/30' : 'border-gray-200/30'} px-6 py-5 flex items-center justify-between sticky top-0 z-30 transition-all duration-300`}>
        <div className="flex items-center gap-3 group cursor-pointer hover:scale-105 transition-transform">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-lg flex items-center justify-center font-black text-gray-950 shadow-lg shadow-yellow-500/30">
            ⬡
          </div>
          <div>
            <span className={`font-black tracking-widest uppercase text-lg bg-gradient-to-r from-amber-400 to-yellow-400 bg-clip-text text-transparent`}>CodeSphere</span>
            <p className={`${muted} text-xs`}>Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          {/* Dark / Light Toggle */}
          <div className="flex items-center gap-3 bg-gray-800/30 px-3 py-2 rounded-lg">
            <button
              title="Light mode"
              onClick={() => setDarkMode(false)}
              className={`text-xl transition-all duration-300 ${!darkMode ? 'scale-125 text-yellow-400' : 'opacity-50 hover:opacity-100'}`}
            >
              ☀
            </button>
            <div className="w-px h-4 bg-gray-600/50"></div>
            <button
              title="Dark mode"
              onClick={() => setDarkMode(true)}
              className={`text-xl transition-all duration-300 ${darkMode ? 'scale-125 text-blue-400' : 'opacity-50 hover:opacity-100'}`}
            >
              🌙
            </button>
          </div>

          {/* Profile */}
          <button
            onClick={() => navigate('/profile')}
            className={`flex items-center gap-2 ${muted} hover:text-emerald-400 text-sm font-bold transition-all duration-200 px-4 py-2 rounded-lg border ${d ? 'border-gray-700/50 hover:border-emerald-500/40' : 'border-gray-300/50 hover:border-emerald-400/40'} ${hoverBg}`}
          >
            <span className="text-lg">👤</span>
            <span className="hidden sm:inline">Profile</span>
          </button>

          {/* Logout */}
          <button
            onClick={() => { localStorage.clear(); navigate('/auth'); }}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm font-bold transition-all duration-200 px-4 py-2 rounded-lg border border-transparent hover:border-red-500/30 hover:bg-red-500/10"
          >
            <span className="text-lg">⇥</span>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 relative z-10">

        {/* Hero Greeting */}
        <div className="mb-16 animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-6 bg-gradient-to-b from-emerald-400 to-transparent rounded-full"></div>
            <p className="text-emerald-400 text-xs uppercase tracking-widest font-bold">
              {getGreeting()}
            </p>
          </div>
          <h1 className={`text-5xl md:text-6xl font-black mb-4 leading-tight`}>
            Welcome back, <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">{username}</span> 👋
          </h1>
          <p className={`${muted} text-lg max-w-2xl font-light leading-relaxed`}>
            Here's your development overview. Check your projects, track issues, and manage your repositories.
          </p>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`${card} border ${stat.border} rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl group animate-fade-in`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <span className={`${muted} text-xs uppercase tracking-widest font-bold`}>{stat.label}</span>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-gradient-to-br ${stat.color} border ${stat.border}`}>
                    <span className={`${stat.text} text-lg group-hover:scale-125 transition-transform duration-300`}>{stat.icon}</span>
                  </div>
                </div>
                <p className={`text-4xl font-black ${text} group-hover:${stat.text} transition-colors duration-300`}>
                  {loading ? '...' : stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-16">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-1 h-5 bg-gradient-to-b from-emerald-400 to-transparent rounded-full"></div>
            <h2 className={`text-sm uppercase tracking-widest font-bold ${muted}`}>Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            {/* Repositories Card */}
            <button
              onClick={() => navigate('/repo')}
              className={`${card} border ${d ? 'border-emerald-500/20' : 'border-emerald-400/20'} rounded-2xl p-8 text-left transition-all duration-300 hover:border-emerald-500/50 hover:shadow-2xl group hover:scale-105`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/40 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-emerald-400 text-2xl">◈</span>
                </div>
                <span className={`${muted} group-hover:text-emerald-400 transition-colors text-2xl group-hover:scale-125 duration-300`}>→</span>
              </div>
              <h3 className={`font-black text-xl ${text} mb-2 group-hover:text-emerald-400 transition-colors duration-300`}>Repositories</h3>
              <p className={`${muted} text-sm leading-relaxed`}>
                {loading ? 'Loading...' : `${repositories.length} repos — ${publicRepos} public`}
              </p>
              <p className={`${muted} text-xs mt-3 opacity-70`}>Create, explore, and manage your projects</p>
            </button>

            {/* Issues Card */}
            <button
              onClick={() => navigate('/issues')}
              className={`${card} border ${d ? 'border-yellow-500/20' : 'border-yellow-400/20'} rounded-2xl p-8 text-left transition-all duration-300 hover:border-yellow-500/50 hover:shadow-2xl group hover:scale-105`}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/40 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="text-yellow-400 text-2xl">⚑</span>
                </div>
                <span className={`${muted} group-hover:text-yellow-400 transition-colors text-2xl group-hover:scale-125 duration-300`}>→</span>
              </div>
              <h3 className={`font-black text-xl ${text} mb-2 group-hover:text-yellow-400 transition-colors duration-300`}>Issues</h3>
              <p className={`${muted} text-sm leading-relaxed`}>
                {loading ? 'Loading...' : `${openIssues} open — ${closedIssues} closed`}
              </p>
              <p className={`${muted} text-xs mt-3 opacity-70`}>Track bugs and features</p>
            </button>

          </div>
        </div>

        {/* Issue Stats Mini */}
        {!loading && inProgressIssues > 0 && (
          <div className={`${card} border ${d ? 'border-gray-800/50' : 'border-gray-200/50'} rounded-2xl p-6 mb-16 animate-fade-in`} style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${muted} text-xs uppercase tracking-widest font-bold mb-2`}>In Progress</p>
                <p className={`text-3xl font-black ${text}`}>{inProgressIssues} <span className="text-lg text-yellow-400">◑</span></p>
              </div>
              <div className="text-right">
                <p className={`${muted} text-sm`}>You're actively working on</p>
                <p className={`text-yellow-400 text-sm font-bold`}>{Math.round((inProgressIssues / issues.length) * 100 || 0)}% of total</p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Repos Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-yellow-400 to-transparent rounded-full"></div>
              <h2 className={`text-sm uppercase tracking-widest font-bold ${muted}`}>Recent Repositories</h2>
            </div>
            <button onClick={() => navigate('/repo')} className="text-yellow-400 hover:text-yellow-300 text-xs font-bold transition-colors duration-200 hover:underline">
              View all →
            </button>
          </div>

          {loading ? (
            <div className={`${card} border ${d ? 'border-gray-800/50' : 'border-gray-200/50'} rounded-2xl p-12 text-center`}>
              <div className="text-3xl animate-pulse text-emerald-400 mb-3">⬡</div>
              <p className={`${muted} text-sm`}>Loading your repositories...</p>
            </div>
          ) : repositories.length === 0 ? (
            <div className={`${card} border-2 border-dashed ${d ? 'border-gray-700/50' : 'border-gray-300/50'} rounded-2xl p-12 text-center transition-all duration-300 hover:border-emerald-500/30`}>
              <p className={`${muted} text-base mb-4`}>No repositories yet</p>
              <button onClick={() => navigate('/repo')} className="text-emerald-400 hover:text-emerald-300 font-bold text-sm transition-colors duration-200 hover:underline">
                + Create your first repository
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {repositories.slice(0, 4).map((repo, i) => (
                <div
                  key={repo._id}
                  onClick={() => navigate('/repo')}
                  className={`${card} border ${d ? 'border-gray-800/50' : 'border-gray-200/50'} rounded-xl px-6 py-5 flex items-center justify-between cursor-pointer transition-all duration-300 ${hoverBg} group hover:border-emerald-500/40 hover:scale-102 animate-fade-in`}
                  style={{ animationDelay: `${i * 30}ms` }}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-emerald-400 text-sm">◈</span>
                    </div>
                    <div className="min-w-0">
                      <span className={`font-bold text-base ${text} group-hover:text-emerald-400 transition-colors duration-300`}>{repo.name}</span>
                      <p className={`${muted} text-xs mt-1 line-clamp-1 opacity-75`}>{repo.description || 'No description provided'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                    <span className={`text-xs px-3 py-1.5 rounded-full font-bold border transition-all duration-300 ${
                      repo.visiblity
                        ? 'text-yellow-400 border-yellow-500/40 bg-yellow-500/10 group-hover:border-yellow-500/60'
                        : `${muted} ${d ? 'border-gray-700/50 bg-gray-800/30' : 'border-gray-300/50 bg-gray-100/30'}`
                    }`}>
                      {repo.visiblity ? 'Public' : 'Private'}
                    </span>
                    <span className={`${muted} group-hover:text-yellow-400 transition-all duration-300 text-lg group-hover:translate-x-1`}>→</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Issues Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-yellow-400 to-transparent rounded-full"></div>
              <h2 className={`text-sm uppercase tracking-widest font-bold ${muted}`}>Recent Issues</h2>
            </div>
            <button onClick={() => navigate('/issues')} className="text-yellow-400 hover:text-yellow-300 text-xs font-bold transition-colors duration-200 hover:underline">
              View all →
            </button>
          </div>

          {loading ? (
            <div className={`${card} border ${d ? 'border-gray-800/50' : 'border-gray-200/50'} rounded-2xl p-12 text-center`}>
              <div className="text-3xl animate-pulse text-yellow-400 mb-3">⬡</div>
              <p className={`${muted} text-sm`}>Loading your issues...</p>
            </div>
          ) : issues.length === 0 ? (
            <div className={`${card} border-2 border-dashed ${d ? 'border-gray-700/50' : 'border-gray-300/50'} rounded-2xl p-12 text-center transition-all duration-300 hover:border-yellow-500/30`}>
              <p className={`${muted} text-base mb-4`}>No issues yet</p>
              <button onClick={() => navigate('/issues')} className="text-yellow-400 hover:text-yellow-300 font-bold text-sm transition-colors duration-200 hover:underline">
                + Raise your first issue
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {issues.slice(0, 4).map((issue, i) => {
                const statusConfig = {
                  closed: { icon: '✕', color: 'text-red-400', bg: 'from-red-500/20 to-red-600/20', border: 'border-red-500/30', label: 'Closed' },
                  'in-progress': { icon: '◑', color: 'text-yellow-400', bg: 'from-yellow-500/20 to-yellow-600/20', border: 'border-yellow-500/30', label: 'In Progress' },
                  open: { icon: '◎', color: 'text-emerald-400', bg: 'from-emerald-500/20 to-emerald-600/20', border: 'border-emerald-500/30', label: 'Open' },
                };
                const config = statusConfig[issue.status || 'open'] || statusConfig.open;

                return (
                  <div
                    key={issue._id}
                    onClick={() => navigate('/issues')}
                    className={`${card} border ${d ? 'border-gray-800/50' : 'border-gray-200/50'} rounded-xl px-6 py-5 flex items-center justify-between cursor-pointer transition-all duration-300 ${hoverBg} group hover:border-yellow-500/40 hover:scale-102 animate-fade-in`}
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.bg} border ${config.border} flex items-center justify-center flex-shrink-0`}>
                        <span className={`${config.color} text-sm text-lg`}>{config.icon}</span>
                      </div>
                      <div className="min-w-0">
                        <span className={`font-bold text-base ${text} group-hover:text-yellow-400 transition-colors duration-300`}>{issue.title}</span>
                        <p className={`${muted} text-xs mt-1 line-clamp-1 opacity-75`}>{issue.description || 'No description provided'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                      <span className={`text-xs px-3 py-1.5 rounded-full font-bold border transition-all duration-300 bg-gradient-to-br ${config.bg} border ${config.border} ${config.color}`}>
                        {config.label}
                      </span>
                      <span className={`${muted} group-hover:text-yellow-400 transition-all duration-300 text-lg group-hover:translate-x-1`}>→</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* AI Assistant Bubble */}
      <div className="fixed bottom-6 right-6 z-40 group">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-110"></div>
        
        {/* Button */}
        <button
          onClick={() => navigate('/chat')}
          className={`relative w-14 h-14 bg-gradient-to-br from-yellow-500 to-amber-500 rounded-full shadow-lg shadow-yellow-500/50 flex items-center justify-center cursor-pointer group-hover:scale-110 transition-transform duration-300 animate-bounce`}
        >
          <span className="text-white text-2xl">AI  </span>
        </button>

        {/* Tooltip */}
        <div className="absolute bottom-20 right-0 bg-gray-900 border border-yellow-500/30 text-white px-4 py-3 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg">
          <p className="font-bold">Hello this side 👋</p>
          <p className="text-xs text-gray-300 mt-1">DevAI, let's chat</p>
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

export default Dashboard;
