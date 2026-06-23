import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  const paymentData = location.state || {};

  useEffect(() => {
    if (!paymentData.bookingId) {
      navigate('/my-bookings');
      return;
    }

    // Fetch booking details
    api.get('/bookings/my')
      .then(({ data }) => {
        const booking = data.find(b => b._id === paymentData.bookingId);
        setBooking(booking);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [navigate, paymentData.bookingId]);

  const handleViewTicket = () => {
    navigate('/my-bookings');
  };

  const handleDownloadTicket = () => {
    // Mock download functionality
    alert('Ticket download feature coming soon!');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-slate-500">Loading booking details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">✅</span>
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Payment Successful!</h1>
        <p className="text-slate-600">Your booking has been confirmed</p>
      </div>

      {/* Booking Details */}
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Booking Details</h2>
        
        {booking && (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600">Booking ID</p>
                <p className="font-medium">{booking._id}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Booking Date</p>
                <p className="font-medium">{new Date(booking.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Journey Type</p>
                <p className="font-medium capitalize">{booking.type}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Seats</p>
                <p className="font-medium">{booking.seats?.join(', ')}</p>
              </div>
              {booking.seatClass && (
                <div>
                  <p className="text-sm text-slate-600">Class</p>
                  <p className="font-medium capitalize">{booking.seatClass}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-slate-600">Status</p>
                <span className="badge-success">Paid</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Total Amount Paid</span>
                <span className="text-2xl font-bold text-green-600">₹{booking.totalAmount}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Payment Method */}
      {paymentData.method && (
        <div className="card p-6 mb-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Payment Information</h2>
          <div className="flex items-center gap-3">
            <span className="text-2xl">
              {paymentData.method === 'card' && '💳'}
              {paymentData.method === 'upi' && '📱'}
              {paymentData.method === 'netbanking' && '🏦'}
              {paymentData.method === 'wallet' && '👛'}
              {paymentData.method === 'cod' && '💵'}
              {paymentData.method === 'emi' && '📊'}
            </span>
            <div>
              <p className="font-medium capitalize">
                {paymentData.method === 'card' && 'Credit/Debit Card'}
                {paymentData.method === 'upi' && 'UPI Payment'}
                {paymentData.method === 'netbanking' && 'Net Banking'}
                {paymentData.method === 'wallet' && 'Mobile Wallet'}
                {paymentData.method === 'cod' && 'Cash on Delivery'}
                {paymentData.method === 'emi' && 'EMI'}
              </p>
              <p className="text-sm text-slate-600">Payment successful</p>
            </div>
          </div>
        </div>
      )}

      {/* Important Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="font-bold text-blue-900 mb-3">Important Information</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Please arrive at the station/airport at least 30 minutes before departure</li>
          <li>• Carry a valid ID proof along with your booking confirmation</li>
          <li>• This booking confirmation will be sent to your registered email</li>
          <li>• For any changes or cancellations, visit the My Bookings section</li>
          <li>• Keep your PNR/Booking ID handy for any queries</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleViewTicket}
          className="btn-primary flex-1 py-3"
        >
          View My Tickets
        </button>
        <button
          onClick={handleDownloadTicket}
          className="btn-secondary flex-1 py-3"
        >
          Download Ticket
        </button>
      </div>

      {/* Quick Links */}
      <div className="mt-8 text-center">
        <p className="text-slate-600 mb-4">Need help with your booking?</p>
        <div className="flex justify-center gap-4">
          <button className="text-primary-600 hover:text-primary-700 font-medium">
            Contact Support
          </button>
          <button className="text-primary-600 hover:text-primary-700 font-medium">
            FAQ
          </button>
          <button className="text-primary-600 hover:text-primary-700 font-medium">
            Track Booking
          </button>
        </div>
      </div>
    </div>
  );
}
