import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const typeIcons = { train: '🚂', bus: '🚌', flight: '✈️' };
const typeGradients = {
  train: 'from-blue-500 to-blue-600',
  bus: 'from-emerald-500 to-emerald-600',
  flight: 'from-purple-500 to-purple-600',
};
const typeLabels = { train: 'Train', bus: 'Bus', flight: 'Flight' };

const statusConfig = {
  paid: { badge: 'badge-success', dot: 'bg-emerald-500' },
  pending: { badge: 'badge-warning', dot: 'bg-amber-500' },
  cancelled: { badge: 'bg-red-100 text-red-800', dot: 'bg-red-500' },
};

function BookingCard({ booking, index, onCancel }) {
  const ref = booking.train || booking.bus || booking.flight;
  const icon = typeIcons[booking.type] || '🎫';
  const gradient = typeGradients[booking.type] || 'from-primary-500 to-primary-600';
  const status = statusConfig[booking.status] || statusConfig.pending;
  const number = ref?.trainNumber || ref?.busNumber || ref?.flightNumber;
  const animationDelay = `${index * 0.08}s`;

  return (
    <div
      className="group opacity-0 animate-fade-in-up"
      style={{ animationDelay, animationFillMode: 'forwards' }}
    >
      <div className="relative bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-card-hover hover:border-primary-200 transition-all duration-300 overflow-hidden">
        {/* Top gradient bar */}
        <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />

        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-4">
            {/* Type icon */}
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xl shadow-md flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
              {icon}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 uppercase tracking-wide">
                  {typeLabels[booking.type] || booking.type}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>

              <h3 className="font-bold text-lg text-slate-900 mt-2 group-hover:text-primary-600 transition-colors truncate">
                {ref?.name || 'Booking'}
              </h3>

              {number && (
                <p className="text-sm text-slate-500 mt-0.5">
                  {booking.type === 'train' ? 'Train' : booking.type === 'bus' ? 'Bus' : 'Flight'} No. {number}
                </p>
              )}

              {/* Divider */}
              <div className="relative my-3">
                <div className="border-t border-dashed border-slate-200" />
                <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-50 border border-slate-200" />
                <div className="absolute -right-6 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-50 border border-slate-200" />
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                <div>
                  <span className="text-slate-400 text-xs">Seats</span>
                  <p className="font-semibold text-slate-800 mt-0.5 truncate">
                    {booking.seats?.join(', ') || '—'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 text-xs">Class</span>
                  <p className="font-semibold text-slate-800 mt-0.5 capitalize">
                    {booking.seatClass || '—'}
                  </p>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-slate-400 text-xs">Amount</span>
                  <p className="font-bold text-lg text-slate-900 mt-0.5">₹{booking.totalAmount}</p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(booking.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  })}
                </div>

                {booking.status === 'pending' && (
                  <button
                    onClick={() => onCancel(booking._id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-50 text-red-600 text-xs font-semibold rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors active:scale-95"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-24 flex flex-col items-center justify-center gap-5">
        <div className="relative">
          <div className="w-14 h-14 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
          <div className="absolute inset-0 w-14 h-14 rounded-full border-4 border-transparent border-b-primary-300 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
        </div>
        <div className="text-center">
          <p className="text-slate-600 font-medium">Loading your bookings...</p>
          <p className="text-slate-400 text-sm mt-1">Please wait a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary-900 to-teal-900 py-12 md:py-16">
        <div className="absolute inset-0 bg-mesh-pattern opacity-20" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-4 backdrop-blur-sm border border-white/10">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            Your Travel Tickets
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
            My <span className="text-gradient-hero">Bookings</span>
          </h1>
          <p className="mt-3 text-teal-100/80 text-base sm:text-lg max-w-md mx-auto">
            View and manage all your tickets in one place
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        {bookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-10 md:p-14 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-5xl">
              🎫
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">No bookings yet</h2>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
              You haven't booked any tickets yet. Start planning your next journey!
            </p>
            <Link to="/" className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-base shadow-lg shadow-primary-600/20 hover:shadow-xl hover:shadow-primary-600/30">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search & Book
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                <span className="font-semibold text-slate-800">{bookings.length}</span> {bookings.length === 1 ? 'booking' : 'bookings'} found
              </p>
            </div>
            {bookings.map((booking, index) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                index={index}
                onCancel={handleDeleteBooking}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
