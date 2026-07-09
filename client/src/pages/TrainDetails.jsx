import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { processPayment } from '../utils/razorpay';

const CLASSES = [
  { value: '1st_ac', label: '1st AC', icon: '🛏️', desc: 'Luxury berths' },
  { value: '2nd_ac', label: '2nd AC', icon: '🛌', desc: 'Comfort sleeper' },
  { value: '3rd_ac', label: '3rd AC', icon: '🛌', desc: 'Budget AC' },
  { value: 'sleeper', label: 'Sleeper', icon: '😴', desc: 'No AC' },
];

function Skeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-primary-700 via-primary-600 to-teal-500 h-64" />
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
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
              </div>
              <div className="skeleton h-6 w-48" />
              <div className="flex flex-wrap gap-2">
                {[...Array(20)].map((_, i) => <div key={i} className="skeleton h-9 w-9 rounded-lg" />)}
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

export default function TrainDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [train, setTrain] = useState(null);
  const [selected, setSelected] = useState([]);
  const [selectedClass, setSelectedClass] = useState('1st_ac');
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/trains/${id}`)
      .then(({ data }) => {
        setTrain(data);
        setError(null);
      })
      .catch((e) => {
        setError(e.response?.data?.message || 'Failed to load train details');
        setTrain(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const toggleSeat = (seatNo) => {
    const s = train?.seats?.find((x) => x.seatNo === seatNo);
    if (s?.status !== 'available') return;
    setSelected((prev) => (prev.includes(seatNo) ? prev.filter((x) => x !== seatNo) : [...prev, seatNo]));
  };

  const getClassPrice = (className) => {
    if (!train) return 0;
    const price =
      className === '1st_ac' ? (train.firstAcPrice || train.pricePerSeat || 1500) :
      className === '2nd_ac' ? (train.secondAcPrice || train.pricePerSeat || 1000) :
      className === '3rd_ac' ? (train.thirdAcPrice || train.pricePerSeat || 700) :
      className === 'sleeper' ? (train.sleeperPrice || train.pricePerSeat || 300) :
      (train.pricePerSeat || 500);
    return typeof price === 'number' && price > 0 ? price : 500;
  };

  const getAvailableSeats = (className) => {
    if (!train?.seats) return [];
    return train.seats.filter(seat => {
      if (seat.class) return seat.class === className && seat.status === 'available';
      const seatNum = parseInt(seat.seatNo.replace(/\D/g, ''));
      if (className === '1st_ac') return seatNum >= 1 && seatNum <= 10 && seat.status === 'available';
      if (className === '2nd_ac') return seatNum >= 11 && seatNum <= 20 && seat.status === 'available';
      if (className === '3rd_ac') return seatNum >= 21 && seatNum <= 30 && seat.status === 'available';
      if (className === 'sleeper') return seatNum >= 31 && seatNum <= 40 && seat.status === 'available';
      return false;
    });
  };

  const getClassLabel = (className) => {
    switch (className) {
      case '1st_ac': return '1st AC';
      case '2nd_ac': return '2nd AC';
      case '3rd_ac': return '3rd AC';
      case 'sleeper': return 'Sleeper';
      default: return '1st AC';
    }
  };

  const handleBook = async () => {
    if (!user) {
      navigate('/auth', { state: { from: { pathname: `/trains/${id}` } } });
      return;
    }
    if (selected.length === 0) {
      alert('Please select at least one seat');
      return;
    }
    setPayLoading(true);
    try {
      const { data } = await api.post('/bookings/lock-seats', {
        type: 'train',
        id,
        seats: selected,
        seatClass: selectedClass
      });
      const orderRes = await api.post('/payment/create-order', { bookingId: data.booking._id });
      const bookingData = {
        bookingId: data.booking._id,
        amount: orderRes.data.amount / 100,
        type: 'train',
        seats: selected,
        seatClass: selectedClass,
        sessionId: orderRes.data.sessionId
      };
      localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
      navigate('/payment', { state: { bookingData } });
    } catch (e) {
      const errorMessage = e.response?.data?.message || e.message || 'Booking failed';
      alert(errorMessage);
      setPayLoading(false);
    }
  };

  if (loading) return <Skeleton />;

  if (error || !train) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🚂</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Train Not Found</h2>
          <p className="text-slate-500 mb-6">{error || 'The train you are looking for does not exist or has been removed.'}</p>
          <Link to="/trains" className="btn-primary">Browse Trains</Link>
        </div>
      </div>
    );
  }

  const total = selected.length * getClassPrice(selectedClass);
  const availableSeats = getAvailableSeats(selectedClass);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-teal-500 overflow-hidden">
        <div className="absolute inset-0 bg-mesh-pattern opacity-30" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-5 right-20 w-48 h-48 bg-primary-300/10 rounded-full blur-2xl animate-float-slower" />
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-float"
            style={{
              width: `${4 + Math.random() * 8}px`,
              height: `${4 + Math.random() * 8}px`,
              left: `${5 + Math.random() * 90}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${5 + Math.random() * 5}s`,
            }}
          />
        ))}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16 relative z-10">
          <Link to="/trains" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-medium mb-6 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Back to trains
          </Link>
          <div className="flex items-start gap-5 sm:gap-6 flex-wrap sm:flex-nowrap">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0 shadow-lg border border-white/10">
              <span className="text-3xl sm:text-4xl">🚂</span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gradient-hero leading-tight">{train.name}</h1>
              <p className="text-primary-200/80 text-sm sm:text-base mt-1 font-medium">{train.trainNumber}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-white/80 text-sm sm:text-base">
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-primary-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {train.source} → {train.destination}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 text-primary-200" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  {new Date(train.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-white border border-white/10">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {train.departureTime} – {train.arrivalTime}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-white border border-white/10">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  {train.duration || `${Math.round((new Date(`2000-01-01T${train.arrivalTime}`) - new Date(`2000-01-01T${train.departureTime}`)) / 3600000)}h`}
                </span>
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {CLASSES.map((cls) => {
                  const price = getClassPrice(cls.value);
                  const isActive = selectedClass === cls.value;
                  return (
                    <button
                      key={cls.value}
                      onClick={() => { setSelectedClass(cls.value); setSelected([]); }}
                      className={`relative p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                        isActive
                          ? 'border-primary-500 bg-primary-50 shadow-md shadow-primary-500/10'
                          : 'border-slate-200 bg-white hover:border-primary-300 hover:shadow-sm'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute -top-2 -right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                      )}
                      <div className="text-lg mb-1">{cls.icon}</div>
                      <div className="font-semibold text-slate-900 text-sm">{cls.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{cls.desc}</div>
                      <div className="text-primary-600 font-bold text-sm mt-1">₹{price}</div>
                    </button>
                  );
                })}
              </div>

              {/* Seat Selection */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-900 text-base sm:text-lg">
                  {getClassLabel(selectedClass)} Seats
                  <span className="ml-2 text-sm font-normal text-slate-500">({availableSeats.length} available)</span>
                </h3>
              </div>
              {availableSeats.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {availableSeats.map((s) => {
                    const isSel = selected.includes(s.seatNo);
                    return (
                      <button
                        key={s.seatNo}
                        onClick={() => toggleSeat(s.seatNo)}
                        className={`${
                          isSel ? 'seat-selected' : 'seat-available'
                        }`}
                      >
                        {s.seatNo}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-slate-50 rounded-xl p-6 text-center">
                  <p className="text-slate-500 text-sm">No seats available in this class</p>
                </div>
              )}
              <div className="flex flex-wrap gap-4 mt-4 text-xs sm:text-sm text-slate-500">
                <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-lg bg-emerald-100 border-2 border-emerald-400" /> Available</span>
                <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-lg bg-primary-600" /> Selected</span>
                <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded-lg bg-slate-200 border-2 border-slate-200" /> Booked</span>
              </div>
            </div>

            {/* Route Info */}
            <div className="card p-5 sm:p-6 animate-fade-in">
              <h2 className="section-title mb-4 text-xl sm:text-2xl">Route & Timing</h2>
              <div className="relative">
                <div className="absolute left-3 sm:left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-400 to-primary-200" />
                <div className="space-y-6 relative">
                  <div className="flex gap-4 items-start pl-2 sm:pl-3">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-md shadow-primary-500/20 relative z-10">S</div>
                    <div>
                      <p className="font-semibold text-slate-900">{train.source}</p>
                      <p className="text-sm text-slate-500">{train.departureTime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pl-2 sm:pl-3">
                    <div className="w-6 h-6 rounded-full border-2 border-primary-300 bg-white flex items-center justify-center relative z-10">
                      <div className="w-2 h-2 rounded-full bg-primary-400" />
                    </div>
                    <p className="text-sm text-slate-400">{train.duration || `${Math.round((new Date(`2000-01-01T${train.arrivalTime}`) - new Date(`2000-01-01T${train.departureTime}`)) / 3600000)}h journey`}</p>
                  </div>
                  <div className="flex gap-4 items-start pl-2 sm:pl-3">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-primary-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 shadow-md shadow-primary-600/20 relative z-10">D</div>
                    <div>
                      <p className="font-semibold text-slate-900">{train.destination}</p>
                      <p className="text-sm text-slate-500">{train.arrivalTime}</p>
                    </div>
                  </div>
                </div>
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
                    <span className="font-medium text-slate-900">{getClassLabel(selectedClass)}</span>
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
                    <span className="font-medium text-slate-900">₹{getClassPrice(selectedClass)}</span>
                  </div>
                  <div className="pt-3">
                    <div className="flex justify-between text-base font-bold text-slate-900">
                      <span>Total Amount</span>
                      <span className="text-primary-600 text-xl">₹{total.toLocaleString()}</span>
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
                    ) : 'Book & Pay Now'}
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
