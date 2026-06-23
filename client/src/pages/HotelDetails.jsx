import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const roomTypeMeta = {
  single: { label: 'Single Room', icon: '🛏️', capacity: 1 },
  double: { label: 'Double Room', icon: '🛌', capacity: 2 },
  suite: { label: 'Suite', icon: '🏠', capacity: 4 },
  dormitory: { label: 'Dormitory', icon: '🛌', capacity: 1 },
};

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
      const { data } = await axios.post('/booking/lock', {
        type: 'hotel',
        id: hotel._id,
        seats: selectedRoomNos,
        roomType,
        guests: selectedRoomNos.length,
        checkIn: new Date(checkIn).toISOString(),
        checkOut: new Date(checkOut).toISOString(),
        seatClass: roomType,
      });
      navigate('/payment', { state: { 
        bookingId: data.booking._id, 
        amount: data.totalAmount, 
        description: `${hotel.name} - ${selectedRoomNos.length} room(s)` 
      }});
    } catch (e) {
      setError(e.response?.data?.message || 'Booking failed');
      setBooking(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
      </div>
    );
  }

  if (!hotel) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <button onClick={() => navigate(-1)} className="text-white/80 hover:text-white mb-4 flex items-center gap-2">
            ← Back
          </button>
          <div className="flex items-start gap-6">
            <span className="text-6xl">{hotel.image || '🏨'}</span>
            <div className="text-white">
              <h1 className="text-3xl font-bold">{hotel.name}</h1>
              <p className="text-white/80 mt-1">{hotel.location}, {hotel.city}</p>
              <p className="text-white/60 mt-1">{hotel.address}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  ⭐ {hotel.rating}
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                  {hotel.totalRooms} rooms
                </span>
              </div>
              {hotel.amenities?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {hotel.amenities.map((a, i) => (
                    <span key={i} className="bg-white/15 px-2 py-0.5 rounded text-sm">{a}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {hotel.description && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-2">About</h2>
            <p className="text-gray-600">{hotel.description}</p>
            <div className="mt-3 text-sm text-gray-500">
              Check-in: {hotel.checkInTime} | Check-out: {hotel.checkOutTime}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {Object.entries(roomTypeMeta).map(([type, meta]) => {
              const available = availableRoomsForType(type);
              if (available.length === 0) return null;
              return (
                <div key={type} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{meta.icon} {meta.label}</h3>
                      <p className="text-sm text-gray-500">Up to {meta.capacity} guest{meta.capacity > 1 ? 's' : ''}</p>
                    </div>
                    <span className="text-lg font-bold text-emerald-600">
                      ₹{roomTypes[type][0].price}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {available.map(room => {
                      const isSelected = !!selectedRooms[room.roomNo];
                      return (
                        <button
                          key={room.roomNo}
                          onClick={() => toggleRoom(room.roomNo, type)}
                          className={`px-3 py-1.5 rounded-lg border-2 text-sm font-medium transition ${
                            isSelected 
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-gray-200 hover:border-emerald-300 text-gray-600'
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
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 h-fit sticky top-24">
            <h3 className="font-semibold text-lg mb-4">Book Your Stay</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
              <input
                type="date"
                value={checkIn}
                onChange={e => setCheckIn(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
              <input
                type="date"
                value={checkOut}
                onChange={e => setCheckOut(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 outline-none"
              />
            </div>

            <div className="border-t pt-4 mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Rooms selected</span>
                <span>{Object.keys(selectedRooms).length}</span>
              </div>
              {Object.keys(selectedRooms).length > 0 && (
                <div className="space-y-1 mb-3">
                  {Object.entries(selectedRooms).map(([roomNo, type]) => (
                    <div key={roomNo} className="flex justify-between text-sm text-gray-500">
                      <span>{roomNo} ({type})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

            <button
              onClick={handleBook}
              disabled={booking === 'processing'}
              className="w-full py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition"
            >
              {booking === 'processing' ? 'Processing...' : 'Book Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
