import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from '../api/axios';

export default function HotelPage() {
  const [searchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState(searchParams.get('city') || '');

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (searchParams.get('city')) params.city = searchParams.get('city');
    if (searchParams.get('location')) params.location = searchParams.get('location');

    axios.get('/hotels', { params })
      .then(res => setHotels(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = `/hotels?city=${encodeURIComponent(city)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @keyframes float { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-20px) rotate(5deg); } }
        @keyframes float-delayed { 0%,100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-15px) rotate(-3deg); } }
        @keyframes drift { 0% { transform: translateX(0); } 50% { transform: translateX(30px); } 100% { transform: translateX(0); } }
        .float-shape { animation: float 6s ease-in-out infinite; }
        .float-shape-delayed { animation: float-delayed 8s ease-in-out infinite; }
        .drift-shape { animation: drift 10s ease-in-out infinite; }
      `}</style>

      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-600">
        <div className="bg-mesh-pattern absolute inset-0 opacity-30" />

        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }} />

        <div className="float-shape absolute w-28 h-28 bg-white/5 rounded-full -top-8 -left-8" />
        <div className="float-shape-delayed absolute w-20 h-20 bg-emerald-300/10 rounded-full top-12 right-12" />
        <div className="float-shape absolute w-16 h-16 bg-white/10 rounded-lg bottom-16 left-1/4" style={{ animationDelay: '1s' }} />
        <div className="drift-shape absolute w-32 h-32 bg-teal-300/10 rounded-full -bottom-10 -right-10" />
        <div className="float-shape-delayed absolute w-12 h-12 bg-white/10 rotate-45 top-1/3 right-1/4" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 pt-16 pb-24">
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gradient-hero mb-3">
              Find Your Perfect Stay
            </h1>
            <p className="text-emerald-100/80 text-lg max-w-xl mx-auto">
              Discover the best hotels at the best prices
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-card p-6">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by city..."
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="input-field w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all bg-white text-slate-800 placeholder-slate-400"
                  />
                </div>
                <button type="submit" className="btn-primary px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold shadow-lg hover:shadow-emerald-200 hover:from-emerald-500 hover:to-teal-500 transition-all flex items-center justify-center gap-2 whitespace-nowrap">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-12 -mt-8 relative z-20">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="card bg-white rounded-2xl shadow-card overflow-hidden animate-pulse">
                <div className="h-44 bg-gradient-to-r from-emerald-100 via-emerald-50 to-teal-100" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-100 rounded w-1/2" />
                  <div className="flex gap-2 pt-2">
                    <div className="h-6 bg-slate-100 rounded-full w-16" />
                    <div className="h-6 bg-slate-100 rounded-full w-20" />
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                    <div className="h-6 bg-slate-200 rounded w-24" />
                    <div className="h-5 bg-slate-100 rounded w-14" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : hotels.length === 0 ? (
          <div className="text-center py-20 max-w-md mx-auto">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No Hotels Found</h3>
            <p className="text-slate-400">We couldn't find any hotels in this city. Try searching for a different destination.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-500 text-sm">
                <span className="font-semibold text-slate-700">{hotels.length}</span> {hotels.length === 1 ? 'hotel' : 'hotels'} found
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map(hotel => (
                <Link key={hotel._id} to={`/hotels/${hotel._id}`} className="group card bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden">
                  <div className="h-44 bg-gradient-to-br from-emerald-400 via-emerald-500 to-teal-600 flex items-center justify-center text-5xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                    {hotel.image ? (
                      <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-14 h-14 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                      ⭐ {hotel.rating}
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-600 transition-colors">{hotel.name}</h3>
                    <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {hotel.location}, {hotel.city}
                    </p>
                    {hotel.amenities?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {hotel.amenities.slice(0, 3).map((a, i) => (
                          <span key={i} className="text-xs bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-full font-medium">{a}</span>
                        ))}
                        {hotel.amenities.length > 3 && (
                          <span className="text-xs bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full font-medium">+{hotel.amenities.length - 3}</span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-slate-100">
                      <div>
                        <span className="text-xl font-bold text-emerald-600">₹{hotel.singlePrice || 1500}</span>
                        <span className="text-sm text-slate-400 ml-1">/night</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 group-hover:gap-2 transition-all">
                        Book Now
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
