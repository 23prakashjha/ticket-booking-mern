import { useState } from 'react';
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

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/60 shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-18">
            <Link to="/" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-extrabold text-lg shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
                B
              </div>
              <span className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                BookTrip
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
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

              <div className="w-px h-6 bg-slate-200 mx-2" />

              {user ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/my-bookings"
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      isActive('/my-bookings')
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-slate-600 hover:text-primary-600 hover:bg-primary-50/50'
                    }`}
                  >
                    My Bookings
                  </Link>
                  <div className="flex items-center gap-2 pl-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-slate-700 max-w-[100px] truncate">{user.name}</span>
                    <button
                      onClick={handleLogout}
                      className="ml-1 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link to="/auth" className="btn-primary ml-2 text-sm py-2 px-5">
                  Sign In
                </Link>
              )}

              <Link
                to="/admin"
                className="ml-1 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
              >
                Admin
              </Link>
            </nav>

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
              {user ? (
                <>
                  <Link
                    to="/my-bookings"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                      isActive('/my-bookings')
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="text-lg">📋</span>
                    My Bookings
                  </Link>
                  <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-bold">
                      {user.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm text-slate-500 flex-1 truncate">{user.name}</span>
                    <button onClick={handleLogout} className="text-sm text-red-500 font-medium hover:text-red-600">
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/auth"
                  className="btn-primary justify-center mx-4 my-2"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
              )}
              <Link
                to="/admin"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-slate-400 hover:bg-slate-50"
                onClick={() => setMobileOpen(false)}
              >
                Admin Panel
              </Link>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
