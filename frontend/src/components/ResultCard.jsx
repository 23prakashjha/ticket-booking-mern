import { Link } from 'react-router-dom';

const icons = { train: '🚂', bus: '🚌', flight: '✈️' };

export default function ResultCard({ type, item, to, formatDate, children }) {
  const icon = icons[type] || '🎫';
  const number = item.trainNumber || item.busNumber || item.flightNumber;

  return (
    <Link to={to} className="block group">
      <div className="card-hover p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <span className="text-3xl flex-shrink-0" aria-hidden>{icon}</span>
          <div className="min-w-0">
            <div className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors truncate">
              {item.name}
              <span className="text-slate-500 font-normal ml-1">({number})</span>
            </div>
            <p className="text-slate-600 text-sm mt-0.5">
              {item.source} → {item.destination}
              {item.date && ` • ${formatDate(item.date)}`}
            </p>
            <p className="text-slate-500 text-sm mt-1">{item.departureTime} – {item.arrivalTime}</p>
          </div>
        </div>
        <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0">
          {children}
        </div>
      </div>
    </Link>
  );
}
