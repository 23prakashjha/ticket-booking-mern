import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const SOCIALS = [
  { label: 'Twitter', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { label: 'Instagram', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
  { label: 'LinkedIn', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  { label: 'YouTube', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const [scrollBtn, setScrollBtn] = useState(false);

  if (typeof window !== 'undefined') {
    const s = () => setScrollBtn(window.scrollY > 400);
    if (typeof window !== 'undefined' && !scrollBtn) { window.addEventListener('scroll', s, { once: true }); scrollY > 400 && setScrollBtn(true); }
  }

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="relative mt-16 border-t border-slate-200 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-extrabold text-xl shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all">
                B
              </div>
              <span className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                BookTrip
              </span>
            </Link>
            <p className="text-slate-500 mt-4 leading-relaxed max-w-sm">
              Your one-stop platform for booking train, bus, and flight tickets. Fast search, seat selection, and secure payments.
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Secure payments</span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">Instant confirmation</span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">Seat selection</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <p className="font-bold text-slate-900 mb-4">Explore</p>
            <ul className="space-y-3">
              {[{ to: '/trains', label: 'Trains' }, { to: '/buses', label: 'Buses' }, { to: '/flights', label: 'Flights' }, { to: '/hotels', label: 'Hotels' }, { to: '/places', label: 'Places' }, { to: '/my-bookings', label: 'My Bookings' }].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-slate-500 hover:text-primary-600 transition-colors text-sm font-medium">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-3">
            <p className="font-bold text-slate-900 mb-4">Support</p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 text-slate-500">
                <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                <span>support@booktrip.test</span>
              </li>
              <li className="flex items-center gap-3 text-slate-500">
                <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                <span>9:00 AM – 9:00 PM</span>
              </li>
              <li className="flex items-center gap-3 text-slate-500">
                <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                <span>Stripe Secure Payment</span>
              </li>
            </ul>
            <div className="flex gap-2 mt-5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-slate-100 text-slate-500 hover:bg-primary-50 hover:text-primary-600 flex items-center justify-center transition-all duration-200"
                  aria-label={s.label}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <p className="font-bold text-slate-900 mb-4">Stay Updated</p>
            <p className="text-sm text-slate-500 mb-4">Get exclusive deals and travel tips in your inbox.</p>
            <form onSubmit={(e) => { e.preventDefault(); alert('Thanks for subscribing!'); }} className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 min-w-0 px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-sm placeholder:text-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                required
              />
              <button type="submit" className="btn-primary py-2.5 px-4 text-sm flex-shrink-0">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-sm">
          <p className="text-slate-400">© {year} BookTrip. All rights reserved.</p>
          <p className="text-slate-400">
            Built with <span className="text-primary-600 font-medium">MERN</span> + TailwindCSS
          </p>
        </div>
      </div>

      {/* Back to top */}
      {scrollBtn && (
        <button
          onClick={scrollTop}
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-primary-600 text-white shadow-lg hover:bg-primary-700 hover:shadow-xl flex items-center justify-center transition-all duration-200 animate-slide-up"
          aria-label="Back to top"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </footer>
  );
}
