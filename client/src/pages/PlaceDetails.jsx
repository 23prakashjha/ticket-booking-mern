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
      const { data } = await axios.post('/booking/lock-seats', {
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600" />
      </div>
    );
  }

  if (!place) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-rose-500 to-pink-600 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <button onClick={() => navigate(-1)} className="text-white/80 hover:text-white mb-4 flex items-center gap-2">
            ← Back
          </button>
          <div className="flex items-start gap-6">
            <span className="text-6xl">{place.image || CATEGORY_ICONS[place.category]}</span>
            <div className="text-white">
              <h1 className="text-3xl font-bold">{place.name}</h1>
              <p className="text-white/80 mt-1">{place.city}{place.state ? `, ${place.state}` : ''}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {CATEGORY_ICONS[place.category]} {place.category?.replace('_', ' ')}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">⭐ {place.rating}</span>
              </div>
              <div className="flex items-center gap-3 mt-2 text-white/70 text-sm">
                <span>🕐 {place.openingTime} - {place.closingTime}</span>
                {place.bestTime && <span>📅 Best: {place.bestTime}</span>}
                {place.duration && <span>⏱️ {place.duration}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {place.description && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold mb-2">About</h2>
                <p className="text-gray-600 leading-relaxed">{place.description}</p>
              </div>
            )}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Timing & Info</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-lg">🕐</span>
                  <div><p className="font-medium text-gray-800">Opening Time</p><p>{place.openingTime}</p></div>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <span className="text-lg">🕐</span>
                  <div><p className="font-medium text-gray-800">Closing Time</p><p>{place.closingTime}</p></div>
                </div>
                {place.bestTime && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-lg">📅</span>
                    <div><p className="font-medium text-gray-800">Best Time</p><p>{place.bestTime}</p></div>
                  </div>
                )}
                {place.duration && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="text-lg">⏱️</span>
                    <div><p className="font-medium text-gray-800">Duration</p><p>{place.duration}</p></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 h-fit sticky top-24">
            <h3 className="font-semibold text-lg mb-4">Book Tickets</h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Visit Date</label>
              <input
                type="date"
                value={visitDate}
                onChange={e => setVisitDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot</label>
              <select
                value={timeSlot}
                onChange={e => setTimeSlot(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none bg-white"
              >
                <option value="">Select time slot</option>
                {TIME_SLOTS.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Adults</label>
              <input
                type="number"
                min="1"
                max="50"
                value={adults}
                onChange={e => setAdults(Math.max(1, Number(e.target.value)))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Children</label>
              <input
                type="number"
                min="0"
                max="50"
                value={children}
                onChange={e => setChildren(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none"
              />
            </div>

            <div className="border-t pt-4 mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Adults ({adults} × ₹{place.entryFee || 100})</span>
                <span>₹{(place.entryFee || 100) * adults}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Children ({children} × ₹{place.childFee || 50})</span>
                <span>₹{(place.childFee || 50) * children}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span className="text-rose-600">₹{totalAmount}</span>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <button
              onClick={handleBook}
              disabled={booking === 'processing'}
              className="w-full py-3 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 disabled:opacity-50 transition"
            >
              {booking === 'processing' ? 'Processing...' : 'Book Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
