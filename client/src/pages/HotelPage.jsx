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
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-6">Find Hotels</h1>
          <form onSubmit={handleSearch} className="flex gap-3 max-w-xl">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">📍</span>
              <input
                type="text"
                placeholder="Search by city..."
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border-0 shadow-lg focus:ring-2 focus:ring-emerald-400 outline-none"
              />
            </div>
            <button type="submit" className="px-6 py-3 bg-white text-emerald-600 font-semibold rounded-lg shadow-lg hover:bg-emerald-50 transition">
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
        ) : hotels.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl">🏨</span>
            <p className="text-gray-500 text-lg mt-4">No hotels found. Try a different city.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hotels.map(hotel => (
              <Link key={hotel._id} to={`/hotels/${hotel._id}`} className="group bg-white rounded-xl shadow-md hover:shadow-lg transition-all overflow-hidden">
                <div className="h-40 bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-5xl">
                  {hotel.image || '🏨'}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-600 transition-colors">{hotel.name}</h3>
                  <p className="text-sm text-slate-500 mt-0.5">{hotel.location}, {hotel.city}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs font-medium bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">⭐ {hotel.rating}</span>
                    {hotel.amenities?.slice(0, 2).map((a, i) => (
                      <span key={i} className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{a}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                    <span className="text-lg font-bold text-emerald-600">₹{hotel.singlePrice || 1500}<span className="text-sm font-normal text-slate-400">/night</span></span>
                    <span className="text-sm text-emerald-600 font-medium">Book →</span>
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
