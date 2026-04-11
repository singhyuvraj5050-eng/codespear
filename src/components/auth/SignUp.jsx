import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../authContext';
import { Eye, EyeOff, Github, Check } from 'lucide-react';

function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');

    // Password strength indicator
    if (name === 'password') {
      let strength = 0;
      if (value.length >= 8) strength++;
      if (/[A-Z]/.test(value)) strength++;
      if (/[0-9]/.test(value)) strength++;
      if (/[^A-Za-z0-9]/.test(value)) strength++;
      setPasswordStrength(strength);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-700';
    if (passwordStrength === 1) return 'bg-red-500/70';
    if (passwordStrength === 2) return 'bg-yellow-500/70';
    if (passwordStrength === 3) return 'bg-green-500/70';
    return 'bg-emerald-400';
  };

  const getPasswordStrengthLabel = () => {
    if (passwordStrength === 0) return 'Strength';
    if (passwordStrength === 1) return 'Weak';
    if (passwordStrength === 2) return 'Fair';
    if (passwordStrength === 3) return 'Good';
    return 'Strong';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post("https://devsync-874r.onrender.com/signup", {
        email: formData.email,
        username: formData.username,
        password: formData.password
      });

      const { token, userId } = response.data;

      login(userId, token);
      navigate('/dashboard');

    } catch (err) {
      console.log("Error in sign up", err);
      setError(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.username && formData.email && formData.password && passwordStrength >= 2;

  const passwordRequirements = [
    { label: 'At least 8 characters', met: formData.password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(formData.password) },
    { label: 'One number', met: /[0-9]/.test(formData.password) },
    { label: 'One special character', met: /[^A-Za-z0-9]/.test(formData.password) },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-950 to-gray-900 flex items-center justify-center px-4 relative overflow-hidden" style={{ fontFamily: "'JetBrains Mono', 'Courier New', monospace" }}>
      
      {/* Animated background orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-40 -right-22 w-80 h-80 bg-gradient-to-bl from-yellow-500/25 to-amber-500/15 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute bottom-40 -left-32 w-80 h-80 bg-gradient-to-tr from-cyan-500/25 to-yellow-500/15 rounded-full blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Grid background */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(234,179,8,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(234,179,8,0.08)_1px,transparent_1px)] bg-[size:5rem_5rem]"></div>
      </div>

      {/* Rotating Moon Container - Right Side */}
      <div className="fixed right-82 top-1/2 -translate-y-1/2 hidden lg:flex items-center justify-center z-0 pointer-events-none">
        <div className="relative w-48 h-48">
          {/* Moon orbit */}
          <div className="absolute inset-0 border border-yellow-500/20 rounded-full animate-spin" style={{ animationDuration: '15s' }}></div>
          <div className="absolute inset-6 border border-amber-500/10 rounded-full animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }}></div>
          
          {/* Moon */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '15s' }}>
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
            <p className="text-yellow-400/70 text-xs font-bold uppercase tracking-widest">Join Now</p>
          </div>
        </div>
      </div>

      {/* Main form container - Left Side */}
      <div className="w-full max-w-md relative z-10 lg:mr-auto lg:ml-12">
        
        {/* Animated background glow */}
        <div className="absolute -inset-6 bg-gradient-to-r from-yellow-500/20 via-amber-500/10 to-yellow-500/20 rounded-3xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

        <div className="relative bg-gray-950/90 backdrop-blur-2xl border border-yellow-500/30 rounded-2xl shadow-2xl shadow-yellow-500/20 p-6 transition-all duration-300 hover:border-yellow-400/50 hover:shadow-yellow-500/40">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-500/30 to-amber-500/20 border border-yellow-500/40 rounded-xl mb-2 hover:scale-110 transition-all duration-300 shadow-lg shadow-yellow-500/30 animate-bounce" style={{ animationDuration: '2s' }}>
              <span className="text-xl">◆</span>
            </div>
            <h1 className="text-white text-2xl font-black tracking-tight mb-0.5 bg-gradient-to-r from-yellow-300 to-amber-300 bg-clip-text text-transparent">CodeSphere</h1>
            <p className="text-gray-400 text-xs font-light">Join developers shipping faster</p>
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

            {/* Username input */}
            <div className="animate-fade-in" style={{ animationDelay: '0s' }}>
              <label className="block text-yellow-400/70 text-xs font-bold uppercase tracking-wider mb-1.5">Username</label>
              <div className={`relative transition-all duration-300 ${focusedField === 'username' ? 'scale-105' : ''}`}>
                <input
                  type="text"
                  name="username"
                  placeholder="your_awesome_username"
                  value={formData.username}
                  onChange={handleChange}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  required
                  className="w-full bg-gray-900/50 border border-yellow-500/30 text-gray-100 text-sm rounded-lg px-4 py-3 placeholder-gray-600 focus:outline-none focus:border-yellow-400/60 focus:ring-2 focus:ring-yellow-500/30 focus:bg-gray-900/80 transition-all duration-300 backdrop-blur-sm"
                />
                <span className={`absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${formData.username ? 'opacity-100 text-yellow-400' : 'opacity-0'}`}>
                  <Check className="w-5 h-5" />
                </span>
              </div>
            </div>

            {/* Email input */}
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
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
                <span className={`absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${formData.email ? 'opacity-100 text-yellow-400' : 'opacity-0'}`}>
                  <Check className="w-5 h-5" />
                </span>
              </div>
            </div>

            {/* Password input with strength indicator */}
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-yellow-400/70 text-xs font-bold uppercase tracking-wider">Password</label>
                {formData.password && (
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    passwordStrength <= 1 ? 'text-red-400' : 
                    passwordStrength === 2 ? 'text-yellow-400' : 
                    'text-yellow-400'
                  }`}>
                    {getPasswordStrengthLabel()}
                  </span>
                )}
              </div>
              
              {/* Password strength bar */}
              {formData.password && (
                <div className="mb-2 flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                        i < passwordStrength ? getPasswordStrengthColor() : 'bg-gray-700'
                      }`}
                    ></div>
                  ))}
                </div>
              )}

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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-yellow-400 transition-all duration-200 hover:scale-110"
                >
                  {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Password requirements */}
            {formData.password && (
              <div className="bg-gray-900/50 border border-yellow-500/20 rounded-lg p-3 space-y-1.5 animate-fade-in backdrop-blur-sm">
                {passwordRequirements.map((req, idx) => (
                  <p key={idx} className={`flex items-center gap-2 text-xs transition-colors duration-300 ${req.met ? 'text-yellow-400' : 'text-gray-500'}`}>
                    <span className={`flex-shrink-0 w-3.5 h-3.5 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      req.met ? 'bg-yellow-500/30 border border-yellow-400' : 'bg-gray-700/30 border border-gray-600'
                    }`}>
                      {req.met ? '✓' : '○'}
                    </span>
                    <span>{req.label}</span>
                  </p>
                ))}
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className={`w-full mt-4 bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500 hover:from-yellow-400 hover:via-amber-400 hover:to-yellow-400 disabled:from-yellow-500/50 disabled:to-yellow-500/50 disabled:cursor-not-allowed text-gray-950 font-black text-xs uppercase tracking-widest py-3 rounded-lg transition-all duration-200 shadow-lg shadow-yellow-500/40 hover:shadow-yellow-500/60 hover:scale-105 relative overflow-hidden group ${!isFormValid ? 'opacity-60' : ''}`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-gray-950/30 border-t-gray-950 rounded-full animate-spin"></span>
                    Creating Account...
                  </>
                ) : (
                  <>Create Account <span className="group-hover:translate-x-1 transition-transform">→</span></>
                )}
              </span>
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent"></div>
            <span className="text-gray-600 text-xs font-medium">or join with</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent"></div>
          </div>

          {/* OAuth button */}
          <button className="w-full bg-gray-900/40 hover:bg-gray-800/50 border border-yellow-500/20 hover:border-yellow-500/50 text-gray-200 hover:text-yellow-300 text-xs font-bold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 backdrop-blur-sm">
            <Github className="w-4 h-4" />
            <span>Continue with GitHub</span>
          </button>

          {/* Login link */}
          <p className="text-center text-gray-500 text-xs mt-4">
            Already have an account?{' '}
            <a href="/auth" className="text-yellow-400 hover:text-yellow-300 font-bold transition-colors duration-200 hover:underline">
              Sign in here
            </a>
          </p>
        </div>

        {/* Bottom decoration */}
        <div className="text-center mt-4">
          <p className="text-gray-600 text-xs font-mono">Secure • Fast • Enterprise-Ready</p>
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

export default SignUp;
