import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authContext';
import { Eye, EyeOff, Github } from 'lucide-react';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://devsync-874r.onrender.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed. Please try again.');
        return;
      }

      login(data.userId, data.token);
      navigate('/dashboard');

    } catch (err) {
      setError('Unable to connect to server. Please try again.');
      console.log('Login error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-950 to-gray-900 flex items-center justify-center px-4 relative overflow-hidden" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
      
      {/* Animated background orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-40 -left-32 w-80 h-80 bg-gradient-to-br from-yellow-500/25 to-amber-500/15 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-40 -right-32 w-80 h-80 bg-gradient-to-tl from-cyan-500/25 to-yellow-500/15 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Grid background */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(234,179,8,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(234,179,8,0.08)_1px,transparent_1px)] bg-[size:5rem_5rem]"></div>
      </div>

      {/* Rotating Moon Container - Left Side */}
      <div className="fixed left-83 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center z-0 pointer-events-none">
        <div className="relative w-48 h-48">
          {/* Moon orbit */}
          <div className="absolute inset-0 border border-yellow-500/20 rounded-full animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
          <div className="absolute inset-6 border border-amber-500/10 rounded-full animate-spin" style={{ animationDuration: '20s' }}></div>
          
          {/* Moon */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-16 h-16 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 rounded-full shadow-2xl shadow-green-500/50">
              {/* Moon craters */}
              <div className="absolute top-3 left-4 w-2 h-2 bg-gray-400 rounded-full opacity-70"></div>
              <div className="absolute top-7 right-5 w-1.5 h-1.5 bg-gray-400 rounded-full opacity-60"></div>
              <div className="absolute bottom-4 left-5 w-1.5 h-1.5 bg-gray-400 rounded-full opacity-50"></div>
              <div className="absolute bottom-2 right-4 w-1.5 h-1.5 bg-gray-400 rounded-full opacity-60"></div>
              
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/40 to-transparent"></div>
            </div>
          </div>

          {/* Text below moon */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-24 text-center whitespace-nowrap">
            <p className="text-yellow-400/70 text-xs font-bold uppercase tracking-widest">Welcome Back</p>
          </div>
        </div>
      </div>

      {/* Main form container - Right Side */}
      <div className="w-full max-w-md relative z-10 lg:ml-auto lg:mr-12">
        
        {/* Animated background glow */}
        <div className="absolute -inset-6 bg-gradient-to-r from-yellow-500/20 via-amber-500/10 to-yellow-500/20 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

        <div className="relative bg-gray-950/90 backdrop-blur-2xl border border-yellow-500/30 rounded-2xl shadow-2xl shadow-yellow-500/20 p-6 transition-all duration-300 hover:border-yellow-400/50 hover:shadow-yellow-500/40">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-500/30 to-amber-500/20 border border-yellow-500/40 rounded-xl mb-2 hover:scale-110 transition-all duration-300 shadow-lg shadow-yellow-500/30">
              <span className="text-xl">◆</span>
            </div>
            <h1 className="text-white text-2xl font-black tracking-tight mb-0.5 bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text text-transparent">CodeSphere</h1>
            <p className="text-gray-400 text-xs font-light">Welcome back to your development sync</p>
          </div>

          {/* Error message with animation */}
          {error && (
            <div className="bg-red-500/15 border border-red-500/40 text-red-300 text-xs rounded-lg px-4 py-3 mb-6 flex items-start gap-2 animate-shake backdrop-blur-sm">
              <span className="text-sm mt-0.5 flex-shrink-0">⚠</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email input */}
            <div className="animate-fade-in" style={{ animationDelay: '0s' }}>
              <label className="block text-yellow-400/70 text-xs font-bold uppercase tracking-wider mb-1.5">Email Address</label>
              <div className={`relative transition-all duration-300 ${focusedField === 'email' ? 'scale-105' : ''}`}>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full bg-gray-900/50 border border-yellow-500/30 text-gray-100 text-sm rounded-lg px-4 py-3 placeholder-gray-600 focus:outline-none focus:border-yellow-400/60 focus:ring-2 focus:ring-yellow-500/30 focus:bg-gray-900/80 transition-all duration-300 backdrop-blur-sm"
                />
                <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-lg transition-all duration-300 ${formData.email ? 'opacity-100 text-yellow-400' : 'opacity-0'}`}>✓</span>
              </div>
            </div>

            {/* Password input */}
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-yellow-400/70 text-xs font-bold uppercase tracking-wider">Password</label>
                <a href="/forgot-password" className="text-yellow-400/60 hover:text-yellow-300 text-xs font-semibold transition-colors duration-200 hover:underline">
                  Forgot?
                </a>
              </div>
              <div className={`relative transition-all duration-300 ${focusedField === 'password' ? 'scale-105' : ''}`}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full bg-gray-900/50 border border-yellow-500/30 text-gray-100 text-sm rounded-lg px-4 py-3 pr-12 placeholder-gray-600 focus:outline-none focus:border-yellow-400/60 focus:ring-2 focus:ring-yellow-500/30 focus:bg-gray-900/80 transition-all duration-300 backdrop-blur-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-yellow-400 transition-all duration-200 text-lg hover:scale-110"
                >
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
                <span className={`absolute right-12 top-1/2 -translate-y-1/2 text-lg transition-opacity duration-300 ${formData.password ? 'opacity-100 text-yellow-400' : 'opacity-0'}`}>✓</span>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500 hover:from-yellow-400 hover:via-amber-400 hover:to-yellow-400 disabled:from-yellow-500/50 disabled:to-yellow-500/50 disabled:cursor-not-allowed text-gray-950 font-black text-xs uppercase tracking-widest py-3 rounded-lg transition-all duration-200 shadow-lg shadow-yellow-500/40 hover:shadow-yellow-500/60 hover:scale-105 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-gray-950/30 border-t-gray-950 rounded-full animate-spin"></span>
                    Signing in...
                  </>
                ) : (
                  <>Sign In <span className="group-hover:translate-x-1 transition-transform">→</span></>
                )}
              </span>
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent"></div>
            <span className="text-gray-600 text-xs font-medium">or continue with</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent"></div>
          </div>

          {/* OAuth button */}
          <button className="w-full bg-gray-900/40 hover:bg-gray-800/50 border border-yellow-500/20 hover:border-yellow-500/50 text-gray-200 hover:text-yellow-300 text-xs font-bold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-sm">
            <Github className="w-4 h-4" />
            <span>Continue with GitHub</span>
          </button>

          {/* Signup link */}
          <p className="text-center text-gray-500 text-xs mt-4">
            Don't have an account?{' '}
            <a href="/signup" className="text-yellow-400 hover:text-yellow-300 font-bold transition-colors duration-200 hover:underline">
              Create one now
            </a>
          </p>
        </div>

        {/* Bottom decoration */}
        <div className="text-center mt-4">
          <p className="text-gray-600 text-xs font-mono">Secure • Fast • Reliable</p>
        </div>
      </div>

      {/* Global animations */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }

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

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }

        input::placeholder {
          font-weight: 300;
        }

        html {
          scroll-behavior: smooth;
        }

        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(5, 150, 105, 0.05);
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #10b981, #06b6d4);
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #059669, #0891b2);
        }
      `}</style>
    </div>
  );
}

export default Login;
