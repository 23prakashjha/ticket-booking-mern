import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { processPayment } from '../utils/stripe';

const COLS = 6;

const CLASSES = [
  { value: 'economy', label: 'Economy', icon: '💺', desc: 'Standard comfort' },
  { value: 'business', label: 'Business', icon: '💼', desc: 'Premium experience' },
];

function Skeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-sky-700 via-sky-600 to-cyan-500 h-64" />
      <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10 space-y-6 pb-12">
        <div className="card p-6 animate-pulse space-y-4">
          <div className="skeleton h-8 w-64" />
          <div className="skeleton h-4 w-48" />
          <div className="skeleton h-4 w-96" />
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6 animate-pulse space-y-4">
              <div className="skeleton h-6 w-32" />
              <div className="skeleton h-6 w-48" />
              <div className="flex flex-wrap gap-2">
                {[...Array(36)].map((_, i) => <div key={i} className="skeleton h-10 w-10 rounded-lg" />)}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="card p-6 animate-pulse space-y-4">
              <div className="skeleton h-6 w-32" />
              <div className="skeleton h-4 w-24" />
              <div className="skeleton h-10 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FlightDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [flight, setFlight] = useState(null);
  const [seatClass, setSeatClass] = useState('economy');
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/flights/${id}`)
      .then(({ data }) => {
        setFlight(data);
        setError(null);
      })
      .catch((e) => {
        setError(e.response?.data?.message || 'Failed to load flight details');
        setFlight(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => setSelected([]), [seatClass]);

  const seats = flight?.seats?.filter((s) => s.class === seatClass) || [];
  const toggleSeat = (seatNo) => {
    const s = flight?.seats?.find((x) => x.seatNo === seatNo);
    if (!s || s.status !== 'available' || s.class !== seatClass) return;
    setSelected((prev) => (prev.includes(seatNo) ? prev.filter((x) => x !== seatNo) : [...prev, seatNo]));
  };

  const price = flight ? (seatClass === 'business' ? flight.businessPrice : flight.economyPrice) : 0;
  const total = selected.length * price;

  const handleBook = async () => {
    if (!user) {
      navigate('/auth', { state: { from: { pathname: `/flights/${id}` } } });
      return;
    }
    if (selected.length === 0) return;
    setPayLoading(true);
    try {
      const { data } = await api.post('/bookings/lock-seats', { type: 'flight', id, seats: selected, seatClass });
      const orderRes = await api.post('/payment/create-order', { bookingId: data.booking._id });
      const bookingData = {
        bookingId: data.booking._id,
        amount: orderRes.data.amount / 100,
        type: 'flight',
        seats: selected,
        seatClass,
        sessionId: orderRes.data.sessionId
      };
      localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
      navigate('/payment', { state: { bookingData } });
    } catch (e) {
      alert(e.response?.data?.message || 'Booking failed');
      setPayLoading(false);
    }
  };

  if (loading) return <Skeleton />;

  if (error || !flight) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-sky-100 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✈️</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Flight Not Found</h2>
          <p className="text-slate-500 mb-6">{error || 'The flight you are looking for does not exist or has been removed.'}</p>
          <Link to="/flights" className="btn-primary">Browse Flights</Link>
        </div>
      </div>
    );
  }

  const grid = [];
  for (let i = 0; i < seats.length; i += COLS) grid.push(seats.slice(i, i + COLS));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-sky-700 via-sky-600 to-cyan-500 overflow-hidden">
        <div className="absolute inset-0 bg-mesh-pattern opacity-30" />
        <div className="absolute top-5 right-10 w-64 h-64 bg-cyan-300/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-10 left-1/3 w-72 h-72 bg-sky-300/10 rounded-full blur-3xl animate-float-slow" />
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-float"
            style={{
              width: `${3 + Math.random() * 6}px`,
              height: `${3 + Math.random() * 6}px`,
              left: `${5 + Math.random() * 90}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${4 + Math.random() * 6}s`,
            }}
          />
        ))}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16 relative z-10">
          <Link to="/flights" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-medium mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to flights
          </Link>
          <div className="flex items-start gap-5 sm:gap-6 flex-wrap sm:flex-nowrap">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-lg border border-white/10">
              <span className="text-3xl sm:text-4xl">✈️</span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gradient-hero leading-tight">{flight.name}</h1>
              <p className="text-sky-200/80 text-sm sm:text-base mt-1 font-medium">{flight.flightNumber}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-white/80 text-sm sm:text-base">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-sky-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                  {flight.source} → {flight.destination}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-sky-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  {new Date(flight.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-white border border-white/10">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {flight.departureTime} – {flight.arrivalTime}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-white border border-white/10">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  {flight.duration || `${Math.round((new Date(`2000-01-01T${flight.arrivalTime}`) - new Date(`2000-01-01T${flight.departureTime}`)) / 3600000)}h`}
                </span>
                {flight.stops !== undefined && (
                  <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-white border border-white/10">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                    {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop(s)`}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-10 pb-12">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Class Selection */}
            <div className="card p-5 sm:p-6 animate-fade-in">
              <h2 className="section-title mb-4 text-xl sm:text-2xl">Select Class</h2>
              <div className="flex flex-wrap gap-3 mb-5">
                {CLASSES.map((cls) => {
                  const p = cls.value === 'business' ? flight.businessPrice : flight.economyPrice;
                  const isActive = seatClass === cls.value;
                  return (
                    <button
                      key={cls.value}
                      onClick={() => setSeatClass(cls.value)}
                      className={`relative flex-1 min-w-[180px] p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        isActive
                          ? 'border-sky-500 bg-sky-50 shadow-md shadow-sky-500/10'
                          : 'border-slate-200 bg-white hover:border-sky-300 hover:shadow-sm'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-sky-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                      )}
                      <div className="text-lg mb-1">{cls.icon}</div>
                      <div className="font-semibold text-slate-900 text-sm">{cls.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{cls.desc}</div>
                      <div className="text-sky-600 font-bold text-sm mt-1">₹{p?.toLocaleString()}</div>
                    </button>
                  );
                })}
              </div>

              {/* Seat Layout */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-900 text-base sm:text-lg">
                  Seat Layout ({seatClass})
                  <span className="ml-2 text-sm font-normal text-slate-500">({seats.length} seats)</span>
                </h3>
              </div>
              {grid.length > 0 ? (
                <div className="inline-block p-4 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-sky-50/50 border border-slate-200/60 w-full">
                  <div className="flex justify-center mb-5">
                    <div className="bg-slate-200/60 rounded-full px-8 py-1 text-xs text-slate-500 font-medium uppercase tracking-widest">Cockpit</div>
                  </div>
                  {grid.map((row, ri) => (
                    <div key={ri} className="flex gap-2 justify-center mb-2.5 last:mb-0">
                      {row.map((s, si) => {
                        const isAvailable = s.status === 'available';
                        const isBooked = s.status === 'booked';
                        const isLocked = s.status === 'locked';
                        const isSel = selected.includes(s.seatNo);
                        const isAisleGap = si === Math.floor(COLS / 2);
                        return (
                          <div key={s.seatNo} className="flex items-center">
                            <button
                              type="button"
                              onClick={() => toggleSeat(s.seatNo)}
                              disabled={!isAvailable}
                              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-150 ${
                                isBooked
                                  ? 'bg-red-400 text-white cursor-not-allowed shadow-inner'
                                  : isLocked
                                  ? 'bg-amber-300 text-white cursor-not-allowed shadow-inner'
                                  : isSel
                                  ? 'bg-sky-600 text-white ring-2 ring-sky-300 ring-offset-2 shadow-md shadow-sky-500/30 scale-105'
                                  : 'bg-emerald-500 text-white hover:bg-emerald-600 hover:scale-105 hover:shadow-md cursor-pointer shadow-sm'
                              }`}
                            >
                              {s.seatNo.replace('F', '')}
                            </button>
                            {isAisleGap && <span className="w-3 sm:w-4 flex-shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50 rounded-xl p-6 text-center">
                  <p className="text-slate-500 text-sm">No seats available in this class</p>
                </div>
              )}
              <div className="flex flex-wrap gap-4 mt-4 text-xs sm:text-sm text-slate-500">
                <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-lg bg-emerald-500" /> Available</span>
                <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-lg bg-red-400" /> Booked</span>
                <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-lg bg-amber-300" /> Locked</span>
                <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-lg bg-sky-600 ring-2 ring-sky-300 ring-offset-1" /> Selected</span>
              </div>
            </div>
          </div>

          {/* Right column - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6 space-y-6 animate-fade-in">
              <div className="card p-5 sm:p-6">
                <h3 className="font-bold text-slate-900 text-lg mb-4">Booking Summary</h3>
                <div className="space-y-3 text-sm divide-y divide-slate-100">
                  <div className="flex justify-between text-slate-600">
                    <span>Class</span>
                    <span className="font-medium text-slate-900 capitalize">{seatClass}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 pt-3">
                    <span>Seats</span>
                    <span className="font-medium text-slate-900">{selected.length > 0 ? selected.join(', ') : 'None selected'}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 pt-3">
                    <span>Seat count</span>
                    <span className="font-medium text-slate-900">{selected.length}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 pt-3">
                    <span>Price per seat</span>
                    <span className="font-medium text-slate-900">₹{price?.toLocaleString()}</span>
                  </div>
                  <div className="pt-3">
                    <div className="flex justify-between text-base font-bold text-slate-900">
                      <span>Total Amount</span>
                      <span className="text-sky-600 text-xl">₹{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleBook}
                  disabled={selected.length === 0 || payLoading}
                  className="btn-primary w-full mt-6 py-3.5 text-base relative overflow-hidden group"
                >
                  <span className="relative z-10">
                    {!user ? 'Login to Book' : payLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        Opening payment...
                      </span>
                    ) : 'Book Now'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
