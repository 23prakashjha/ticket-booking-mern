import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const roomTypeMeta = {
  single: { label: 'Single Room', icon: '🛏️', capacity: 1 },
  double: { label: 'Double Room', icon: '🛌', capacity: 2 },
  suite: { label: 'Suite', icon: '🏠', capacity: 4 },
  dormitory: { label: 'Dormitory', icon: '🛌', capacity: 1 },
};

function Skeleton() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 h-64" />
      <div className="max-w-6xl mx-auto px-4 -mt-20 relative z-10 space-y-6 pb-12">
        <div className="card p-6 animate-pulse space-y-4">
          <div className="skeleton h-8 w-64" />
          <div className="skeleton h-4 w-48" />
          <div className="flex gap-2"><div className="skeleton h-6 w-16 rounded-full" /><div className="skeleton h-6 w-20 rounded-full" /></div>
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="card p-6 animate-pulse space-y-4">
                <div className="skeleton h-6 w-32" />
                <div className="skeleton h-4 w-48" />
                <div className="flex flex-wrap gap-2">
                  {[...Array(5)].map((_, j) => <div key={j} className="skeleton h-8 w-16 rounded-lg" />)}
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="card p-6 animate-pulse space-y-4">
              <div className="skeleton h-6 w-32" />
              <div className="skeleton h-10 w-full rounded-xl" />
              <div className="skeleton h-10 w-full rounded-xl" />
              <div className="skeleton h-10 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRooms, setSelectedRooms] = useState({});
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    axios.get(`/hotels/${id}`)
      .then(res => setHotel(res.data))
      .catch(() => navigate('/hotels'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const roomTypes = hotel?.rooms?.reduce((acc, room) => {
    if (!acc[room.type]) acc[room.type] = [];
    acc[room.type].push(room);
    return acc;
  }, {});

  const availableRoomsForType = (type) =>
    (roomTypes?.[type] || []).filter(r => r.status === 'available');

  const toggleRoom = (roomNo, type) => {
    setSelectedRooms(prev => {
      const updated = { ...prev };
      if (updated[roomNo]) delete updated[roomNo];
      else updated[roomNo] = type;
      return updated;
    });
  };

  const handleBook = async () => {
    setError('');
    const selectedRoomNos = Object.keys(selectedRooms);
    if (!selectedRoomNos.length) return setError('Please select at least one room');
    if (!checkIn || !checkOut) return setError('Please select check-in and check-out dates');

    const roomType = selectedRooms[selectedRoomNos[0]];

    setBooking('processing');
    try {
      const { data } = await axios.post('/bookings/lock-seats', {
        type: 'hotel',
        id: hotel._id,
        seats: selectedRoomNos,
        roomType,
        guests: selectedRoomNos.length,
        checkIn: new Date(checkIn).toISOString(),
        checkOut: new Date(checkOut).toISOString(),
        seatClass: roomType,
      });
      const bookingData = {
        bookingId: data.booking._id,
        amount: data.totalAmount,
        type: 'hotel',
        seats: selectedRoomNos,
        roomType,
      };
      localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
      navigate('/payment', { state: { bookingData } });
    } catch (e) {
      setError(e.response?.data?.message || 'Booking failed');
      setBooking(null);
    }
  };

  const roomsArray = hotel?.rooms || [];

  if (loading) return <Skeleton />;

  if (!hotel) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🏨</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Hotel Not Found</h2>
          <p className="text-slate-500 mb-6">The hotel you are looking for does not exist or has been removed.</p>
          <button onClick={() => navigate('/hotels')} className="btn-primary">Browse Hotels</button>
        </div>
      </div>
    );
  }

  const totalAmount = Object.entries(selectedRooms).reduce((sum, [roomNo, type]) => {
    const room = roomsArray.find(r => r.roomNo === roomNo);
    return sum + (room?.price || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 overflow-hidden">
        <div className="absolute inset-0 bg-mesh-pattern opacity-30" />
        <div className="absolute -top-10 left-20 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 right-10 w-64 h-64 bg-teal-300/10 rounded-full blur-2xl animate-float-slower" />
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/10 animate-float"
            style={{
              width: `${4 + Math.random() * 10}px`,
              height: `${4 + Math.random() * 10}px`,
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
              {hotel.image || '🏨'}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gradient-hero leading-tight">{hotel.name}</h1>
              <p className="text-emerald-200/80 text-sm sm:text-base mt-1">{hotel.location}{hotel.city ? `, ${hotel.city}` : ''}</p>
              {hotel.address && <p className="text-white/50 text-xs sm:text-sm mt-0.5">{hotel.address}</p>}
              <div className="flex flex-wrap items-center gap-3 mt-4">
                <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-white border border-white/10">
                  ⭐ {hotel.rating}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-white border border-white/10">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  {hotel.totalRooms || roomsArray.length} rooms
                </span>
                {hotel.checkInTime && hotel.checkOutTime && (
                  <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-white border border-white/10">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {hotel.checkInTime} – {hotel.checkOutTime}
                  </span>
                )}
              </div>
              {hotel.amenities?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {hotel.amenities.map((a, i) => (
                    <span key={i} className="bg-white/10 backdrop-blur-sm px-2.5 py-0.5 rounded-full text-xs text-white/80 border border-white/5">
                      {a}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-10 pb-12">
        {/* Description */}
        {hotel.description && (
          <div className="card p-5 sm:p-6 mb-6 animate-fade-in">
            <h2 className="section-title mb-3 text-xl sm:text-2xl">About</h2>
            <p className="text-slate-600 leading-relaxed">{hotel.description}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left column - Room types */}
          <div className="lg:col-span-2 space-y-6">
            {Object.entries(roomTypeMeta).map(([type, meta]) => {
              const available = availableRoomsForType(type);
              if (available.length === 0) return null;
              const samplePrice = roomTypes[type]?.[0]?.price || 0;
              return (
                <div key={type} className="card p-5 sm:p-6 animate-fade-in">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-lg">
                        {meta.icon} {meta.label}
                      </h3>
                      <p className="text-sm text-slate-500">Up to {meta.capacity} guest{meta.capacity > 1 ? 's' : ''} • {available.length} available</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-600">₹{samplePrice}</p>
                      <p className="text-xs text-slate-400">per night</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {available.map(room => {
                      const isSelected = !!selectedRooms[room.roomNo];
                      return (
                        <button
                          key={room.roomNo}
                          onClick={() => toggleRoom(room.roomNo, type)}
                          className={`px-3 py-1.5 rounded-lg border-2 text-sm font-medium transition-all duration-150 ${
                            isSelected
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm'
                              : 'border-slate-200 text-slate-600 hover:border-emerald-300 hover:bg-emerald-50/50'
                          }`}
                        >
                          {room.roomNo}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {Object.keys(roomTypes || {}).length === 0 && (
              <div className="card p-8 text-center">
                <p className="text-slate-400">No rooms available for this hotel</p>
              </div>
            )}
          </div>

          {/* Right column - Booking form */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6 space-y-6 animate-fade-in">
              <div className="card p-5 sm:p-6">
                <h3 className="font-bold text-slate-900 text-lg mb-5">Book Your Stay</h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Check-in</label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={e => setCheckIn(e.target.value)}
                    className="input-field"
                  />
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Check-out</label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={e => setCheckOut(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div className="border-t border-slate-100 pt-4 mb-4">
                  <div className="flex justify-between text-sm text-slate-600 mb-2">
                    <span>Rooms selected</span>
                    <span className="font-medium text-slate-900">{Object.keys(selectedRooms).length}</span>
                  </div>
                  {Object.keys(selectedRooms).length > 0 && (
                    <div className="space-y-1.5 mb-3">
                      {Object.entries(selectedRooms).map(([roomNo, type]) => {
                        const room = roomsArray.find(r => r.roomNo === roomNo);
                        return (
                          <div key={roomNo} className="flex justify-between text-sm bg-slate-50 rounded-lg px-3 py-2">
                            <span className="text-slate-600">{roomNo} <span className="text-slate-400">({type})</span></span>
                            <span className="font-medium text-slate-900">₹{room?.price || 0}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-slate-100">
                    <span>Total</span>
                    <span className="text-emerald-600 text-xl">₹{totalAmount.toLocaleString()}</span>
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
