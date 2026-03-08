import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import ResultCard from '../components/ResultCard';

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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="section-title mb-1">Flights</h1>
        <p className="text-slate-600">Search and book flight tickets</p>
      </div>

      <form onSubmit={handleSearch} className="card p-4 sm:p-6 mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
          <div className="lg:col-span-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">From</label>
            <input name="source" type="text" defaultValue={source} placeholder="Source" className="input-field" />
          </div>
          <div className="lg:col-span-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">To</label>
            <input name="destination" type="text" defaultValue={destination} placeholder="Destination" className="input-field" />
          </div>
          <div className="lg:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Date</label>
            <input name="date" type="date" defaultValue={date} className="input-field" />
          </div>
          <div className="lg:col-span-2">
            <button type="submit" className="btn-primary w-full py-3">Search</button>
          </div>
        </div>
      </form>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <p className="text-slate-500">Loading flights...</p>
        </div>
      ) : flights.length === 0 ? (
        <div className="card p-12 text-center">
          <span className="text-5xl mb-4 block opacity-60">✈️</span>
          <h2 className="text-xl font-bold text-slate-900 mb-2">No flights found</h2>
          <p className="text-slate-600">Try different source, destination or date.</p>
        </div>
      ) : (
        <div className="space-y-4 animate-fade-in">
          {flights.map((f) => (
            <ResultCard key={f._id} type="flight" item={f} to={`/flights/${f._id}`} formatDate={formatDate}>
              <div className="text-right">
                <div className="text-primary-600 font-bold">₹{f.economyPrice} <span className="text-slate-500 font-normal text-sm">Eco</span></div>
                <div className="text-slate-600 text-sm">₹{f.businessPrice} Business</div>
              </div>
            </ResultCard>
          ))}
        </div>
      )}
    </div>
  );
}
