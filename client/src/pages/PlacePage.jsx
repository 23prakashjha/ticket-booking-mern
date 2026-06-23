import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from '../api/axios';

const CATEGORIES = [
  { value: '', label: 'All' },
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

  const categoryIcon = (cat) => {
    const found = CATEGORIES.find(c => c.value === cat);
    return found ? found.icon : '📍';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-rose-500 to-pink-600 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-6">Discover Places</h1>
          <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">📍</span>
              <input
                type="text"
                placeholder="Search by city or place name..."
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border-0 shadow-lg focus:ring-2 focus:ring-rose-400 outline-none"
              />
            </div>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="px-4 py-3 rounded-lg border-0 shadow-lg focus:ring-2 focus:ring-rose-400 outline-none bg-white"
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
              ))}
            </select>
            <button type="submit" className="px-6 py-3 bg-white text-rose-600 font-semibold rounded-lg shadow-lg hover:bg-rose-50 transition">
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-xl shadow-md p-4 animate-pulse">
                <div className="h-40 bg-gray-200 rounded-lg mb-4" />
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-200 rounded w-16" />
                  <div className="h-6 bg-gray-200 rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : places.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl">📍</span>
            <p className="text-gray-500 text-lg mt-4">No places found. Try a different city or category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map(place => (
              <Link key={place._id} to={`/places/${place._id}`} className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden">
                <div className="h-40 bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-5xl">
                  {place.image || '🏛️'}
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-rose-600 transition-colors">{place.name}</h3>
                    <span className="text-xs font-medium bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                      {categoryIcon(place.category)} {place.category?.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-0.5">{place.city}{place.state ? `, ${place.state}` : ''}</p>
                  <p className="text-sm text-slate-400 mt-1 line-clamp-2">{place.description}</p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-rose-600">₹{place.entryFee}</span>
                      <span className="text-xs text-slate-400">/ adult</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">⭐ {place.rating}</span>
                      <span className="text-sm text-rose-600 font-medium">Book →</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
