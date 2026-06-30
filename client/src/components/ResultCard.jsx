import { Link } from 'react-router-dom';

const icons = { train: '🚂', bus: '🚌', flight: '✈️', hotel: '🏨', place: '📍' };
const gradients = {
  train: 'from-blue-500 to-blue-600',
  bus: 'from-emerald-500 to-emerald-600',
  flight: 'from-purple-500 to-purple-600',
  hotel: 'from-emerald-500 to-teal-600',
  place: 'from-rose-500 to-pink-600',
};

const glowColors = {
  train: 'shadow-blue-500/30',
  bus: 'shadow-emerald-500/30',
  flight: 'shadow-purple-500/30',
  hotel: 'shadow-teal-500/30',
  place: 'shadow-rose-500/30',
};

export default function ResultCard({ type, item, to, formatDate, children }) {
  const icon = icons[type] || '🎫';
  const gradient = gradients[type] || 'from-primary-500 to-primary-600';
  const glow = glowColors[type] || 'shadow-primary-500/30';
  const number = item.trainNumber || item.busNumber || item.flightNumber;
  const numberLabel = {
    train: 'Train No.',
    bus: 'Bus No.',
    flight: 'Flight No.',
    hotel: 'Rating',
    place: 'Category',
  };

  return (
    <Link to={to} className="block group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-2xl animate-fade-in">
      <div className="relative bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover hover:-translate-y-1 hover:border-primary-200 transition-all duration-300 overflow-hidden">
        <div className={`h-1 w-full bg-gradient-to-r ${gradient} opacity-60`} />

        <div className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-2xl shadow-lg ${glow} flex-shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                {icon}
                <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-primary-600 transition-colors truncate">
                    {item.name}
                  </h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200/60">
                    {numberLabel[type]} {number}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-sm">
                  <span className="font-semibold text-slate-800">{item.source}</span>
                  <svg className="w-4 h-4 text-slate-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                  <span className="font-semibold text-slate-800">{item.destination}</span>
                  {item.date && (
                    <>
                      <span className="text-slate-300 hidden sm:inline">•</span>
                      <span className="text-slate-500 text-xs sm:text-sm">{formatDate(item.date)}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-sm text-slate-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{item.departureTime} – {item.arrivalTime}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-row sm:flex-col items-center justify-between sm:justify-center gap-3 sm:gap-2 sm:flex-shrink-0 sm:pl-6 sm:border-l border-slate-100 pt-3 sm:pt-0 border-t sm:border-t-0">
              {children ? (
                children
              ) : (
                <span className="btn-primary text-sm px-5 py-2 rounded-xl font-semibold whitespace-nowrap group/btn">
                  Book Now
                  <svg className="w-4 h-4 ml-1.5 inline-block transition-transform duration-200 group-hover/btn:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
