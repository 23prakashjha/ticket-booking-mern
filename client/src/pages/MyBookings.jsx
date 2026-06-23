import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const typeIcons = { train: '🚂', bus: '🚌', flight: '✈️' };

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookings/my')
      .then(({ data }) => setBookings(data))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }
    
    try {
      await api.delete(`/bookings/${bookingId}`);
      setBookings(bookings.filter(b => b._id !== bookingId));
      alert('Booking cancelled successfully');
    } catch (error) {
      console.error('Delete booking error:', error);
      alert('Failed to cancel booking. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-slate-500">Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="section-title mb-1">My Bookings</h1>
        <p className="text-slate-600">View and manage your tickets</p>
      </div>

      {bookings.length === 0 ? (
        <div className="card p-12 text-center">
          <span className="text-5xl mb-4 block opacity-60">🎫</span>
          <h2 className="text-xl font-bold text-slate-900 mb-2">No bookings yet</h2>
          <p className="text-slate-600 mb-6">Book a train, bus or flight to see your tickets here.</p>
          <Link to="/" className="btn-primary">
            Search & Book
          </Link>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          {bookings.map((b) => {
            const ref = b.train || b.bus || b.flight;
            const icon = typeIcons[b.type] || '🎫';
            return (
              <div key={b._id} className="card p-5 sm:p-6 hover:shadow-card-hover transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <span className="text-3xl flex-shrink-0">{icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-slate-900 capitalize">{b.type}</span>
                      {ref && (
                        <span className="text-slate-600">
                          {ref.name} ({ref.trainNumber || ref.busNumber || ref.flightNumber})
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 text-sm mt-1">
                      Seats: {b.seats?.join(', ')} {b.seatClass && `• ${b.seatClass}`}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className={b.status === 'paid' ? 'badge-success' : 'badge-warning'}>
                        {b.status}
                      </span>
                      <span className="font-bold text-slate-900">₹{b.totalAmount}</span>
                      {b.status === 'pending' && (
                        <button
                          onClick={() => handleDeleteBooking(b._id)}
                          className="ml-auto px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                  <span className="text-slate-400 text-sm flex-shrink-0">
                    {new Date(b.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
