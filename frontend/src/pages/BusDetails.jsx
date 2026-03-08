import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { processPayment } from '../utils/stripe';

const COLS = 4;

export default function BusDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bus, setBus] = useState(null);
  const [selected, setSelected] = useState([]);
  const [selectedClass, setSelectedClass] = useState('sleeper');
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);

  useEffect(() => {
    api.get(`/buses/${id}`)
      .then(({ data }) => setBus(data))
      .catch(() => setBus(null))
      .finally(() => setLoading(false));
  }, [id]);

  const seats = bus?.seats || [];
  const toggleSeat = (seatNo) => {
    const s = bus?.seats?.find((x) => x.seatNo === seatNo);
    if (s?.status !== 'available') return;
    setSelected((prev) => (prev.includes(seatNo) ? prev.filter((x) => x !== seatNo) : [...prev, seatNo]));
  };

  const getClassPrice = (className) => {
    // Ensure we have valid bus data
    if (!bus) return 0;
    
    // Get price with proper fallbacks
    const price = 
      className === 'sleeper' ? (bus.sleeperPrice || bus.pricePerSeat || 800) :
      className === 'semi_sleeper' ? (bus.semiSleeperPrice || bus.pricePerSeat || 500) :
      (bus.pricePerSeat || 400);
    
    // Ensure we return a valid number
    return typeof price === 'number' && price > 0 ? price : 400;
  };

  const getAvailableSeats = (className) => {
    if (!bus?.seats) return [];
    
    // Filter seats by class, but handle legacy seats without class
    return bus.seats.filter(seat => {
      // For new seats with class information
      if (seat.class) {
        return seat.class === className && seat.status === 'available';
      }
      // For legacy seats without class, distribute them evenly
      const seatNum = parseInt(seat.seatNo.replace(/\D/g, ''));
      if (className === 'sleeper') return seatNum >= 1 && seatNum <= 18 && seat.status === 'available';
      if (className === 'semi_sleeper') return seatNum >= 19 && seatNum <= 36 && seat.status === 'available';
      return false;
    });
  };

  const getClassLabel = (className) => {
    switch (className) {
      case 'sleeper': return 'Sleeper';
      case 'semi_sleeper': return 'Semi-Sleeper';
      default: return 'Sleeper';
    }
  };

  const handleBook = async () => {
    if (!user) {
      navigate('/auth', { state: { from: { pathname: `/buses/${id}` } } });
      return;
    }
    if (selected.length === 0) return;
    setPayLoading(true);
    try {
      const { data } = await api.post('/bookings/lock-seats', { 
        type: 'bus', 
        id, 
        seats: selected,
        seatClass: selectedClass 
      });
      const orderRes = await api.post('/payment/create-order', { bookingId: data.booking._id });
      
      // Store booking data for payment page
      const bookingData = {
        bookingId: data.booking._id,
        amount: orderRes.data.amount / 100,
        type: 'bus',
        seats: selected,
        seatClass: selectedClass,
        sessionId: orderRes.data.sessionId
      };
      
      localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
      
      // Navigate to payment page
      navigate('/payment', { state: { bookingData } });
      
    } catch (e) {
      alert(e.response?.data?.message || 'Booking failed');
      setPayLoading(false);
    }
  };

  if (loading || !bus) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  const total = selected.length * getClassPrice(selectedClass);
  const grid = [];
  for (let i = 0; i < seats.length; i += COLS) grid.push(seats.slice(i, i + COLS));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <Link to="/buses" className="inline-flex items-center gap-1 text-slate-600 hover:text-primary-600 text-sm font-medium mb-6">
        ← Back to buses
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <span className="text-4xl">🚌</span>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{bus.name}</h1>
                <p className="text-slate-500">({bus.busNumber})</p>
                <p className="text-slate-700 mt-2 font-medium">{bus.source} → {bus.destination}</p>
                <p className="text-slate-500 text-sm mt-1">
                  {new Date(bus.date).toLocaleDateString()} • {bus.departureTime} – {bus.arrivalTime}
                </p>
                <p className="text-primary-600 font-bold mt-2">₹{getClassPrice(selectedClass)} per seat</p>
              </div>
            </div>
          </div>

          {/* Class Selection */}
          <div className="card p-6">
            <h2 className="font-bold text-slate-900 mb-4">Select Class</h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { value: 'sleeper', label: 'Sleeper', price: getClassPrice('sleeper') },
                { value: 'semi_sleeper', label: 'Semi-Sleeper', price: getClassPrice('semi_sleeper') }
              ].map((cls) => (
                <button
                  key={cls.value}
                  onClick={() => {
                    setSelectedClass(cls.value);
                    setSelected([]); // Clear selected seats when changing class
                  }}
                  className={`p-3 border-2 rounded-lg transition-all ${
                    selectedClass === cls.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-medium text-slate-900">{cls.label}</div>
                    <div className="text-sm text-slate-600">₹{cls.price}</div>
                  </div>
                </button>
              ))}
            </div>

            <h3 className="font-medium text-slate-900 mb-3">
              {getClassLabel(selectedClass)} - Available Seats
            </h3>
            <div className="flex flex-wrap gap-2">
              {getAvailableSeats(selectedClass).map((s) => (
                <button
                  key={s.seatNo}
                  onClick={() => toggleSeat(s.seatNo)}
                  className={`w-12 h-12 border-2 rounded-lg transition-all ${
                    s.status === 'available'
                      ? selected.includes(s.seatNo)
                        ? 'border-primary-500 bg-primary-500 text-white'
                        : 'border-slate-300 hover:border-primary-400 hover:bg-primary-50'
                      : 'border-slate-200 bg-slate-100 cursor-not-allowed'
                  }`}
                  disabled={s.status !== 'available'}
                >
                  <span className="text-xs font-medium">{s.seatNo}</span>
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-600">
              <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-emerald-200" /> Available</span>
              <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-red-200" /> Booked</span>
              <span className="flex items-center gap-1.5"><span className="w-4 h-4 rounded bg-primary-600" /> Selected</span>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-bold text-slate-900 mb-4">Seat layout</h2>
            <div className="inline-block p-4 rounded-2xl bg-slate-100/80">
              {grid.map((row, ri) => (
                <div key={ri} className="flex gap-2 justify-center mb-2">
                  {row.map((s) => (
                    <button
                      key={s.seatNo}
                      type="button"
                      onClick={() => toggleSeat(s.seatNo)}
                      disabled={s.status !== 'available'}
                      className={`w-10 h-10 rounded-lg font-semibold text-sm transition-all ${
                        s.status === 'booked'
                          ? 'bg-red-500 text-white cursor-not-allowed'
                          : s.status === 'locked'
                          ? 'bg-amber-400 cursor-not-allowed'
                          : selected.includes(s.seatNo)
                          ? 'bg-primary-600 text-white ring-2 ring-primary-300 ring-offset-2'
                          : 'bg-emerald-500 text-white hover:bg-emerald-600'
                      }`}
                    >
                      {s.seatNo.replace('B', '')}
                    </button>
                  ))}
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-600">
              <span className="inline-block w-3 h-3 rounded-full bg-emerald-500 mr-1 align-middle" /> Green = Available
              <span className="mx-2">•</span>
              <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-1 align-middle" /> Red = Occupied
            </p>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 card p-6">
            <h3 className="font-bold text-slate-900 mb-4">Booking summary</h3>
            <div className="space-y-2 text-slate-600">
              <p>{selected.length} seat(s) selected</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">₹{total}</p>
            </div>
            <button
              onClick={handleBook}
              disabled={selected.length === 0 || payLoading}
              className="btn-primary w-full mt-6 py-3.5"
            >
              {!user ? 'Login to Book' : payLoading ? 'Opening payment...' : 'Book & Pay Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
