import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const CATEGORY_ICONS = {
  historical: '🏛️', nature: '🌿', adventure: '🧗', religious: '🛕',
  beach: '🏖️', hill_station: '🏔️', cultural: '🎭', amusement: '🎡', museum: '🏛️', other: '📍',
};

const TIME_SLOTS = [
  { value: '09:00-11:00', label: 'Morning (9AM - 11AM)' },
  { value: '11:00-13:00', label: 'Late Morning (11AM - 1PM)' },
  { value: '13:00-15:00', label: 'Afternoon (1PM - 3PM)' },
  { value: '15:00-17:00', label: 'Evening (3PM - 5PM)' },
];

function Skeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-rose-700 via-rose-600 to-pink-500 h-64" />
      <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10 space-y-6 pb-12">
        <div className="card p-6 animate-pulse space-y-4">
          <div className="skeleton h-8 w-64" />
          <div className="skeleton h-4 w-48" />
          <div className="flex gap-2"><div className="skeleton h-6 w-20 rounded-full" /><div className="skeleton h-6 w-16 rounded-full" /></div>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6 animate-pulse space-y-3">
              <div className="skeleton h-6 w-24" />
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-3/4" />
            </div>
            <div className="card p-6 animate-pulse space-y-4">
              <div className="skeleton h-6 w-32" />
              <div className="grid grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="card p-6 animate-pulse space-y-4">
              <div className="skeleton h-6 w-24" />
              <div className="skeleton h-10 w-full rounded-xl" />
              <div className="skeleton h-10 w-full rounded-xl" />
              <div className="skeleton h-10 w-1/2 rounded-xl" />
              <div className="skeleton h-10 w-1/2 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PlaceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [place, setPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [visitDate, setVisitDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get(`/places/${id}`)
      .then(res => setPlace(res.data))
      .catch(() => navigate('/places'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleBook = async () => {
    setError('');
    if (!visitDate) return setError('Please select a visit date');
    if (!timeSlot) return setError('Please select a time slot');
    if (adults < 1) return setError('At least 1 adult required');

    setBooking('processing');
    try {
      const { data } = await axios.post('/bookings/lock-seats', {
        type: 'place',
        id: place._id,
        visitDate: new Date(visitDate).toISOString(),
        timeSlot,
        adults,
        children,
      });
      navigate('/payment', { state: {
        bookingId: data.booking._id,
        amount: data.totalAmount,
        description: `${place.name} - ${adults} Adult(s), ${children} Child(ren)`,
      }});
    } catch (e) {
      setError(e.response?.data?.message || 'Booking failed');
      setBooking(null);
    }
  };

  const totalAmount = place
    ? (place.entryFee || 100) * adults + (place.childFee || 50) * children
    : 0;

  if (loading) return <Skeleton />;

  if (!place) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📍</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Place Not Found</h2>
          <p className="text-slate-500 mb-6">The place you are looking for does not exist or has been removed.</p>
          <button onClick={() => navigate('/places')} className="btn-primary">Browse Places</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-rose-700 via-rose-600 to-pink-500 overflow-hidden">
        <div className="absolute inset-0 bg-mesh-pattern opacity-30" />
        <div className="absolute top-5 left-10 w-80 h-80 bg-pink-300/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-5 right-20 w-52 h-52 bg-rose-300/10 rounded-full blur-2xl animate-float-slower" />
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-float"
            style={{
              width: `${4 + Math.random() * 8}px`,
              height: `${4 + Math.random() * 8}px`,
              left: `${5 + Math.random() * 90}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16 relative z-10">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-medium mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back
          </button>
          <div className="flex items-start gap-5 sm:gap-6 flex-wrap sm:flex-nowrap">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-lg border border-white/10 text-3xl sm:text-4xl">
              {place.image || CATEGORY_ICONS[place.category] || '📍'}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gradient-hero leading-tight">{place.name}</h1>
              <p className="text-rose-200/80 text-sm sm:text-base mt-1">{place.city}{place.state ? `, ${place.state}` : ''}</p>
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-white border border-white/10">
                  {CATEGORY_ICONS[place.category]} {place.category?.replace('_', ' ')}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-white border border-white/10">
                  ⭐ {place.rating}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-3">
                {place.openingTime && (
                  <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-white/80 border border-white/10">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {place.openingTime} - {place.closingTime}
                  </span>
                )}
                {place.bestTime && (
                  <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-white/80 border border-white/10">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Best: {place.bestTime}
                  </span>
                )}
                {place.duration && (
                  <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-white/80 border border-white/10">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    {place.duration}
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
            {/* About */}
            {place.description && (
              <div className="card p-5 sm:p-6 animate-fade-in">
                <h2 className="section-title mb-3 text-xl sm:text-2xl">About</h2>
                <p className="text-slate-600 leading-relaxed">{place.description}</p>
              </div>
            )}

            {/* Timing & Info */}
            <div className="card p-5 sm:p-6 animate-fade-in">
              <h2 className="section-title mb-4 text-xl sm:text-2xl">Timing & Info</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {place.openingTime && (
                  <div className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center flex-shrink-0 text-lg">🕐</div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">Opening Time</p>
                      <p className="text-slate-500 text-sm">{place.openingTime}</p>
                    </div>
                  </div>
                )}
                {place.closingTime && (
                  <div className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center flex-shrink-0 text-lg">🕐</div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">Closing Time</p>
                      <p className="text-slate-500 text-sm">{place.closingTime}</p>
                    </div>
                  </div>
                )}
                {place.bestTime && (
                  <div className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0 text-lg">📅</div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">Best Time to Visit</p>
                      <p className="text-slate-500 text-sm">{place.bestTime}</p>
                    </div>
                  </div>
                )}
                {place.duration && (
                  <div className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 text-lg">⏱️</div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">Suggested Duration</p>
                      <p className="text-slate-500 text-sm">{place.duration}</p>
                    </div>
                  </div>
                )}
                {place.entryFee && (
                  <div className="flex items-start gap-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0 text-lg">💰</div>
                    <div>
                      <p className="font-medium text-slate-900 text-sm">Entry Fee</p>
                      <p className="text-slate-500 text-sm">₹{place.entryFee} (Adult) / ₹{place.childFee || 50} (Child)</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right column - Booking Form */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6 space-y-6 animate-fade-in">
              <div className="card p-5 sm:p-6">
                <h3 className="font-bold text-slate-900 text-lg mb-5">Book Tickets</h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Visit Date</label>
                  <input
                    type="date"
                    value={visitDate}
                    onChange={e => setVisitDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="input-field"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Time Slot</label>
                  <select
                    value={timeSlot}
                    onChange={e => setTimeSlot(e.target.value)}
                    className="input-field appearance-none bg-white"
                  >
                    <option value="">Select time slot</option>
                    {TIME_SLOTS.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Adults</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-10 h-10 rounded-xl border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:border-rose-300 hover:bg-rose-50 transition-all font-semibold text-lg"
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-semibold text-slate-900 text-lg">{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults(Math.min(50, adults + 1))}
                      className="w-10 h-10 rounded-xl border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:border-rose-300 hover:bg-rose-50 transition-all font-semibold text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="mb-5">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Children</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="w-10 h-10 rounded-xl border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:border-rose-300 hover:bg-rose-50 transition-all font-semibold text-lg"
                    >
                      −
                    </button>
                    <span className="w-12 text-center font-semibold text-slate-900 text-lg">{children}</span>
                    <button
                      type="button"
                      onClick={() => setChildren(Math.min(50, children + 1))}
                      className="w-10 h-10 rounded-xl border-2 border-slate-200 flex items-center justify-center text-slate-600 hover:border-rose-300 hover:bg-rose-50 transition-all font-semibold text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Pricing Breakdown */}
                <div className="border-t border-slate-100 pt-4 mb-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Adults ({adults} × ₹{place.entryFee || 100})</span>
                    <span className="font-medium text-slate-900">₹{((place.entryFee || 100) * adults).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Children ({children} × ₹{place.childFee || 50})</span>
                    <span className="font-medium text-slate-900">₹{((place.childFee || 50) * children).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-slate-100">
                    <span>Total</span>
                    <span className="text-rose-600 text-xl">₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleBook}
                  disabled={booking === 'processing'}
                  className="btn-primary w-full py-3.5 text-base"
                >
                  {booking === 'processing' ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Processing...
                    </span>
                  ) : 'Book Now'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
