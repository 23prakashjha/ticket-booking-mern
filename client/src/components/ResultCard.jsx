import { Link } from 'react-router-dom';

const icons = { train: '🚂', bus: '🚌', flight: '✈️', hotel: '🏨', place: '📍' };
const gradients = {
  train: 'from-blue-500 to-blue-600',
  bus: 'from-emerald-500 to-emerald-600',
  flight: 'from-purple-500 to-purple-600',
  hotel: 'from-emerald-500 to-teal-600',
  place: 'from-rose-500 to-pink-600',
};

export default function ResultCard({ type, item, to, formatDate, children }) {
  const icon = icons[type] || '🎫';
  const gradient = gradients[type] || 'from-primary-500 to-primary-600';
  const number = item.trainNumber || item.busNumber || item.flightNumber;
  const numberLabel = {
    train: 'Train No.',
    bus: 'Bus No.',
    flight: 'Flight No.',
    hotel: 'Rating',
    place: 'Category',
  };

  return (
    <Link to={to} className="block group focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-2xl">
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover hover:border-primary-200 transition-all duration-300 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl shadow-md flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
              {icon}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary-600 transition-colors truncate">
                  {item.name}
                </h3>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                  {numberLabel[type]} {number}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-sm">
                <span className="font-semibold text-slate-800">{item.source}</span>
                <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <span className="font-semibold text-slate-800">{item.destination}</span>
                {item.date && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500">{formatDate(item.date)}</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1.5 text-sm text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {item.departureTime} – {item.arrivalTime}
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-4 sm:flex-shrink-0 sm:pl-4 sm:border-l border-slate-100">
            {children}
          </div>
        </div>
      </div>
    </Link>
  );
}
