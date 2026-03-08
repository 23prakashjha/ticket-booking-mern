import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Footer from './Footer';

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/trains', label: 'Trains' },
    { to: '/buses', label: 'Buses' },
    { to: '/flights', label: 'Flights' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    { to: '/pnr-status', label: 'PNR Status' },
    { to: '/live-train-status', label: 'Live Train Status' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-18">
            <Link to="/" className="flex items-center gap-2 group" onClick={() => setMobileOpen(false)}>
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                BookTrip
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="px-4 py-2 rounded-lg text-slate-600 hover:text-primary-600 hover:bg-primary-50 font-medium transition-colors"
                >
                  {label}
                </Link>
              ))}
              {user ? (
                <>
                  <Link
                    to="/my-bookings"
                    className="px-4 py-2 rounded-lg text-slate-600 hover:text-primary-600 hover:bg-primary-50 font-medium transition-colors"
                  >
                    My Bookings
                  </Link>
                  <span className="ml-2 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-sm font-medium max-w-[120px] truncate" title={user.name}>
                    {user.name}
                  </span>
                  <button onClick={handleLogout} className="btn-secondary ml-2 text-sm py-2">
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/auth" className="btn-primary ml-4 text-sm py-2">
                  Login
                </Link>
              )}
              <Link
                to="/admin"
                className="ml-2 px-3 py-2 rounded-lg text-slate-400 hover:text-slate-600 text-sm transition-colors"
                title="Admin"
              >
                Admin
              </Link>
            </nav>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="md:hidden py-4 border-t border-slate-200 animate-fade-in">
              <nav className="flex flex-col gap-1">
                {navLinks.map(({ to, label }) => (
                  <Link
                    key={to}
                    to={to}
                    className="px-4 py-3 rounded-xl text-slate-700 hover:bg-primary-50 hover:text-primary-700 font-medium"
                    onClick={() => setMobileOpen(false)}
                  >
                    {label}
                  </Link>
                ))}
                {user ? (
                  <>
                    <Link to="/my-bookings" className="px-4 py-3 rounded-xl text-slate-700 hover:bg-primary-50 hover:text-primary-700 font-medium" onClick={() => setMobileOpen(false)}>
                      My Bookings
                    </Link>
                    <div className="px-4 py-2 text-sm text-slate-500">{user.name}</div>
                    <button onClick={handleLogout} className="mx-4 mt-2 btn-secondary text-left justify-start">
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to="/auth" className="mx-4 mt-2 btn-primary justify-center" onClick={() => setMobileOpen(false)}>
                    Login
                  </Link>
                )}
                <Link to="/admin" className="px-4 py-3 rounded-xl text-slate-500 text-sm" onClick={() => setMobileOpen(false)}>
                  Admin
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
