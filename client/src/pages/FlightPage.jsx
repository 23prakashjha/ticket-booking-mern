import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ResultCard from '../components/ResultCard';

const SkeletonCard = ({ delay }) => (
  <div className={`card p-5 sm:p-6 animate-fade-in-up`} style={{ animationDelay: `${delay}ms` }}>
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="w-14 h-14 rounded-2xl skeleton" />
        <div className="flex-1 space-y-3">
          <div className="h-5 skeleton w-48" />
          <div className="h-4 skeleton w-36" />
          <div className="h-4 skeleton w-28" />
        </div>
      </div>
      <div className="flex flex-col items-end gap-2 flex-shrink-0">
        <div className="h-6 skeleton w-20" />
        <div className="h-9 skeleton w-24 rounded-xl" />
      </div>
    </div>
  </div>
);

export default function FlightPage() {
  const [searchParams] = useSearchParams();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState(searchParams.get('source') || '');
  const [destination, setDestination] = useState(searchParams.get('destination') || '');
  const [date, setDate] = useState(searchParams.get('date') || '');

  useEffect(() => {
    const params = {};
    if (source) params.source = source;
    if (destination) params.destination = destination;
    if (date) params.date = date;
    api.get('/flights', { params })
      .then(({ data }) => setFlights(data))
      .catch(() => setFlights([]))
      .finally(() => setLoading(false));
  }, [source, destination, date]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSource(e.target.source?.value || source);
    setDestination(e.target.destination?.value || destination);
    setDate(e.target.date?.value || date);
  };

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN') : '-');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900">
        <div className="absolute inset-0 bg-mesh-pattern opacity-30" />
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-purple-300/15 rounded-full blur-3xl animate-float-slower" />
        <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-white/30 rounded-full animate-ping-slow" />
        <div className="absolute top-1/3 left-1/3 w-3 h-3 bg-white/20 rounded-full animate-ping-slow animation-delay-1000" />
        <div className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 bg-white/25 rounded-full animate-ping-slow animation-delay-2000" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 pb-8 sm:pb-10">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center text-4xl sm:text-5xl shadow-2xl mb-5 animate-fade-in-up border border-white/10">
              ✈️
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 animate-fade-in-up">
              Book Flight Tickets
            </h1>
            <p className="text-purple-100 text-base sm:text-lg max-w-xl animate-fade-in-up">
              Search and book flight tickets across India with ease
            </p>
          </div>
        </div>
      </div>

      {/* Search Form Card */}
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-8 mb-8 z-10">
        <form onSubmit={handleSearch} className="glass-card p-5 sm:p-6 shadow-glow border border-white/30 animate-fade-in-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
            <div className="lg:col-span-4 input-icon">
              <svg className="icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input name="source" type="text" defaultValue={source} placeholder="From City" className="input-field" />
            </div>
            <div className="lg:col-span-4 input-icon">
              <svg className="icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <input name="destination" type="text" defaultValue={destination} placeholder="To City" className="input-field" />
            </div>
            <div className="lg:col-span-2 input-icon">
              <svg className="icon w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <input name="date" type="date" defaultValue={date} className="input-field" />
            </div>
            <div className="lg:col-span-2">
              <button type="submit" className="btn-primary w-full py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 shadow-lg shadow-purple-500/30">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-12">
        {loading ? (
          <div className="space-y-4" role="status" aria-label="Loading flights">
            <SkeletonCard delay={0} />
            <SkeletonCard delay={100} />
            <SkeletonCard delay={200} />
          </div>
        ) : flights.length === 0 ? (
          <div className="card p-12 sm:p-16 text-center animate-fade-in-up">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl sm:text-6xl opacity-70">✈️</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">No flights found</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-4">
              We couldn&apos;t find any flights matching your search. Try adjusting your source, destination, or travel date.
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm text-slate-400">
              <span className="px-3 py-1.5 bg-slate-100 rounded-lg">💡 Check for typos</span>
              <span className="px-3 py-1.5 bg-slate-100 rounded-lg">📅 Choose a different date</span>
              <span className="px-3 py-1.5 bg-slate-100 rounded-lg">🗺️ Try nearby airports</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2 animate-fade-in">
              <p className="text-slate-500 text-sm">
                <span className="font-semibold text-slate-800">{flights.length}</span> flight{flights.length !== 1 ? 's' : ''} found
              </p>
            </div>
            {flights.map((f, i) => (
              <div key={f._id} className="animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                <ResultCard type="flight" item={f} to={`/flights/${f._id}`} formatDate={formatDate}>
                  <div className="text-right">
                    <div className="text-purple-600 font-bold">₹{f.economyPrice} <span className="text-slate-500 font-normal text-sm">Eco</span></div>
                    <div className="text-slate-600 text-sm">₹{f.businessPrice} Business</div>
                  </div>
                </ResultCard>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
