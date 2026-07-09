import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { processPayment } from '../utils/razorpay';

const PAYMENT_METHODS = [
  { id: 'card', name: 'Credit / Debit Card', icon: '💳', description: 'Visa, Mastercard, Rupay', popular: true },
  { id: 'upi', name: 'UPI', icon: '📱', description: 'GPay, PhonePe, Paytm', popular: true },
  { id: 'netbanking', name: 'Net Banking', icon: '🏦', description: 'All major banks' },
  { id: 'wallet', name: 'Wallet', icon: '👛', description: 'Paytm, PhonePe Wallet' },
  { id: 'emi', name: 'EMI', icon: '📊', description: 'Easy monthly installments' },
  { id: 'cod', name: 'Cash on Delivery', icon: '💵', description: 'Pay when you receive' },
];

export default function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState(null);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  useEffect(() => {
    // Get booking data from location state or localStorage
    const data = location.state?.bookingData || JSON.parse(localStorage.getItem('pendingBooking') || '{}');
    if (!data.bookingId) {
      navigate('/');
      return;
    }
    setBookingData(data);
  }, [navigate, location.state]);

  const handlePayment = async () => {
    if (!bookingData) return;
    
    setLoading(true);
    try {
      await processPayment({
        bookingId: bookingData.bookingId,
        amount: bookingData.amount,
        onSuccess: (booking) => {
          localStorage.removeItem('pendingBooking');
          navigate('/payment-success', { 
            state: { 
              bookingId: bookingData.bookingId,
              amount: bookingData.amount,
              method: selectedMethod
            } 
          });
        },
        onError: (msg) => {
          alert(msg || 'Payment failed. Please try again.');
        }
      });
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-slate-500">Loading payment details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Complete Payment</h1>
        <p className="text-slate-600">Choose your preferred payment method</p>
      </div>

      {/* Order Summary */}
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Order Summary</h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-slate-600">
              {bookingData.type === 'hotel' ? 'Hotel Booking' :
               bookingData.type === 'place' ? 'Place Entry' :
               (bookingData.type?.charAt(0).toUpperCase() + bookingData.type?.slice(1)) + ' Ticket'}
            </span>
            <span className="font-medium">₹{bookingData.amount}</span>
          </div>
          {bookingData.type !== 'place' && (
          <div className="flex justify-between items-center">
            <span className="text-slate-600">{bookingData.type === 'hotel' ? 'Rooms' : 'Seats'}</span>
            <span className="font-medium">{bookingData.seats?.join(', ')}</span>
          </div>
          )}
          <div className="flex justify-between items-center pt-3 border-t">
            <span className="font-bold text-slate-900">Total Amount</span>
            <span className="text-2xl font-bold text-primary-600">₹{bookingData.amount}</span>
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Select Payment Method</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {PAYMENT_METHODS.map((method) => (
            <div
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedMethod === method.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{method.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900">{method.name}</span>
                    {method.popular && (
                      <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full">
                        Popular
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">{method.description}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 ${
                  selectedMethod === method.id
                    ? 'border-primary-500 bg-primary-500'
                    : 'border-slate-300'
                }`}>
                  {selectedMethod === method.id && (
                    <div className="w-full h-full rounded-full bg-white scale-50" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Form */}
      <div className="card p-6 mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Payment Details</h2>
        
        {selectedMethod === 'card' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.number}
                onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                className="input-field"
                maxLength={19}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Cardholder Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={cardDetails.name}
                onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                className="input-field"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                  className="input-field"
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                  className="input-field"
                  maxLength={3}
                />
              </div>
            </div>
          </div>
        )}

        {selectedMethod === 'upi' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">UPI ID</label>
              <input
                type="text"
                placeholder="username@ybl"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="p-4 bg-slate-50 rounded-lg">
              <p className="text-sm text-slate-600 mb-2">You will receive a payment request on your UPI app</p>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-white rounded text-sm">GPay</span>
                <span className="px-3 py-1 bg-white rounded text-sm">PhonePe</span>
                <span className="px-3 py-1 bg-white rounded text-sm">Paytm</span>
              </div>
            </div>
          </div>
        )}

        {selectedMethod === 'netbanking' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Bank</label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="input-field"
              >
                <option value="">Choose your bank</option>
                <option value="sbi">State Bank of India</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
                <option value="pnb">Punjab National Bank</option>
              </select>
            </div>
          </div>
        )}

        {selectedMethod === 'wallet' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 border-2 border-slate-200 rounded-lg hover:border-primary-500">
                <span className="text-2xl mb-2 block">📱</span>
                <span className="font-medium">Paytm Wallet</span>
              </button>
              <button className="p-4 border-2 border-slate-200 rounded-lg hover:border-primary-500">
                <span className="text-2xl mb-2 block">📱</span>
                <span className="font-medium">PhonePe Wallet</span>
              </button>
            </div>
          </div>
        )}

        {selectedMethod === 'cod' && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> Cash on delivery is available for bookings above ₹500. 
              You'll need to pay when you receive your tickets.
            </p>
          </div>
        )}

        {selectedMethod === 'emi' && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <button className="p-3 border-2 border-slate-200 rounded-lg hover:border-primary-500">
                <span className="font-medium">3 Months</span>
                <span className="text-sm text-slate-600">No interest</span>
              </button>
              <button className="p-3 border-2 border-slate-200 rounded-lg hover:border-primary-500">
                <span className="font-medium">6 Months</span>
                <span className="text-sm text-slate-600">No interest</span>
              </button>
              <button className="p-3 border-2 border-slate-200 rounded-lg hover:border-primary-500">
                <span className="font-medium">12 Months</span>
                <span className="text-sm text-slate-600">Low interest</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <span className="text-slate-500">🔒 Secure Payment</span>
        <span className="text-slate-500">256-bit SSL</span>
        <span className="text-slate-500">PCI DSS Compliant</span>
      </div>

      {/* Pay Button */}
      <button
        onClick={handlePayment}
        disabled={loading}
        className="btn-primary w-full py-4 text-lg font-semibold"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing Payment...
          </div>
        ) : (
          `Pay ₹${bookingData.amount}`
        )}
      </button>
    </div>
  );
}
