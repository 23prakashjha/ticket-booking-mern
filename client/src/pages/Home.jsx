import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const TABS = [
  { id: 'Train', icon: '🚂', label: 'Train' },
  { id: 'Bus', icon: '🚌', label: 'Bus' },
  { id: 'Flight', icon: '✈️', label: 'Flight' },
  { id: 'Hotel', icon: '🏨', label: 'Hotel' },
  { id: 'Place', icon: '📍', label: 'Places' },
];

const OFFERS = [
  { id: 1, title: '20% off Train Booking', description: 'Save big on your train journeys', code: 'TRAIN20', color: 'from-blue-500 to-blue-600' },
  { id: 2, title: 'Bus Cashback', description: 'Get ₹200 cashback on bus bookings', code: 'BUS200', color: 'from-green-500 to-green-600' },
  { id: 3, title: 'Flight Festival Discount', description: 'Special festival offers on flights', code: 'FLYFEST', color: 'from-purple-500 to-purple-600' },
  { id: 4, title: 'First Time User', description: 'Flat ₹100 off on first booking', code: 'FIRST100', color: 'from-orange-500 to-orange-600' },
];

const HOW_IT_WORKS = [
  { step: 1, title: 'Search Trip', desc: 'Enter your source, destination and travel date', icon: '🔍' },
  { step: 2, title: 'Select Seat', desc: 'Choose your preferred seat and class', icon: '💺' },
  { step: 3, title: 'Pay Online', desc: 'Secure payment with multiple options', icon: '💳' },
  { step: 4, title: 'Get Ticket', desc: 'Receive your ticket instantly via email', icon: '🎫' },
];

const DESTINATIONS = [
  { name: 'Goa', emoji: '🏖️', description: 'Beaches & nightlife' },
  { name: 'Manali', emoji: '🏔️', description: 'Mountain adventure' },
  { name: 'Shimla', emoji: '🌲', description: 'Colonial charm' },
  { name: 'Ladakh', emoji: '🏔️', description: 'Mountain paradise' },
  { name: 'Jaipur', emoji: '🏰', description: 'Pink city heritage' },
  { name: 'Kerala', emoji: '🌴', description: 'Backwaters & nature' },
];

const WHY_CHOOSE_US = [
  { title: 'Easy Booking', desc: 'Book trains, buses and flights in one place with a few clicks.', icon: '⚡', color: 'from-primary-500 to-teal-600' },
  { title: 'Secure Payment', desc: 'Pay with Razorpay — safe, instant, and hassle-free.', icon: '🔒', color: 'from-amber-500 to-orange-500' },
  { title: 'Fast Refund', desc: 'Get quick refunds when you cancel your bookings.', icon: '💰', color: 'from-emerald-500 to-green-600' },
  { title: '24/7 Support', desc: 'Our customer support team is always here to help.', icon: '🎧', color: 'from-blue-500 to-indigo-600' },
  { title: 'Trusted Platform', desc: 'Over 1 million happy customers trust us.', icon: '⭐', color: 'from-purple-500 to-pink-600' },
  { title: 'Best Prices', desc: 'Compare prices and get the best deals available.', icon: '🏷️', color: 'from-red-500 to-rose-600' },
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

function AnimatedSection({ children, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } }, { threshold: 0.08 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} ${className}`}>
      {children}
    </div>
  );
}

function FloatingShape({ className, children }) {
  return <div className={`absolute pointer-events-none ${className}`}>{children}</div>;
}

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
  const [hotels, setHotels] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [trainsRes, busesRes, flightsRes, hotelsRes, placesRes] = await Promise.all([
          api.get('/trains'), api.get('/buses'), api.get('/flights'), api.get('/hotels'), api.get('/places')
        ]);
        setTrains(trainsRes.data.slice(0, 4));
        setBuses(busesRes.data.slice(0, 4));
        setFlights(flightsRes.data.slice(0, 4));
        setHotels(hotelsRes.data.slice(0, 4));
        setPlaces(placesRes.data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length), 5000);
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
          if (start >= targets[key]) { start = targets[key]; clearInterval(timer); }
          setStats(prev => ({ ...prev, [key]: Math.floor(start) }));
        }, 50);
      });
    };
    animateStats();
  }, []);

  const base = tab === 'Hotel' ? 'hotels' : tab === 'Place' ? 'places' : tab.toLowerCase() + 's';
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (tab === 'Hotel') {
      if (source) params.set('city', source);
    } else if (tab === 'Place') {
      if (source) params.set('city', source);
    } else {
      if (source) params.set('source', source);
      if (destination) params.set('destination', destination);
      if (date) params.set('date', date);
    }
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

  const switchTab = useCallback((id) => setTab(id), []);

  return (
    <div>
      {/* ───── HERO ───── */}
      <section className="relative min-h-[90vh] md:min-h-[85vh] flex flex-col justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-primary-900 to-teal-900" />
        <div className="absolute inset-0 bg-mesh-pattern opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent" />

        {/* Floating geometric shapes */}
        <FloatingShape className="top-20 left-10 w-32 h-32 rounded-full bg-white/5 blur-xl animate-float hidden md:block" />
        <FloatingShape className="top-40 right-20 w-48 h-48 rounded-full bg-teal-400/5 blur-2xl animate-float-slow hidden lg:block" />
        <FloatingShape className="bottom-40 left-1/4 w-24 h-24 rounded-full bg-primary-400/5 blur-xl animate-float-slower hidden md:block" />
        <FloatingShape className="top-1/3 right-1/3 w-16 h-16 border border-white/10 rounded-xl rotate-45 animate-spin-slow hidden lg:block" />
        <FloatingShape className="bottom-60 right-10 w-20 h-20 border border-teal-400/20 rounded-full animate-float hidden lg:block" />
        <FloatingShape className="top-60 left-1/3 w-12 h-12 bg-white/5 rounded-lg rotate-12 animate-float-slow hidden lg:block" />

        {/* Animated dots grid */}
        <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-16 pb-24 md:pb-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-6 backdrop-blur-sm border border-white/10 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping-slow" />
              One platform. Every journey.
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] tracking-tight animate-slide-up">
              Book <span className="text-gradient-hero">Train, Bus</span>,{' '}
              <span className="text-gradient-hero">Flight</span> &{' '}
              <span className="text-gradient-hero">Hotel</span> &{' '}
              <span className="text-gradient-hero">Places</span>
            </h1>
            <p className="mt-5 text-lg sm:text-xl text-teal-100/80 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Search, compare and book with secure payments. Your next trip starts here — in just a few clicks.
            </p>
          </div>

          {/* Search card */}
          <div ref={searchRef} className="mt-10 md:mt-14 max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-teal-400 to-primary-500 rounded-3xl blur-lg opacity-30 animate-pulse-glow" />
              <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 md:p-8">
                <div className="flex flex-wrap gap-2 border-b border-slate-200/80 pb-5 mb-5">
                  {TABS.map((t, i) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => switchTab(t.id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                        tab === t.id
                          ? 'bg-primary-600 text-white shadow-md shadow-primary-600/20 scale-105'
                          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                      }`}
                      style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                    >
                      <span className="text-lg">{t.icon}</span>
                      {t.label}
                    </button>
                  ))}
                </div>
                <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
                  {tab === 'Hotel' || tab === 'Place' ? (
                    <div className="lg:col-span-10">
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">City</label>
                      <div className="input-icon">
                        <span className="icon text-lg">📍</span>
                        <input
                          type="text"
                          value={source}
                          onChange={(e) => setSource(e.target.value)}
                          placeholder="Search by city..."
                          className="input-field"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="lg:col-span-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">From</label>
                        <div className="input-icon">
                          <svg className="icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <input
                            type="text"
                            value={source}
                            onChange={(e) => setSource(e.target.value)}
                            placeholder="City or station"
                            className="input-field"
                          />
                        </div>
                      </div>
                      <div className="lg:col-span-4">
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">To</label>
                        <div className="input-icon">
                          <svg className="icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                          <input
                            type="text"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            placeholder="City or station"
                            className="input-field"
                          />
                        </div>
                      </div>
                      <div className="lg:col-span-2">
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date</label>
                        <div className="input-icon">
                          <svg className="icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field [color-scheme:light]" />
                        </div>
                      </div>
                    </>
                  )}
                  <div className="lg:col-span-2">
                    <button type="submit" className="btn-primary w-full py-3.5 text-base shadow-lg shadow-primary-600/20 hover:shadow-xl hover:shadow-primary-600/30 transition-all">
                      <span className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Search
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── FEATURED TRAINS ───── */}
      <AnimatedSection>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Featured Trains</h2>
            <Link to="/trains" className="btn-ghost text-primary-600 hover:text-primary-700 gap-1">
              View all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-6 animate-pulse">
                  <div className="skeleton h-5 w-32 mb-4" />
                  <div className="skeleton h-3 w-20 mb-3" />
                  <div className="space-y-2 mb-4">
                    <div className="skeleton h-3 w-full" />
                    <div className="skeleton h-3 w-3/4" />
                  </div>
                  <div className="skeleton h-10 w-full mt-4" />
                </div>
              ))
            ) : (
              trains.map((train) => (
                <div key={train._id} className="group bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover hover:border-primary-200 transition-all duration-300 p-6 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-2xl shadow-md flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      🚂
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">Train</span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary-600 transition-colors">{train.name}</h3>
                  <p className="text-slate-500 text-sm mb-4">#{train.trainNumber}</p>
                  <div className="space-y-2.5 mb-4 flex-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">From</span>
                      <span className="font-semibold text-slate-800">{train.source}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">To</span>
                      <span className="font-semibold text-slate-800">{train.destination}</span>
                    </div>
                    <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {train.departureTime}
                      </span>
                      <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                        {train.arrivalTime}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      <span className="text-2xl font-bold text-primary-600">₹{train.firstAcPrice || train.pricePerSeat}</span>
                      <p className="text-xs text-slate-400">per seat</p>
                    </div>
                    <Link to={`/trains/${train._id}`} className="btn-primary text-sm px-5 py-2.5">
                      Book Now
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </AnimatedSection>

      {/* ───── FEATURED BUSES ───── */}
      <AnimatedSection>
        <section className="bg-gradient-to-b from-slate-50 to-white py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="section-title">Featured Buses</h2>
              <Link to="/buses" className="btn-ghost text-primary-600 hover:text-primary-700 gap-1">
                View all
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-6 animate-pulse">
                    <div className="skeleton h-5 w-32 mb-4" />
                    <div className="skeleton h-3 w-20 mb-3" />
                    <div className="space-y-2 mb-4"><div className="skeleton h-3 w-full" /><div className="skeleton h-3 w-3/4" /></div>
                    <div className="skeleton h-10 w-full mt-4" />
                  </div>
                ))
              ) : (
                buses.map((bus) => (
                  <div key={bus._id} className="group bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover hover:border-primary-200 transition-all duration-300 p-6 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform">
                        🚌
                      </div>
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Bus</span>
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary-600 transition-colors">{bus.name}</h3>
                    <p className="text-slate-500 text-sm mb-4">#{bus.busNumber}</p>
                    <div className="space-y-2.5 mb-4 flex-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">From</span>
                        <span className="font-semibold text-slate-800">{bus.source}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">To</span>
                        <span className="font-semibold text-slate-800">{bus.destination}</span>
                      </div>
                      <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {bus.departureTime}
                        </span>
                        <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                          {bus.arrivalTime}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div>
                        <span className="text-2xl font-bold text-primary-600">₹{bus.sleeperPrice || bus.pricePerSeat}</span>
                        <p className="text-xs text-slate-400">per seat</p>
                      </div>
                      <Link to={`/buses/${bus._id}`} className="btn-primary text-sm px-5 py-2.5">
                        Book Now
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ───── FEATURED FLIGHTS ───── */}
      <AnimatedSection>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Featured Flights</h2>
            <Link to="/flights" className="btn-ghost text-primary-600 hover:text-primary-700 gap-1">
              View all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-6 animate-pulse">
                  <div className="skeleton h-5 w-32 mb-4" />
                  <div className="skeleton h-3 w-20 mb-3" />
                  <div className="space-y-2 mb-4"><div className="skeleton h-3 w-full" /><div className="skeleton h-3 w-3/4" /></div>
                  <div className="skeleton h-10 w-full mt-4" />
                </div>
              ))
            ) : (
              flights.map((flight) => (
                <div key={flight._id} className="group bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover hover:border-primary-200 transition-all duration-300 p-6 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform">
                      ✈️
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">Flight</span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary-600 transition-colors">{flight.name}</h3>
                  <p className="text-slate-500 text-sm mb-4">#{flight.flightNumber}</p>
                  <div className="space-y-2.5 mb-4 flex-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Route</span>
                      <span className="font-semibold text-slate-800">{flight.source} → {flight.destination}</span>
                    </div>
                    <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {flight.departureTime}
                      </span>
                      <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg>
                        {flight.arrivalTime}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      <span className="text-2xl font-bold text-primary-600">₹{flight.economyPrice || flight.pricePerSeat}</span>
                      <p className="text-xs text-slate-400">per seat</p>
                    </div>
                    <Link to={`/flights/${flight._id}`} className="btn-primary text-sm px-5 py-2.5">
                      Book Now
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </AnimatedSection>

      {/* ───── FEATURED HOTELS ───── */}
      <AnimatedSection>
        <section className="bg-gradient-to-b from-slate-50 to-white py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="section-title">Featured Hotels</h2>
              <Link to="/hotels" className="btn-ghost text-primary-600 hover:text-primary-700 gap-1">
                View all
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-6 animate-pulse">
                    <div className="skeleton h-5 w-32 mb-4" />
                    <div className="skeleton h-3 w-20 mb-3" />
                    <div className="space-y-2 mb-4"><div className="skeleton h-3 w-full" /><div className="skeleton h-3 w-3/4" /></div>
                    <div className="skeleton h-10 w-full mt-4" />
                  </div>
                ))
              ) : (
                hotels.map((hotel) => (
                  <div key={hotel._id} className="group bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover hover:border-primary-200 transition-all duration-300 p-6 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform">
                        🏨
                      </div>
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Hotel</span>
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary-600 transition-colors">{hotel.name}</h3>
                    <p className="text-slate-500 text-sm mb-4">{hotel.city} · {hotel.location}</p>
                    <div className="space-y-2.5 mb-4 flex-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500">Rating</span>
                        <span className="font-semibold text-slate-800">⭐ {hotel.rating}</span>
                      </div>
                      {hotel.amenities?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {hotel.amenities.slice(0, 3).map((a, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{a}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <div>
                        <span className="text-2xl font-bold text-primary-600">₹{hotel.singlePrice || 1500}</span>
                        <p className="text-xs text-slate-400">per night</p>
                      </div>
                      <Link to={`/hotels/${hotel._id}`} className="btn-primary text-sm px-5 py-2.5">
                        Book Now
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ───── FEATURED PLACES ───── */}
      <AnimatedSection>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Popular Places</h2>
            <Link to="/places" className="btn-ghost text-primary-600 hover:text-primary-700 gap-1">
              View all
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200/80 p-6 animate-pulse">
                  <div className="skeleton h-5 w-32 mb-4" />
                  <div className="skeleton h-3 w-20 mb-3" />
                  <div className="space-y-2 mb-4"><div className="skeleton h-3 w-full" /><div className="skeleton h-3 w-3/4" /></div>
                  <div className="skeleton h-10 w-full mt-4" />
                </div>
              ))
            ) : (
              places.map((place) => (
                <div key={place._id} className="group bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover hover:border-primary-200 transition-all duration-300 p-6 flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform">
                      {place.image || '🏛️'}
                    </div>
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">Place</span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary-600 transition-colors">{place.name}</h3>
                  <p className="text-slate-500 text-sm mb-4">{place.city}{place.state ? `, ${place.state}` : ''}</p>
                  <div className="space-y-2.5 mb-4 flex-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Rating</span>
                      <span className="font-semibold text-slate-800">⭐ {place.rating}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-500">Timing</span>
                      <span className="font-semibold text-slate-800">{place.openingTime} - {place.closingTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <div>
                      <span className="text-2xl font-bold text-primary-600">₹{place.entryFee || 100}</span>
                      <p className="text-xs text-slate-400">per adult</p>
                    </div>
                    <Link to={`/places/${place._id}`} className="btn-primary text-sm px-5 py-2.5">
                      Book Now
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </AnimatedSection>

      {/* ───── OFFERS ───── */}
      <AnimatedSection>
        <section className="bg-gradient-to-r from-purple-50 via-blue-50 to-teal-50 py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-title text-center mb-3">Offers & Discounts</h2>
            <p className="section-subtitle">Exclusive deals to make your travel more affordable</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
              {OFFERS.map((offer) => (
                <div key={offer.id} className={`relative rounded-2xl bg-gradient-to-br ${offer.color} p-6 text-white overflow-hidden group cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300`}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                  <div className="relative">
                    <h3 className="font-bold text-lg mb-1.5">{offer.title}</h3>
                    <p className="text-sm opacity-90 mb-4">{offer.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-mono font-bold tracking-wider">{offer.code}</span>
                      <button className="bg-white text-slate-800 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-all shadow-md hover:shadow-lg active:scale-95">
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ───── WHY CHOOSE US ───── */}
      <AnimatedSection>
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-title text-center mb-3">Why Choose Us</h2>
            <p className="section-subtitle">We make travel booking simple, secure, and fast.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mt-12">
              {WHY_CHOOSE_US.map((feature) => (
                <div key={feature.title} className="group bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover p-8 text-center transition-all duration-300 hover:-translate-y-1">
                  <div className={`inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} text-white text-2xl items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-xl text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ───── HOW IT WORKS ───── */}
      <AnimatedSection>
        <section className="bg-gradient-to-b from-white to-slate-50 py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-title text-center mb-3">How It Works</h2>
            <p className="section-subtitle">Book your ticket in four simple steps</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
              {HOW_IT_WORKS.map((step) => (
                <div key={step.step} className="text-center group">
                  <div className="relative mb-6 inline-block">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300">
                      {step.icon}
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-400 text-white text-sm font-bold flex items-center justify-center shadow-md">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ───── DESTINATIONS ───── */}
      <AnimatedSection>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <h2 className="section-title text-center mb-3">Popular Destinations</h2>
          <p className="section-subtitle">Explore India's most loved destinations</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mt-10">
            {DESTINATIONS.map((d) => (
              <div key={d.name} className="group bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover p-6 text-center cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-primary-200">
                <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                  {d.emoji}
                </div>
                <h3 className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{d.name}</h3>
                <p className="text-slate-400 text-xs mt-1">{d.description}</p>
              </div>
            ))}
          </div>
        </section>
      </AnimatedSection>

      {/* ───── APP PROMOTION ───── */}
      <AnimatedSection>
        <section className="bg-gradient-to-r from-primary-600 via-primary-700 to-teal-800 py-16 md:py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-mesh-pattern opacity-10" />
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-teal-400/10 rounded-full blur-3xl" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Book on the Go</h2>
              <p className="text-lg md:text-xl mb-8 text-teal-100 max-w-lg mx-auto">Download our mobile app for exclusive deals and faster booking</p>
              <div className="flex flex-wrap justify-center gap-4">
                <button className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-black/80 hover:bg-black text-white transition-all shadow-lg hover:shadow-xl active:scale-95">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
                  <div className="text-left">
                    <div className="text-[10px] opacity-80">Download on the</div>
                    <div className="text-sm font-semibold -mt-0.5">App Store</div>
                  </div>
                </button>
                <button className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-black/80 hover:bg-black text-white transition-all shadow-lg hover:shadow-xl active:scale-95">
                  <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24"><path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.199l2.807 1.626a1 1 0 010 1.732l-2.807 1.626L15.206 12l2.492-2.492zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z"/></svg>
                  <div className="text-left">
                    <div className="text-[10px] opacity-80">Get it on</div>
                    <div className="text-sm font-semibold -mt-0.5">Google Play</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ───── TESTIMONIALS ───── */}
      <AnimatedSection>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <h2 className="section-title text-center mb-3">What Our Users Say</h2>
          <p className="section-subtitle">Trusted by thousands of happy travelers</p>
          <div className="max-w-3xl mx-auto mt-12">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card p-8 md:p-10 text-center">
              <div className="text-5xl mb-4">{TESTIMONIALS[currentTestimonial].avatar}</div>
              <div className="flex justify-center gap-0.5 mb-4">
                {[...Array(TESTIMONIALS[currentTestimonial].rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                ))}
              </div>
              <p className="text-lg text-slate-600 mb-6 italic leading-relaxed">"{TESTIMONIALS[currentTestimonial].comment}"</p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-xl">
                  {TESTIMONIALS[currentTestimonial].avatar}
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-slate-900">{TESTIMONIALS[currentTestimonial].name}</h4>
                  <p className="text-xs text-slate-400">Verified Traveler</p>
                </div>
              </div>
              <div className="flex justify-center mt-8 gap-2">
                {TESTIMONIALS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                      index === currentTestimonial ? 'bg-primary-600 w-6' : 'bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ───── STATISTICS ───── */}
      <AnimatedSection>
        <section className="bg-gradient-to-b from-slate-50 to-white py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: stats.tickets, label: 'Tickets Booked', icon: '🎫', color: 'text-primary-600' },
                { value: stats.routes, label: 'Routes Covered', icon: '🗺️', color: 'text-amber-500' },
                { value: stats.vehicles, label: 'Vehicles Onboard', icon: '🚍', color: 'text-emerald-500' },
                { value: stats.users, label: 'Happy Users', icon: '😊', color: 'text-purple-500' },
              ].map(({ value, label, icon, color }) => (
                <div key={label} className="text-center group">
                  <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{icon}</div>
                  <div className={`text-3xl md:text-4xl font-bold ${color} mb-1 tabular-nums`}>
                    {formatNumber(value)}
                  </div>
                  <p className="text-slate-500 text-sm font-medium">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ───── NEWSLETTER ───── */}
      <AnimatedSection>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center text-3xl">
              📬
            </div>
            <h2 className="section-title mb-3">Stay Updated</h2>
            <p className="section-subtitle">Subscribe to our newsletter for exclusive deals and travel tips</p>
            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mt-8">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 bg-white placeholder:text-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                required
              />
              <button type="submit" className="btn-primary px-6 py-3 flex-shrink-0">
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </AnimatedSection>

      {/* ───── TRAVEL PACKAGES ───── */}
      <AnimatedSection>
        <section className="bg-gradient-to-b from-slate-50 to-white py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-title text-center mb-3">Travel Packages</h2>
            <p className="section-subtitle">Curated packages for the perfect getaway</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
              {TRAVEL_PACKAGES.map((pkg) => (
                <div key={pkg.id} className="group bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover hover:border-primary-200 transition-all duration-300 p-6 flex flex-col">
                  <h3 className="font-bold text-lg text-slate-900 mb-1">{pkg.name}</h3>
                  <p className="text-slate-400 text-sm mb-4">{pkg.duration}</p>
                  <div className="mb-4 flex-1">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Includes</span>
                    <ul className="mt-2 space-y-1.5">
                      {pkg.includes.map((item, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-slate-600">
                          <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-2xl font-bold text-primary-600">₹{pkg.price}</span>
                    <button className="btn-primary py-2.5 px-5 text-sm">Book Now</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ───── LATEST DEALS ───── */}
      <AnimatedSection>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <h2 className="section-title text-center mb-3">Latest Deals</h2>
          <p className="section-subtitle">Unbeatable prices on your favorite travel modes</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {[
              { icon: '✈️', title: 'Flight Deals', price: 'Starting ₹1,999', gradient: 'from-purple-500 to-purple-600' },
              { icon: '🚌', title: 'Bus Offers', price: 'Starting ₹499', gradient: 'from-emerald-500 to-emerald-600' },
              { icon: '🚂', title: 'Train Special', price: 'Starting ₹399', gradient: 'from-blue-500 to-blue-600' },
            ].map(({ icon, title, price, gradient }) => (
              <div key={title} className={`relative rounded-2xl bg-gradient-to-br ${gradient} p-8 text-white overflow-hidden group cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all duration-300`}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative">
                  <span className="text-4xl block mb-4">{icon}</span>
                  <h3 className="text-xl font-bold mb-1">{title}</h3>
                  <p className="text-3xl font-bold mb-6">{price}</p>
                  <button className="bg-white text-slate-800 px-6 py-2.5 rounded-xl font-semibold hover:bg-slate-100 transition-all shadow-lg active:scale-95">
                    View Deals
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </AnimatedSection>

      {/* ───── FAQ ───── */}
      <AnimatedSection>
        <section className="bg-gradient-to-b from-white to-slate-50 py-16 md:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-title text-center mb-3">Frequently Asked Questions</h2>
            <p className="section-subtitle">Everything you need to know</p>
            <div className="space-y-3 mt-10">
              {FAQS.map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-card transition-all duration-200">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-6 py-4 md:py-5 flex items-center justify-between gap-4 text-left"
                  >
                    <span className="font-semibold text-slate-900 text-sm md:text-base">{faq.q}</span>
                    <span className={`flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 transition-all duration-300 ${expandedFaq === index ? 'bg-primary-100 text-primary-600 rotate-45' : ''}`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </span>
                  </button>
                  {expandedFaq === index && (
                    <div className="px-6 pb-4 md:pb-5 text-slate-600 text-sm md:text-base leading-relaxed border-t border-slate-100 pt-4 animate-slide-up">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ───── SUPPORT ───── */}
      <AnimatedSection>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <h2 className="section-title text-center mb-3">Need Help? We're Here for You</h2>
          <p className="section-subtitle">Reach out to us anytime, anywhere</p>
          <div className="grid md:grid-cols-3 gap-6 mt-10">
            {[
              { icon: '💬', title: 'Chat Support', desc: 'Get instant help from our team', action: 'Start Chat' },
              { icon: '📧', title: 'Email Support', desc: 'support@booktrip.test', action: 'Send Email' },
              { icon: '📞', title: 'Phone Support', desc: '1800-123-4567', action: 'Call Now' },
            ].map(({ icon, title, desc, action }) => (
              <div key={title} className="group bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover p-8 text-center transition-all duration-300 hover:-translate-y-1">
                <span className="text-4xl block mb-4 group-hover:scale-110 transition-transform">{icon}</span>
                <h3 className="font-bold text-lg text-slate-900 mb-2">{title}</h3>
                <p className="text-slate-500 mb-5 text-sm">{desc}</p>
                <button className="btn-primary py-2.5 px-6 text-sm">{action}</button>
              </div>
            ))}
          </div>
        </section>
      </AnimatedSection>

      {/* ───── FINAL CTA ───── */}
      <AnimatedSection>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="relative rounded-3xl bg-gradient-to-r from-primary-600 via-primary-700 to-teal-800 p-8 md:p-12 lg:p-16 overflow-hidden">
            <div className="absolute inset-0 bg-mesh-pattern opacity-10" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-400/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
            <div className="relative text-center">
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-3">Ready to travel?</h2>
              <p className="text-teal-100 text-lg mb-8 max-w-lg mx-auto">
                Login to book seats and manage your bookings in one place.
              </p>
              <Link
                to="/auth"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-primary-700 bg-white hover:bg-slate-50 shadow-lg hover:shadow-xl transition-all active:scale-95"
              >
                Login or Register
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </AnimatedSection>
    </div>
  );
}
