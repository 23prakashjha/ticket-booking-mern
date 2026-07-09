import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from './Footer';

const NAV_LINKS = [
  { to: '/trains', label: 'Trains', icon: '🚂' },
  { to: '/buses', label: 'Buses', icon: '🚌' },
  { to: '/flights', label: 'Flights', icon: '✈️' },
  { to: '/hotels', label: 'Hotels', icon: '🏨' },
  { to: '/places', label: 'Places', icon: '📍' },
  { to: '/about', label: 'About', icon: 'ℹ️' },
  { to: '/contact', label: 'Contact', icon: '📞' },
];

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const adminToken = localStorage.getItem('adminToken');
  const adminName = localStorage.getItem('adminName');

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    setDropdownOpen(false);
    navigate('/');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminEmail');
    setMobileOpen(false);
    setDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 md:h-18">
            {/* Left: Logo */}
            <div className="flex-1 flex justify-start">
              <Link to="/" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-extrabold text-lg shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
                  B
                </div>
                <span className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                  BookTrip
                </span>
              </Link>
            </div>

            {/* Center: Desktop nav links */}
            <nav className="hidden md:flex items-center justify-center flex-1 gap-1">
              {NAV_LINKS.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    isActive(to)
                      ? 'bg-primary-50 text-primary-700 shadow-sm'
                      : 'text-slate-600 hover:text-primary-600 hover:bg-primary-50/50'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Right: User menu + mobile button */}
            <div className="flex-1 flex justify-end items-center gap-1">
              <div className="hidden md:flex items-center gap-1">
                <div className="w-px h-6 bg-slate-200 mx-2" />

                {adminToken && !user ? (
                  <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 pl-2 py-1 rounded-xl hover:bg-slate-50 transition-all">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                        {adminName?.charAt(0)?.toUpperCase() || 'A'}
                      </div>
                      <span className="text-sm font-medium text-slate-700 max-w-[100px] truncate">{adminName || 'Admin'}</span>
                      <svg className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                    {dropdownOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
                        <div className="px-4 py-2 border-b border-slate-100">
                          <p className="text-sm font-semibold text-slate-800">{adminName || 'Admin'}</p>
                          <p className="text-xs text-slate-400">{localStorage.getItem('adminEmail')}</p>
                        </div>
                        <Link to="/admin/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors">📊 Dashboard</Link>
                        <Link to="/" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors">🏠 Back to Site</Link>
                        <div className="border-t border-slate-100 mt-1 pt-1">
                          <button onClick={handleAdminLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">🚪 Logout</button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : user ? (
                  <div className="relative" ref={dropdownRef}>
                    <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 pl-2 py-1 rounded-xl hover:bg-slate-50 transition-all">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <span className="text-sm font-medium text-slate-700 max-w-[100px] truncate">{user.name}</span>
                      <svg className={`w-4 h-4 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                    </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-400">{user.email}</p>
                      </div>
                      <Link to="/my-bookings" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors">🎫 My Bookings</Link>
                      <Link to="/" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors">🏠 Home</Link>
                      <Link to="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 transition-colors">🔐 Admin Panel</Link>
                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">🚪 Logout</button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/auth" className="btn-primary ml-2 text-sm py-2 px-5">
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden relative w-10 h-10 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-200/60 bg-white shadow-lg animate-slide-down">
            <nav className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
              {NAV_LINKS.map(({ to, label, icon }) => (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive(to)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-primary-600'
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="text-lg">{icon}</span>
                  {label}
                </Link>
              ))}
              <div className="h-px bg-slate-100 my-2" />
              {adminToken && !user ? (
                <>
                  <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-primary-600 hover:bg-primary-50" onClick={() => setMobileOpen(false)}>
                    <span className="text-lg">📊</span>
                    Dashboard
                  </Link>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white text-sm font-bold">
                      {adminName?.charAt(0)?.toUpperCase() || 'A'}
                    </div>
                    <span className="text-sm text-slate-500 flex-1 truncate">{adminName || 'Admin'}</span>
                    <button onClick={handleAdminLogout} className="text-sm text-red-500 font-medium hover:text-red-600">Logout</button>
                  </div>
                </>
              ) : user ? (
                <>
                  <Link to="/my-bookings" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${isActive('/my-bookings') ? 'bg-primary-50 text-primary-700' : 'text-slate-700 hover:bg-slate-50'}`} onClick={() => setMobileOpen(false)}>
                    <span className="text-lg">📋</span>
                    My Bookings
                  </Link>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-bold">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm text-slate-500 flex-1 truncate">{user.name}</span>
                    <button onClick={handleLogout} className="text-sm text-red-500 font-medium hover:text-red-600">Logout</button>
                  </div>
                </>
              ) : (
                <Link to="/auth" className="btn-primary justify-center mx-4 my-2" onClick={() => setMobileOpen(false)}>
                  Sign In
                </Link>
              )}
              {!adminToken && (
                <Link to="/admin" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 hover:bg-slate-50" onClick={() => setMobileOpen(false)}>
                  Admin Panel
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
