import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2">
              <span className="text-2xl font-extrabold bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent">
                BookTrip
              </span>
            </Link>
            <p className="text-slate-600 mt-3 max-w-md">
              Book train, bus and flight tickets with a fast search, beautiful seat layouts and secure payments.
            </p>
            <div className="flex flex-wrap gap-2 mt-5">
              <span className="badge-neutral">Secure payments</span>
              <span className="badge-neutral">Instant confirmation</span>
              <span className="badge-neutral">Seat selection</span>
            </div>
          </div>

          <div>
            <p className="text-slate-900 font-bold mb-3">Explore</p>
            <ul className="space-y-2 text-slate-600">
              <li><Link className="hover:text-primary-700" to="/trains">Trains</Link></li>
              <li><Link className="hover:text-primary-700" to="/buses">Buses</Link></li>
              <li><Link className="hover:text-primary-700" to="/flights">Flights</Link></li>
              <li><Link className="hover:text-primary-700" to="/my-bookings">My Bookings</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-slate-900 font-bold mb-3">Company</p>
            <ul className="space-y-2 text-slate-600">
              <li><a className="hover:text-primary-700" href="#features">Features</a></li>
              <li><a className="hover:text-primary-700" href="#popular">Popular routes</a></li>
              <li><Link className="hover:text-primary-700" to="/admin">Admin</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-slate-900 font-bold mb-3">Support</p>
            <ul className="space-y-2 text-slate-600">
              <li className="text-slate-600">Email: <span className="font-medium">support@booktrip.test</span></li>
              <li className="text-slate-600">Hours: <span className="font-medium">9:00 AM – 9:00 PM</span></li>
              <li className="text-slate-600">Payments: <span className="font-medium">Stripe</span></li>
            </ul>
            <div className="mt-5 flex gap-3">
              <a className="btn-ghost px-3" href="#" aria-label="Twitter">X</a>
              <a className="btn-ghost px-3" href="#" aria-label="Instagram">IG</a>
              <a className="btn-ghost px-3" href="#" aria-label="LinkedIn">in</a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-sm text-slate-500">
          <p>© {year} BookTrip. All rights reserved.</p>
          <p className="text-slate-400">
            Built with MERN + TailwindCSS + Stripe.
          </p>
        </div>
      </div>
    </footer>
  );
}

