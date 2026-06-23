import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { processPayment } from '../utils/stripe';

const COLS = 6;

export default function FlightDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [flight, setFlight] = useState(null);
  const [seatClass, setSeatClass] = useState('economy');
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);

  useEffect(() => {
    api.get(`/flights/${id}`)
      .then(({ data }) => setFlight(data))
      .catch(() => setFlight(null))
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
      
      // Store booking data for payment page
      const bookingData = {
        bookingId: data.booking._id,
        amount: orderRes.data.amount / 100,
        type: 'flight',
        seats: selected,
        seatClass,
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

  if (loading || !flight) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  const grid = [];
  for (let i = 0; i < seats.length; i += COLS) grid.push(seats.slice(i, i + COLS));

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <Link to="/flights" className="inline-flex items-center gap-1 text-slate-600 hover:text-primary-600 text-sm font-medium mb-6">
        ← Back to flights
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <span className="text-4xl">✈️</span>
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold text-slate-900">{flight.name}</h1>
                <p className="text-slate-500">({flight.flightNumber})</p>
                <p className="text-slate-700 mt-2 font-medium">{flight.source} → {flight.destination}</p>
                <p className="text-slate-500 text-sm mt-1">
                  {new Date(flight.date).toLocaleDateString()} • {flight.departureTime} – {flight.arrivalTime}
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => setSeatClass('economy')}
                    className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                      seatClass === 'economy' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Economy ₹{flight.economyPrice}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSeatClass('business')}
                    className={`px-4 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                      seatClass === 'business' ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Business ₹{flight.businessPrice}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-bold text-slate-900 mb-4">Seat layout ({seatClass})</h2>
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
                      {s.seatNo.replace('F', '')}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 card p-6">
            <h3 className="font-bold text-slate-900 mb-4">Booking summary</h3>
            <div className="space-y-2 text-slate-600">
              <p>{selected.length} seat(s) • {seatClass}</p>
              <p className="text-2xl font-bold text-slate-900 mt-2">₹{total}</p>
            </div>
            <button
              onClick={handleBook}
              disabled={selected.length === 0 || payLoading}
              className="btn-primary w-full mt-6 py-3.5"
            >
              {!user ? 'Login to Book' : payLoading ? 'Opening payment...' : 'Book Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
