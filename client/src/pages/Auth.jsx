import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('user');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (role === 'admin') {
        const endpoint = isLogin ? '/admin/login' : '/admin/register';
        const body = isLogin ? { email, password } : { name, email, password };
        const { data } = await api.post(endpoint, body);
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminName', data.admin.name);
        localStorage.setItem('adminEmail', data.admin.email);
        navigate('/admin/dashboard');
      } else if (isLogin) {
        const { data } = await api.post('/auth/login', { email, password });
        login(data.user, data.token);
        navigate(from, { replace: true });
      } else {
        if (!name.trim()) { setError('Name is required'); setLoading(false); return; }
        const { data } = await api.post('/auth/register', { name, email, password, phone: phone || undefined });
        register(data.user, data.token);
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left Brand Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-700 via-primary-600 to-teal-700 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-mesh-pattern opacity-30" />
        <div className="absolute top-20 -left-20 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl" />
        <div className="relative text-center px-12 max-w-lg">
          <div className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-xl">
            <span className="text-4xl font-extrabold text-white">B</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            {role === 'admin'
              ? 'Admin Portal'
              : isLogin ? 'Welcome Back to BookTrip' : 'Start Your Journey'}
          </h2>
          <p className="text-teal-100 text-lg mb-8 leading-relaxed">
            {role === 'admin'
              ? (isLogin ? 'Sign in to manage your platform' : 'Register to manage bookings, users & content')
              : (isLogin ? 'Sign in to manage your bookings, select seats, and enjoy exclusive deals.' : 'Create an account to book trains, buses, and flights with ease.')}
          </p>
          <div className="flex flex-col gap-4 text-left">
            {[
              { icon: '🚂', text: 'Book trains, buses & flights' },
              { icon: '💳', text: 'Secure payments with Razorpay' },
              { icon: '🎫', text: 'Real-time seat selection' },
              { icon: '⭐', text: 'Exclusive member deals' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-white/90">
                <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sm">{icon}</span>
                <span className="text-sm font-medium">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-8 py-12 bg-gradient-to-br from-slate-50 to-white">
        <div className="w-full max-w-md animate-slide-up">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 group mb-6 lg:hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-extrabold text-lg shadow-md">
                B
              </div>
              <span className="text-xl font-bold text-slate-900">BookTrip</span>
            </Link>

            <div className="inline-flex items-center bg-slate-100 rounded-xl p-1 mb-5">
              <button
                type="button"
                onClick={() => { setRole('user'); setError(''); }}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${role === 'user' ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                👤 User
              </button>
              <button
                type="button"
                onClick={() => { setRole('admin'); setError(''); }}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${role === 'admin' ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                🔐 Admin
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              {role === 'admin' ? 'Admin' : isLogin ? 'Welcome back' : 'Create account'}
            </h1>
            <p className="text-slate-500 mt-1.5">
              {role === 'admin'
                ? (isLogin ? 'Sign in to admin panel' : 'Register as administrator')
                : (isLogin ? 'Sign in to continue to your account' : 'Register to start booking tickets')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="input-field"
                  required={!isLogin}
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field"
                required
              />
            </div>
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone (optional)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 234 567 890"
                  className="input-field"
                />
              </div>
            )}

            {error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-base mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Please wait...
                </span>
              ) : role === 'admin' ? (isLogin ? 'Admin Login' : 'Admin Register') : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-slate-400 font-medium">or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button type="button" className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all font-medium text-sm text-slate-700">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button type="button" className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all font-medium text-sm text-slate-700">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </button>
          </div>

          <p className="mt-8 text-center text-slate-500 text-sm">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="font-semibold text-primary-600 hover:text-primary-700 hover:underline transition-colors"
            >
              {isLogin ? (role === 'admin' ? 'Register as Admin' : 'Create one') : 'Sign in'}
            </button>
          </p>

          <p className="mt-4 text-center">
            <Link to="/" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-600 text-sm transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
