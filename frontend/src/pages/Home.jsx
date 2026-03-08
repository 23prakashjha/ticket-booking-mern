import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const TABS = [
  { id: 'Train', icon: '', label: 'Train' },
  { id: 'Bus', icon: '', label: 'Bus' },
  { id: 'Flight', icon: '', label: 'Flight' },
];

const OFFERS = [
  { id: 1, title: '20% off Train Booking', description: 'Save big on your train journeys', code: 'TRAIN20', color: 'from-blue-500 to-blue-600' },
  { id: 2, title: 'Bus Cashback', description: 'Get ₹200 cashback on bus bookings', code: 'BUS200', color: 'from-green-500 to-green-600' },
  { id: 3, title: 'Flight Festival Discount', description: 'Special festival offers on flights', code: 'FLYFEST', color: 'from-purple-500 to-purple-600' },
  { id: 4, title: 'First Time User', description: 'Flat ₹100 off on first booking', code: 'FIRST100', color: 'from-orange-500 to-orange-600' },
];

const HOW_IT_WORKS = [
  { step: 1, title: 'Search Trip', desc: 'Enter your source, destination and travel date', icon: '' },
  { step: 2, title: 'Select Seat', desc: 'Choose your preferred seat and class', icon: '' },
  { step: 3, title: 'Pay Online', desc: 'Secure payment with multiple options', icon: '' },
  { step: 4, title: 'Get Ticket', desc: 'Receive your ticket instantly via email', icon: '' },
];

const TRAVEL_DESTINATIONS = [
  { name: 'Goa', image: '', description: 'Beaches and nightlife' },
  { name: 'Manali', image: '', description: 'Hill station adventure' },
];

const FEATURED_TRAINS = [
  { id: 1, name: 'Rajdhani Express', number: '12301', departure: '06:00', arrival: '22:30', price: 1850, from: 'Delhi', to: 'Mumbai' },
  { id: 2, name: 'Shatabdi Express', number: '12001', departure: '07:15', arrival: '14:45', price: 980, from: 'Bangalore', to: 'Chennai' },
  { id: 3, name: 'Duronto Express', number: '12223', departure: '23:00', arrival: '13:00', price: 1450, from: 'Kolkata', to: 'Delhi' },
  { id: 4, name: 'Garib Rath', number: '12909', departure: '16:30', arrival: '08:45', price: 650, from: 'Ahmedabad', to: 'Mumbai' },
];

const FEATURED_BUSES = [
  { id: 1, name: 'Volvo AC', type: 'AC Sleeper', departure: '08:00', arrival: '20:00', price: 1200, from: 'Delhi', to: 'Jaipur' },
  { id: 2, name: 'Scania Multi-Axle', type: 'AC Seater', departure: '09:30', arrival: '15:30', price: 800, from: 'Bangalore', to: 'Mysore' },
  { id: 3, name: 'Mercedes Benz', type: 'AC Semi-Sleeper', departure: '22:00', arrival: '06:00', price: 1500, from: 'Mumbai', to: 'Goa' },
  { id: 4, name: 'Ashok Leyland', type: 'Non-AC Seater', departure: '06:00', arrival: '12:00', price: 450, from: 'Chennai', to: 'Bangalore' },
];

const FEATURED_FLIGHTS = [
  { id: 1, airline: 'Indigo', logo: '', from: 'Delhi', to: 'Mumbai', duration: '2h 15m', price: 3999 },
  { id: 2, airline: 'Air India', logo: '', from: 'Bangalore', to: 'Delhi', duration: '2h 45m', price: 4999 },
  { id: 3, airline: 'SpiceJet', logo: '', from: 'Kolkata', to: 'Chennai', duration: '2h 30m', price: 2999 },
  { id: 4, airline: 'Vistara', logo: '', from: 'Mumbai', to: 'Goa', duration: '1h 15m', price: 2499 },
];

const WHY_CHOOSE_US = [
  { title: 'Easy Booking', desc: 'Book trains, buses and flights in one place with a few clicks.', icon: '', color: 'from-primary-500 to-teal-600' },
  { title: 'Secure Payment', desc: 'Pay with Stripe — safe, instant, and hassle-free.', icon: '', color: 'from-amber-500 to-orange-500' },
  { title: 'Fast Refund', desc: 'Get quick refunds when you cancel your bookings.', icon: '', color: 'from-emerald-500 to-green-600' },
  { title: '24/7 Support', desc: 'Our customer support team is always here to help.', icon: '', color: 'from-blue-500 to-indigo-600' },
  { title: 'Trusted Platform', desc: 'Over 1 million happy customers trust us.', icon: '', color: 'from-purple-500 to-pink-600' },
  { title: 'Best Prices', desc: 'Compare prices and get the best deals available.', icon: '', color: 'from-red-500 to-rose-600' },
  { name: 'Shimla', image: '🌲', description: 'Colonial charm' },
  { name: 'Ladakh', image: '🏔️', description: 'Mountain paradise' },
  { name: 'Jaipur', image: '🏰', description: 'Pink city heritage' },
  { name: 'Kerala', image: '🌴', description: 'Backwaters and nature' },
];

const TESTIMONIALS = [
  { id: 1, name: 'Rahul Sharma', rating: 5, comment: 'Very easy to book tickets! The interface is user-friendly and the process is smooth.', avatar: '👨' },
  { id: 2, name: 'Priya Patel', rating: 5, comment: 'Best travel booking platform! Got great deals and instant confirmation.', avatar: '👩' },
  { id: 3, name: 'Amit Kumar', rating: 5, comment: 'Excellent service and support. The refund process is very fast.', avatar: '👨‍💼' },
  { id: 4, name: 'Sneha Reddy', rating: 5, comment: 'Love the variety of options available. Found the best prices here.', avatar: '👩‍💼' },
  { id: 5, name: 'Vikram Singh', rating: 5, comment: 'Very reliable platform. Been using it for all my travel bookings.', avatar: '👨‍🎓' },
  { id: 6, name: 'Neha Gupta', rating: 5, comment: 'Great customer service! They helped me reschedule my flight easily.', avatar: '👩‍🎓' },
];

const TRAVEL_PACKAGES = [
  { id: 1, name: 'Delhi → Manali Package', duration: '5 Days 4 Nights', price: 12999, includes: ['Hotel', 'Transport', 'Sightseeing'] },
  { id: 2, name: 'Mumbai → Goa Package', duration: '3 Days 2 Nights', price: 8999, includes: ['Hotel', 'Transport', 'Beach Activities'] },
  { id: 3, name: 'Bangalore → Coorg Package', duration: '4 Days 3 Nights', price: 10999, includes: ['Hotel', 'Transport', 'Trekking'] },
  { id: 4, name: 'Chennai → Pondicherry Package', duration: '2 Days 1 Night', price: 5999, includes: ['Hotel', 'Transport', 'Heritage Tour'] },
];

const FAQS = [
  { q: 'How to cancel ticket?', a: 'Go to My Bookings section, select the ticket you want to cancel and click on cancel. Refund will be processed according to the cancellation policy.' },
  { q: 'What is the refund policy?', a: 'Refund depends on the cancellation time. Full refund if cancelled 48 hours before departure, 50% if cancelled 24 hours before, no refund if cancelled less than 24 hours before.' },
  { q: 'How to check PNR status?', a: 'Go to PNR Status page, enter your PNR number and click on check status. You will get real-time updates about your booking.' },
  { q: 'Are there any hidden charges?', a: 'No, we believe in transparent pricing. The price you see is the price you pay. Only applicable taxes and service charges are included.' },
  { q: 'Can I reschedule my booking?', a: 'Yes, you can reschedule your booking by paying the difference in fare (if any) and a nominal rescheduling fee.' },
  { q: 'What payment methods are accepted?', a: 'We accept all major credit/debit cards, UPI, net banking, and popular wallets like Paytm, PhonePe, and Amazon Pay.' },
];

const POPULAR_AIRLINES = [
  { name: 'Indigo', logo: '🛩️' },
  { name: 'Air India', logo: '✈️' },
  { name: 'SpiceJet', logo: '🛫' },
  { name: 'Vistara', logo: '🛩️' },
  { name: 'GoAir', logo: '✈️' },
  { name: 'AirAsia', logo: '🛫' },
];

const PAYMENT_METHODS = [
  { name: 'Stripe', icon: '💳' },
  { name: 'UPI', icon: '📱' },
  { name: 'Visa', icon: '💳' },
  { name: 'Mastercard', icon: '💳' },
  { name: 'NetBanking', icon: '🏦' },
  { name: 'Paytm', icon: '📱' },
];



export default function Home() {
  const [tab, setTab] = useState('Train');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [email, setEmail] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [stats, setStats] = useState({ tickets: 0, routes: 0, vehicles: 0, users: 0 });
  const [trains, setTrains] = useState([]);
  const [buses, setBuses] = useState([]);
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch real data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [trainsRes, busesRes, flightsRes] = await Promise.all([
          api.get('/trains'),
          api.get('/buses'),
          api.get('/flights')
        ]);
        
        setTrains(trainsRes.data.slice(0, 4)); // Show first 4 trains
        setBuses(busesRes.data.slice(0, 4)); // Show first 4 buses
        setFlights(flightsRes.data.slice(0, 4)); // Show first 4 flights
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const animateStats = () => {
      const targets = { tickets: 10000000, routes: 500, vehicles: 1000, users: 1000000 };
      const durations = { tickets: 2000, routes: 1500, vehicles: 1800, users: 2200 };
      
      Object.keys(targets).forEach(key => {
        let start = 0;
        const increment = targets[key] / (durations[key] / 50);
        const timer = setInterval(() => {
          start += increment;
          if (start >= targets[key]) {
            start = targets[key];
            clearInterval(timer);
          }
          setStats(prev => ({ ...prev, [key]: Math.floor(start) }));
        }, 50);
      });
    };
    animateStats();
  }, []);

  const base = tab.toLowerCase() + 's';
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (source) params.set('source', source);
    if (destination) params.set('destination', destination);
    if (date) params.set('date', date);
    navigate(`/${base}?${params.toString()}`);
  };

  const handleNewsletter = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing with email: ${email}`);
    setEmail('');
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K+`;
    return num.toString();
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-[90vh] md:min-h-[85vh] flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-700 via-primary-600 to-teal-800" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.06\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-50 to-transparent" />

        <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-12 pb-24 md:pb-32">
          <div className="text-center md:text-left max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white/95 text-sm font-semibold mb-6 backdrop-blur-sm">
              One platform. Every journey.
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight">
              Book Train, Bus & Flight Tickets in One Place
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-teal-100 max-w-xl">
              Search, compare and book with secure payments. Your next trip starts here.
            </p>
          </div>

          {/* Search card */}
          <div className="mt-10 md:mt-14 max-w-4xl mx-auto animate-slide-up">
            <div className="card shadow-xl p-4 sm:p-6 md:p-8">
              <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-5 mb-5">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTab(t.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      tab === t.id
                        ? 'bg-primary-600 text-white shadow-md'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                    }`}
                  >
                    <span className="text-lg">{t.icon}</span>
                    {t.label}
                  </button>
                ))}
              </div>
              <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
                <div className="lg:col-span-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">From</label>
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => setSource(e.target.value)}
                    placeholder="City or station"
                    className="input-field"
                  />
                </div>
                <div className="lg:col-span-4">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">To</label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="City or station"
                    className="input-field"
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field" />
                </div>
                <div className="lg:col-span-2">
                  <button type="submit" className="btn-primary w-full py-3">
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Trains */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <h2 className="section-title mb-8">Featured Trains</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card-hover p-6 border border-slate-200 rounded-xl animate-pulse">
                <div className="h-4 bg-slate-200 rounded mb-4"></div>
                <div className="h-3 bg-slate-200 rounded mb-2"></div>
                <div className="h-3 bg-slate-200 rounded"></div>
              </div>
            ))
          ) : (
            trains.map((train) => (
              <div key={train._id} className="card-hover p-6 border border-slate-200 rounded-xl">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{train.name}</h3>
                    <p className="text-slate-500 text-sm">#{train.trainNumber}</p>
                  </div>
                  <span className="text-2xl">🚂</span>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">From</span>
                    <span className="font-medium text-slate-900">{train.source}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">To</span>
                    <span className="font-medium text-slate-900">{train.destination}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Departure</span>
                    <span className="font-medium text-slate-900">{train.departureTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Arrival</span>
                    <span className="font-medium text-slate-900">{train.arrivalTime}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-2xl font-bold text-primary-600">₹{train.firstAcPrice || train.pricePerSeat}</span>
                    <p className="text-xs text-slate-500">per seat</p>
                  </div>
                  <Link 
                    to={`/trains/${train._id}`}
                    className="btn-primary text-sm px-4 py-2"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Featured Buses */}
      <section className="bg-slate-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-8">Featured Buses</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card-hover p-6 border border-slate-200 rounded-xl animate-pulse">
                  <div className="h-4 bg-slate-200 rounded mb-4"></div>
                  <div className="h-3 bg-slate-200 rounded mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded"></div>
                </div>
              ))
            ) : (
              buses.map((bus) => (
                <div key={bus._id} className="card-hover p-6 border border-slate-200 rounded-xl">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{bus.name}</h3>
                      <p className="text-slate-500 text-sm">#{bus.busNumber}</p>
                    </div>
                    <span className="text-2xl">🚌</span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">From</span>
                      <span className="font-medium text-slate-900">{bus.source}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">To</span>
                      <span className="font-medium text-slate-900">{bus.destination}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Departure</span>
                      <span className="font-medium text-slate-900">{bus.departureTime}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Arrival</span>
                      <span className="font-medium text-slate-900">{bus.arrivalTime}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <div>
                      <span className="text-2xl font-bold text-primary-600">₹{bus.sleeperPrice || bus.pricePerSeat}</span>
                      <p className="text-xs text-slate-500">per seat</p>
                    </div>
                    <Link 
                      to={`/buses/${bus._id}`}
                      className="btn-primary py-2 px-4 text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Flights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <h2 className="section-title mb-8">Featured Flights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
              // Loading skeleton
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card-hover p-6 border border-slate-200 rounded-xl animate-pulse">
                  <div className="h-4 bg-slate-200 rounded mb-4"></div>
                  <div className="h-3 bg-slate-200 rounded mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded"></div>
                </div>
              ))
            ) : (
              flights.map((flight) => (
                <div key={flight._id} className="card-hover p-6 border border-slate-200 rounded-xl">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{flight.name}</h3>
                      <p className="text-slate-500 text-sm">#{flight.flightNumber}</p>
                    </div>
                    <span className="text-2xl">✈️</span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Route</span>
                      <span className="font-medium text-slate-900">{flight.source} → {flight.destination}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Duration</span>
                      <span className="font-medium text-slate-900">{flight.departureTime} - {flight.arrivalTime}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                    <div>
                      <span className="text-2xl font-bold text-primary-600">₹{flight.economyPrice || flight.pricePerSeat}</span>
                      <p className="text-xs text-slate-500">per seat</p>
                    </div>
                    <Link 
                      to={`/flights/${flight._id}`}
                      className="btn-primary py-2 px-4 text-sm"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))
            )}
        </div>
      </section>

      {/* Offers & Discounts */}
      <section className="bg-gradient-to-r from-purple-50 to-blue-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-8">Offers & Discounts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {OFFERS.map((offer) => (
              <div key={offer.id} className={`card-hover p-6 rounded-xl bg-gradient-to-br ${offer.color} text-white`}>
                <h3 className="font-bold text-lg mb-2">{offer.title}</h3>
                <p className="text-sm mb-4 opacity-90">{offer.description}</p>
                <div className="flex justify-between items-center">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">{offer.code}</span>
                  <button className="bg-white text-slate-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors">
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-4">Why Choose Us</h2>
          <p className="text-slate-600 text-center max-w-xl mx-auto mb-12">
            We make travel booking simple, secure, and fast.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {WHY_CHOOSE_US.map((feature) => (
              <div key={feature.title} className="card p-8 text-center hover:shadow-card-hover transition-shadow duration-300">
                <div className={`inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} text-white text-2xl items-center justify-center mb-5 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-slate-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className="text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {step.step}
                  </div>
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-lg">
                    {step.icon}
                  </div>
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{step.title}</h3>
                <p className="text-slate-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Travel Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <h2 className="section-title mb-8">Travel Destinations</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {TRAVEL_DESTINATIONS.map((destination) => (
            <div key={destination.name} className="text-center group cursor-pointer">
              <div className="w-24 h-24 mx-auto mb-3 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                {destination.image}
              </div>
              <h3 className="font-bold text-slate-900">{destination.name}</h3>
              <p className="text-slate-500 text-sm">{destination.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* App Promotion */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Book on the Go</h2>
            <p className="text-xl mb-8 opacity-90">Download our mobile app for exclusive deals and faster booking</p>
            <div className="flex justify-center gap-4">
              <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-slate-800 transition-colors">
                <span className="text-xl">📱</span>
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </button>
              <button className="bg-black text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-slate-800 transition-colors">
                <span className="text-xl">🤖</span>
                <div className="text-left">
                  <div className="text-xs">Get it on</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* User Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <h2 className="section-title text-center mb-12">User Testimonials</h2>
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 text-center">
            <div className="text-6xl mb-4">{TESTIMONIALS[currentTestimonial].avatar}</div>
            <div className="flex justify-center mb-4">
              {[...Array(TESTIMONIALS[currentTestimonial].rating)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-xl">⭐</span>
              ))}
            </div>
            <p className="text-lg text-slate-600 mb-4 italic">"{TESTIMONIALS[currentTestimonial].comment}"</p>
            <h4 className="font-bold text-slate-900">{TESTIMONIALS[currentTestimonial].name}</h4>
            <div className="flex justify-center mt-6 gap-2">
              {TESTIMONIALS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentTestimonial ? 'bg-primary-600' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Travel Statistics */}
      <section className="bg-slate-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                {formatNumber(stats.tickets)}
              </div>
              <p className="text-slate-600">Tickets Booked</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                {formatNumber(stats.routes)}
              </div>
              <p className="text-slate-600">Routes</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                {formatNumber(stats.vehicles)}
              </div>
              <p className="text-slate-600">Vehicles</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">
                {formatNumber(stats.users)}
              </div>
              <p className="text-slate-600">Happy Users</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="section-title mb-4">Stay Updated</h2>
          <p className="text-slate-600 mb-8">Subscribe to our newsletter for exclusive deals and travel tips</p>
          <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            />
            <button type="submit" className="btn-primary px-6 py-3">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Travel Packages */}
      <section className="bg-slate-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-8">Travel Packages</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRAVEL_PACKAGES.map((pkg) => (
              <div key={pkg.id} className="card-hover p-6 border border-slate-200 rounded-xl">
                <h3 className="font-bold text-lg text-slate-900 mb-2">{pkg.name}</h3>
                <p className="text-slate-500 text-sm mb-4">{pkg.duration}</p>
                <div className="mb-4">
                  <span className="text-xs text-slate-500">Includes:</span>
                  <ul className="text-sm text-slate-600 mt-1">
                    {pkg.includes.map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                  <span className="text-2xl font-bold text-primary-600">₹{pkg.price}</span>
                  <button className="btn-primary py-2 px-4 text-sm">Book Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Deals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <h2 className="section-title mb-8">Latest Deals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card-hover p-6 border border-slate-200 rounded-xl text-center">
            <span className="text-4xl mb-4 block">✈️</span>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Flight Deals</h3>
            <p className="text-3xl font-bold text-primary-600 mb-4">Starting ₹1999</p>
            <button className="btn-primary py-2 px-6">View Deals</button>
          </div>
          <div className="card-hover p-6 border border-slate-200 rounded-xl text-center">
            <span className="text-4xl mb-4 block">🚌</span>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Bus Offers</h3>
            <p className="text-3xl font-bold text-primary-600 mb-4">Starting ₹499</p>
            <button className="btn-primary py-2 px-6">View Deals</button>
          </div>
          <div className="card-hover p-6 border border-slate-200 rounded-xl text-center">
            <span className="text-4xl mb-4 block">🚂</span>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Train Special</h3>
            <p className="text-3xl font-bold text-primary-600 mb-4">Starting ₹399</p>
            <button className="btn-primary py-2 px-6">View Deals</button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-slate-50 py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div key={index} className="card border border-slate-200 rounded-xl">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-slate-50 transition-colors"
                >
                  <span className="font-semibold text-slate-900">{faq.q}</span>
                  <span className="text-slate-400">
                    {expandedFaq === index ? '−' : '+'}
                  </span>
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4 text-slate-600">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <h2 className="section-title text-center mb-12">Need Help? We're Here for You</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="card p-6">
            <span className="text-4xl mb-4 block">💬</span>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Chat Support</h3>
            <p className="text-slate-600 mb-4">Get instant help from our support team</p>
            <button className="btn-primary py-2 px-6">Start Chat</button>
          </div>
          <div className="card p-6">
            <span className="text-4xl mb-4 block">📧</span>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Email Support</h3>
            <p className="text-slate-600 mb-4">support@booktrip.com</p>
            <button className="btn-primary py-2 px-6">Send Email</button>
          </div>
          <div className="card p-6">
            <span className="text-4xl mb-4 block">📞</span>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Phone Support</h3>
            <p className="text-slate-600 mb-4">1800-123-4567</p>
            <button className="btn-primary py-2 px-6">Call Now</button>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-slate-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-8">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Link to="/trains" className="card-hover p-4 text-center border border-slate-200 rounded-lg">
              <span className="text-2xl mb-2 block">🚂</span>
              <span className="text-sm font-medium">Book Train</span>
            </Link>
            <Link to="/buses" className="card-hover p-4 text-center border border-slate-200 rounded-lg">
              <span className="text-2xl mb-2 block">🚌</span>
              <span className="text-sm font-medium">Book Bus</span>
            </Link>
            <Link to="/flights" className="card-hover p-4 text-center border border-slate-200 rounded-lg">
              <span className="text-2xl mb-2 block">✈️</span>
              <span className="text-sm font-medium">Book Flight</span>
            </Link>
            <Link to="/pnr-status" className="card-hover p-4 text-center border border-slate-200 rounded-lg">
              <span className="text-2xl mb-2 block">🎫</span>
              <span className="text-sm font-medium">Check PNR</span>
            </Link>
            <Link to="/live-train-status" className="card-hover p-4 text-center border border-slate-200 rounded-lg">
              <span className="text-2xl mb-2 block">📍</span>
              <span className="text-sm font-medium">Live Status</span>
            </Link>
            <Link to="/my-bookings" className="card-hover p-4 text-center border border-slate-200 rounded-lg">
              <span className="text-2xl mb-2 block">📋</span>
              <span className="text-sm font-medium">My Bookings</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Travel Tips */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <h2 className="section-title mb-8">Travel Tips</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card p-6 border-l-4 border-blue-500">
            <h3 className="font-bold text-lg text-slate-900 mb-2">Book Early</h3>
            <p className="text-slate-600">Save money by booking your tickets in advance. Early bird discounts available on most routes.</p>
          </div>
          <div className="card p-6 border-l-4 border-green-500">
            <h3 className="font-bold text-lg text-slate-900 mb-2">Travel Light</h3>
            <p className="text-slate-600">Pack smart and travel light. Check baggage allowance before you travel to avoid extra charges.</p>
          </div>
          <div className="card p-6 border-l-4 border-purple-500">
            <h3 className="font-bold text-lg text-slate-900 mb-2">Check Weather</h3>
            <p className="text-slate-600">Always check weather conditions before traveling. Pack accordingly for a comfortable journey.</p>
          </div>
        </div>
      </section>

      {/* Popular Airlines */}
      <section className="bg-slate-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-8">Popular Airlines</h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {POPULAR_AIRLINES.map((airline) => (
              <div key={airline.name} className="card-hover p-6 text-center border border-slate-200 rounded-xl">
                <span className="text-4xl mb-2 block">{airline.logo}</span>
                <span className="text-sm font-medium text-slate-600">{airline.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <h2 className="section-title mb-8">Payment Methods</h2>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
          {PAYMENT_METHODS.map((method) => (
            <div key={method.name} className="card-hover p-6 text-center border border-slate-200 rounded-xl">
              <span className="text-4xl mb-2 block">{method.icon}</span>
              <span className="text-sm font-medium text-slate-600">{method.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Security Section */}
      <section className="bg-slate-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-8">Security & Trust</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="card p-6">
              <span className="text-4xl mb-4 block">🔒</span>
              <h3 className="font-bold text-lg text-slate-900 mb-2">SSL Secure</h3>
              <p className="text-slate-600">256-bit SSL encryption for all transactions</p>
            </div>
            <div className="card p-6">
              <span className="text-4xl mb-4 block">💳</span>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Safe Payment</h3>
              <p className="text-slate-600">PCI DSS compliant payment gateway</p>
            </div>
            <div className="card p-6">
              <span className="text-4xl mb-4 block">✅</span>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Verified Platform</h3>
              <p className="text-slate-600">Government approved travel booking platform</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="relative rounded-3xl bg-gradient-to-r from-primary-600 to-primary-800 p-8 md:p-12 lg:p-16 overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.08\'%3E%3Cpath d=\'M0 0h40v40H0z\'/%3E%3C/g%3E%3C/svg%3E')]" />
          <div className="relative text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">Ready to travel?</h2>
            <p className="text-teal-100 text-lg mb-8 max-w-md mx-auto">
              Login to book seats and manage your bookings in one place.
            </p>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-primary-700 bg-white hover:bg-slate-50 shadow-lg hover:shadow-xl transition-all"
            >
              Login or Register
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
