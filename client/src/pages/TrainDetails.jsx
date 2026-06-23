import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { processPayment } from '../utils/stripe';

export default function TrainDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [train, setTrain] = useState(null);
  const [selected, setSelected] = useState([]);
  const [selectedClass, setSelectedClass] = useState('1st_ac');
  const [loading, setLoading] = useState(true);
  const [payLoading, setPayLoading] = useState(false);

  useEffect(() => {
    api.get(`/trains/${id}`)
      .then(({ data }) => setTrain(data))
      .catch(() => setTrain(null))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleSeat = (seatNo) => {
    const s = train?.seats?.find((x) => x.seatNo === seatNo);
    if (s?.status !== 'available') return;
    setSelected((prev) => (prev.includes(seatNo) ? prev.filter((x) => x !== seatNo) : [...prev, seatNo]));
  };

  const getClassPrice = (className) => {
    // Ensure we have valid train data
    if (!train) return 0;
    
    // Get price with proper fallbacks
    const price = 
      className === '1st_ac' ? (train.firstAcPrice || train.pricePerSeat || 1500) :
      className === '2nd_ac' ? (train.secondAcPrice || train.pricePerSeat || 1000) :
      className === '3rd_ac' ? (train.thirdAcPrice || train.pricePerSeat || 700) :
      className === 'sleeper' ? (train.sleeperPrice || train.pricePerSeat || 300) :
      (train.pricePerSeat || 500);
    
    // Ensure we return a valid number
    return typeof price === 'number' && price > 0 ? price : 500;
  };

  const getAvailableSeats = (className) => {
    if (!train?.seats) return [];
    
    // Filter seats by class, but handle legacy seats without class
    return train.seats.filter(seat => {
      // For new seats with class information
      if (seat.class) {
        return seat.class === className && seat.status === 'available';
      }
      // For legacy seats without class, distribute them evenly
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
    console.log('handleBook called, user:', user);
    if (!user) {
      console.log('No user found, redirecting to auth');
      navigate('/auth', { state: { from: { pathname: `/trains/${id}` } } });
      return;
    }
    if (selected.length === 0) {
      alert('Please select at least one seat');
      return;
    }
    setPayLoading(true);
    try {
      console.log('Locking seats...');
      const { data } = await api.post('/bookings/lock-seats', { 
        type: 'train', 
        id, 
        seats: selected,
        seatClass: selectedClass 
      });
      console.log('Seats locked:', data);
      
      console.log('Creating payment order...');
      const orderRes = await api.post('/payment/create-order', { bookingId: data.booking._id });
      console.log('Order created:', orderRes.data);
      
      // Store booking data for payment page
      const bookingData = {
        bookingId: data.booking._id,
        amount: orderRes.data.amount / 100, // Convert from paise to rupees
        type: 'train',
        seats: selected,
        seatClass: selectedClass,
        sessionId: orderRes.data.sessionId
      };
      
      localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
      
      // Navigate to payment page
      navigate('/payment', { state: { bookingData } });
      
    } catch (e) {
      console.error('Booking error:', e);
      const errorMessage = e.response?.data?.message || e.message || 'Booking failed';
      alert(errorMessage);
      setPayLoading(false);
    }
  };

  if (loading || !train) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  const total = selected.length * getClassPrice(selectedClass);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <Link to="/trains" className="inline-flex items-center gap-1 text-slate-600 hover:text-primary-600 text-sm font-medium mb-6">
        ← Back to trains
      </Link>

      {/* Debug info - remove in production */}
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
        <strong>Debug Info:</strong><br/>
        User logged in: {user ? 'Yes' : 'No'}<br/>
        User email: {user?.email || 'N/A'}<br/>
        Token in localStorage: {localStorage.getItem('token') ? 'Yes' : 'No'}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <span className="text-4xl">🚂</span>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{train.name}</h1>
                <p className="text-slate-500">({train.trainNumber})</p>
                <p className="text-slate-700 mt-2 font-medium">{train.source} → {train.destination}</p>
                <p className="text-slate-500 text-sm mt-1">
                  {new Date(train.date).toLocaleDateString()} • {train.departureTime} – {train.arrivalTime}
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
                { value: '1st_ac', label: '1st AC', price: getClassPrice('1st_ac') },
                { value: '2nd_ac', label: '2nd AC', price: getClassPrice('2nd_ac') },
                { value: '3rd_ac', label: '3rd AC', price: getClassPrice('3rd_ac') },
                { value: 'sleeper', label: 'Sleeper', price: getClassPrice('sleeper') }
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
