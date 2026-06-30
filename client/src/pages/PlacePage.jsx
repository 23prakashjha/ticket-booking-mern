import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from '../api/axios';

const CATEGORIES = [
  { value: '', label: 'All', icon: '🏛️' },
  { value: 'historical', label: 'Historical', icon: '🏛️' },
  { value: 'nature', label: 'Nature', icon: '🌿' },
  { value: 'adventure', label: 'Adventure', icon: '🧗' },
  { value: 'religious', label: 'Religious', icon: '🛕' },
  { value: 'beach', label: 'Beach', icon: '🏖️' },
  { value: 'hill_station', label: 'Hill Station', icon: '🏔️' },
  { value: 'cultural', label: 'Cultural', icon: '🎭' },
  { value: 'amusement', label: 'Amusement', icon: '🎡' },
  { value: 'museum', label: 'Museum', icon: '🏛️' },
];

export default function PlacePage() {
  const [searchParams] = useSearchParams();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (searchParams.get('city')) params.city = searchParams.get('city');
    if (searchParams.get('category')) params.category = searchParams.get('category');
    if (searchParams.get('search')) params.search = searchParams.get('search');

    axios.get('/places', { params })
      .then(res => setPlaces(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (category) params.set('category', category);
    window.location.href = `/places?${params.toString()}`;
  };

  const handleCategoryClick = (cat) => {
    const params = new URLSearchParams();
    if (city) params.set('city', city);
    if (cat) params.set('category', cat);
    window.location.href = `/places?${params.toString()}`;
  };

  const categoryIcon = (cat) => {
    const found = CATEGORIES.find(c => c.value === cat);
    return found ? found.icon : '📍';
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

      <div className="relative overflow-hidden bg-gradient-to-br from-rose-700 via-rose-600 to-pink-600">
        <div className="bg-mesh-pattern absolute inset-0 opacity-30" />

        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }} />

        <div className="float-shape absolute w-28 h-28 bg-white/5 rounded-full -top-8 -left-8" />
        <div className="float-shape-delayed absolute w-20 h-20 bg-rose-300/10 rounded-full top-12 right-12" />
        <div className="float-shape absolute w-16 h-16 bg-white/10 rounded-lg bottom-16 left-1/4" style={{ animationDelay: '1s' }} />
        <div className="drift-shape absolute w-32 h-32 bg-pink-300/10 rounded-full -bottom-10 -right-10" />
        <div className="float-shape-delayed absolute w-12 h-12 bg-white/10 rotate-45 top-1/3 right-1/4" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 pt-16 pb-24">
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gradient-hero mb-3">
              Discover Amazing Places
            </h1>
            <p className="text-rose-100/80 text-lg max-w-xl mx-auto">
              Explore the most beautiful destinations around you
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-card p-6">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by city or place name..."
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="input-field w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none transition-all bg-white text-slate-800 placeholder-slate-400"
                  />
                </div>
                <button type="submit" className="btn-primary px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-semibold shadow-lg hover:shadow-rose-200 hover:from-rose-500 hover:to-pink-500 transition-all flex items-center justify-center gap-2 whitespace-nowrap">
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
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => handleCategoryClick(cat.value)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  category === cat.value
                    ? 'bg-rose-100 text-rose-700 shadow-sm ring-1 ring-rose-200'
                    : 'bg-white text-slate-600 hover:bg-rose-50 hover:text-rose-600 shadow-sm border border-slate-200'
                }`}
              >
                <span className="text-base">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="card bg-white rounded-2xl shadow-card overflow-hidden animate-pulse">
                <div className="h-44 bg-gradient-to-r from-rose-100 via-rose-50 to-pink-100" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-slate-200 rounded w-3/4" />
                  <div className="h-4 bg-slate-100 rounded w-1/2" />
                  <div className="h-4 bg-slate-100 rounded w-full" />
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
        ) : places.length === 0 ? (
          <div className="text-center py-20 max-w-md mx-auto">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No Places Found</h3>
            <p className="text-slate-400">We couldn't find any places matching your search. Try a different city or category.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-500 text-sm">
                <span className="font-semibold text-slate-700">{places.length}</span> {places.length === 1 ? 'place' : 'places'} found
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {places.map(place => (
                <Link key={place._id} to={`/places/${place._id}`} className="group card bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden">
                  <div className="h-44 bg-gradient-to-br from-rose-400 via-rose-500 to-pink-600 flex items-center justify-center text-5xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                    {place.image ? (
                      <img src={place.image} alt={place.name} className="w-full h-full object-cover" />
                    ) : (
                      <svg className="w-14 h-14 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-rose-700 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
                      <span>{categoryIcon(place.category)}</span>
                      <span>{place.category?.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-rose-600 transition-colors flex-1">{place.name}</h3>
                      <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full flex-shrink-0">
                        <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {place.rating}
                      </div>
                    </div>
                    <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {place.city}{place.state ? `, ${place.state}` : ''}
                    </p>
                    <p className="text-sm text-slate-400 mt-2 line-clamp-2 leading-relaxed">{place.description}</p>
                    <div className="flex items-center justify-between mt-4 pt-3.5 border-t border-slate-100">
                      <div>
                        <span className="text-lg font-bold text-rose-600">₹{place.entryFee}</span>
                        <span className="text-xs text-slate-400 ml-1">/ adult</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-rose-600 group-hover:gap-2 transition-all">
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
