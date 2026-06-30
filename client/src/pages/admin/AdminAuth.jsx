import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

const ADMIN_TOKEN = 'adminToken';

export default function AdminAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(ADMIN_TOKEN);
    if (token) {
      api.get('/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
        .then(() => navigate('/admin/dashboard'))
        .catch(() => localStorage.removeItem(ADMIN_TOKEN));
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = isLogin ? '/admin/login' : '/admin/register';
      const body = isLogin ? { email, password } : { name, email, password };
      const { data } = await api.post(endpoint, body);
      localStorage.setItem(ADMIN_TOKEN, data.token);
      localStorage.setItem('adminName', data.admin.name);
      localStorage.setItem('adminEmail', data.admin.email);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card p-8 shadow-xl">
          <div className="text-center mb-6">
            <Link to="/" className="inline-block text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent mb-2">
              BookTrip
            </Link>
            <h1 className="text-2xl font-bold text-slate-900">Admin</h1>
            <p className="text-slate-500 text-sm mt-1">{isLogin ? 'Sign in' : 'Register'}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-field" required={!isLogin} />
              </div>
            )}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" required />
            </div>
            {error && <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{error}</div>}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
              {loading ? 'Please wait...' : isLogin ? 'Admin Login' : 'Admin Register'}
            </button>
          </form>
          <p className="mt-5 text-center text-slate-600 text-sm">
            <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); }} className="font-semibold text-primary-600 hover:underline">
              {isLogin ? 'Register as Admin' : 'Already have account? Login'}
            </button>
          </p>
        </div>
        <p className="mt-6 text-center">
          <Link to="/" className="text-slate-500 hover:text-slate-700 text-sm">← Back to home</Link>
        </p>
      </div>
    </div>
  );
}
