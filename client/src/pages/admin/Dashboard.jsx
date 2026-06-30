import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route, Link, NavLink } from 'react-router-dom';
import adminApi from '../../api/adminAxios';
import api from '../../api/axios';

const STAT_ICONS = {
  Revenue: '💰',
  Users: '👥',
  Bookings: '🎫',
  Trains: '🚂',
  Buses: '🚌',
  Flights: '✈️',
  Hotels: '🏨',
  Places: '📍',
};

const STAT_COLORS = {
  Revenue: 'from-emerald-500 to-teal-600',
  Users: 'from-blue-500 to-indigo-600',
  Bookings: 'from-violet-500 to-purple-600',
  Trains: 'from-orange-500 to-red-500',
  Buses: 'from-cyan-500 to-blue-600',
  Flights: 'from-rose-500 to-pink-600',
  Hotels: 'from-amber-500 to-yellow-600',
  Places: 'from-lime-500 to-green-600',
};

const SIDEBAR = [
  { path: '', label: 'Revenue & Stats', end: true },
  { path: 'add-train', label: 'Add Train' },
  { path: 'add-bus', label: 'Add Bus' },
  { path: 'add-flight', label: 'Add Flight' },
  { path: 'trains', label: 'Manage Trains' },
  { path: 'buses', label: 'Manage Buses' },
  { path: 'flights', label: 'Manage Flights' },
  { path: 'add-hotel', label: 'Add Hotel' },
  { path: 'hotels', label: 'Manage Hotels' },
  { path: 'add-place', label: 'Add Place' },
  { path: 'places', label: 'Manage Places' },
  { path: 'users', label: 'Manage Users' },
  { path: 'bookings', label: 'Manage Bookings' },
];

function Loader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full" />
    </div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="relative group">
      <div className={`absolute inset-0 bg-gradient-to-br ${color} rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
      <div className="relative bg-white rounded-2xl border border-stone-200 p-5 hover:shadow-lg hover:border-stone-300 transition-all duration-200">
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl">{icon}</span>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-gradient-to-br ${color} text-white`}>
            {label}
          </span>
        </div>
        <p className="text-3xl font-bold text-stone-800">
          {typeof value === 'number' && label === 'Revenue' ? `₹${value.toLocaleString()}` : value}
        </p>
      </div>
    </div>
  );
}

function Stats() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    adminApi.get('/admin/stats').then(({ data }) => setStats(data)).catch(() => setStats(null));
  }, []);
  if (!stats) return <Loader />;
  const items = [
    { label: 'Revenue', value: stats.revenue, icon: STAT_ICONS.Revenue, color: STAT_COLORS.Revenue },
    { label: 'Users', value: stats.users, icon: STAT_ICONS.Users, color: STAT_COLORS.Users },
    { label: 'Bookings', value: stats.bookings, icon: STAT_ICONS.Bookings, color: STAT_COLORS.Bookings },
    { label: 'Trains', value: stats.trains, icon: STAT_ICONS.Trains, color: STAT_COLORS.Trains },
    { label: 'Buses', value: stats.buses, icon: STAT_ICONS.Buses, color: STAT_COLORS.Buses },
    { label: 'Flights', value: stats.flights, icon: STAT_ICONS.Flights, color: STAT_COLORS.Flights },
    { label: 'Hotels', value: stats.hotels, icon: STAT_ICONS.Hotels, color: STAT_COLORS.Hotels },
    { label: 'Places', value: stats.places, icon: STAT_ICONS.Places, color: STAT_COLORS.Places },
  ];
  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white text-xl font-bold shadow-md">
          {stats.admin?.name?.[0]?.toUpperCase() || 'A'}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Welcome back, {stats.admin?.name || 'Admin'}</h1>
          <p className="text-stone-500 text-sm">{stats.admin?.email}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <StatCard key={item.label} {...item} />
        ))}
      </div>
    </div>
  );
}

function AddTrain() {
  const [msg, setMsg] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    trainNumber: '',
    source: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    date: '',
    totalSeats: 40,
    firstAcPrice: '',
    secondAcPrice: '',
    thirdAcPrice: '',
    sleeperPrice: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      name: formData.name,
      trainNumber: formData.trainNumber,
      source: formData.source,
      destination: formData.destination,
      departureTime: formData.departureTime,
      arrivalTime: formData.arrivalTime,
      date: formData.date,
      totalSeats: Number(formData.totalSeats) || 40,
      firstAcPrice: Number(formData.firstAcPrice),
      secondAcPrice: Number(formData.secondAcPrice),
      thirdAcPrice: Number(formData.thirdAcPrice),
      sleeperPrice: Number(formData.sleeperPrice)
    };
    try {
      await adminApi.post('/trains', body);
      setMsg('Train added successfully!');
      setFormData({
        name: '',
        trainNumber: '',
        source: '',
        destination: '',
        departureTime: '',
        arrivalTime: '',
        date: '',
        totalSeats: 40,
        firstAcPrice: '',
        secondAcPrice: '',
        thirdAcPrice: '',
        sleeperPrice: ''
      });
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Add Train</h2>
      {msg && <p className={`text-sm mb-4 ${msg.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
      <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Train name" className="input-field" required />
        <input name="trainNumber" value={formData.trainNumber} onChange={handleChange} placeholder="Train number" className="input-field" required />
        <input name="source" value={formData.source} onChange={handleChange} placeholder="Source" className="input-field" required />
        <input name="destination" value={formData.destination} onChange={handleChange} placeholder="Destination" className="input-field" required />
        <input name="departureTime" type="time" value={formData.departureTime} onChange={handleChange} className="input-field" required />
        <input name="arrivalTime" type="time" value={formData.arrivalTime} onChange={handleChange} className="input-field" required />
        <input name="date" type="date" value={formData.date} onChange={handleChange} className="input-field" required />
        <input name="totalSeats" type="number" value={formData.totalSeats} onChange={handleChange} placeholder="Total seats (default 40)" className="input-field" min="1" max="100" />
        
        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-semibold mb-3">Class Pricing (₹ per seat)</h3>
          <div className="grid grid-cols-2 gap-3">
            <input name="firstAcPrice" type="number" value={formData.firstAcPrice} onChange={handleChange} placeholder="1st AC Price" className="input-field" required min="0" />
            <input name="secondAcPrice" type="number" value={formData.secondAcPrice} onChange={handleChange} placeholder="2nd AC Price" className="input-field" required min="0" />
            <input name="thirdAcPrice" type="number" value={formData.thirdAcPrice} onChange={handleChange} placeholder="3rd AC Price" className="input-field" required min="0" />
            <input name="sleeperPrice" type="number" value={formData.sleeperPrice} onChange={handleChange} placeholder="Sleeper Price" className="input-field" required min="0" />
          </div>
        </div>
        
        <button type="submit" className="btn-primary">Add Train</button>
      </form>
    </div>
  );
}

function AddBus() {
  const [msg, setMsg] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    busNumber: '',
    source: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    date: '',
    totalSeats: 36,
    sleeperPrice: '',
    semiSleeperPrice: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = {
      name: formData.name,
      busNumber: formData.busNumber,
      source: formData.source,
      destination: formData.destination,
      departureTime: formData.departureTime,
      arrivalTime: formData.arrivalTime,
      date: formData.date,
      totalSeats: Number(formData.totalSeats) || 36,
      sleeperPrice: Number(formData.sleeperPrice),
      semiSleeperPrice: Number(formData.semiSleeperPrice)
    };
    try {
      await adminApi.post('/buses', body);
      setMsg('Bus added successfully!');
      setFormData({
        name: '',
        busNumber: '',
        source: '',
        destination: '',
        departureTime: '',
        arrivalTime: '',
        date: '',
        totalSeats: 36,
        sleeperPrice: '',
        semiSleeperPrice: ''
      });
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Add Bus</h2>
      {msg && <p className={`text-sm mb-4 ${msg.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{msg}</p>}
      <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Bus name" className="input-field" required />
        <input name="busNumber" value={formData.busNumber} onChange={handleChange} placeholder="Bus number" className="input-field" required />
        <input name="source" value={formData.source} onChange={handleChange} placeholder="Source" className="input-field" required />
        <input name="destination" value={formData.destination} onChange={handleChange} placeholder="Destination" className="input-field" required />
        <input name="departureTime" type="time" value={formData.departureTime} onChange={handleChange} className="input-field" required />
        <input name="arrivalTime" type="time" value={formData.arrivalTime} onChange={handleChange} className="input-field" required />
        <input name="date" type="date" value={formData.date} onChange={handleChange} className="input-field" required />
        <input name="totalSeats" type="number" value={formData.totalSeats} onChange={handleChange} placeholder="Total seats (default 36)" className="input-field" min="1" max="100" />
        
        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-semibold mb-3">Class Pricing (₹ per seat)</h3>
          <div className="grid grid-cols-2 gap-3">
            <input name="sleeperPrice" type="number" value={formData.sleeperPrice} onChange={handleChange} placeholder="Sleeper Price" className="input-field" required min="0" />
            <input name="semiSleeperPrice" type="number" value={formData.semiSleeperPrice} onChange={handleChange} placeholder="Semi-Sleeper Price" className="input-field" required min="0" />
          </div>
        </div>
        
        <button type="submit" className="btn-primary">Add Bus</button>
      </form>
    </div>
  );
}

function AddFlight() {
  const [msg, setMsg] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const body = {
      name: form.name.value,
      flightNumber: form.flightNumber.value,
      source: form.source.value,
      destination: form.destination.value,
      departureTime: form.departureTime.value,
      arrivalTime: form.arrivalTime.value,
      date: form.date.value,
      economyPrice: Number(form.economyPrice.value),
      businessPrice: Number(form.businessPrice.value),
      totalSeats: Number(form.totalSeats.value) || 60,
    };
    try {
      await adminApi.post('/flights', body);
      setMsg('Flight added.');
      form.reset();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Add Flight</h2>
      <form onSubmit={handleSubmit} className="space-y-3 max-w-md">
        <input name="name" placeholder="Flight name" className="input-field" required />
        <input name="flightNumber" placeholder="Flight number" className="input-field" required />
        <input name="source" placeholder="Source" className="input-field" required />
        <input name="destination" placeholder="Destination" className="input-field" required />
        <input name="departureTime" type="time" className="input-field" required />
        <input name="arrivalTime" type="time" className="input-field" required />
        <input name="date" type="date" className="input-field" required />
        <input name="economyPrice" type="number" placeholder="Economy price" className="input-field" required />
        <input name="businessPrice" type="number" placeholder="Business price" className="input-field" required />
        <input name="totalSeats" type="number" placeholder="Total seats (default 60)" className="input-field" />
        <button type="submit" className="btn-primary">Add Flight</button>
        {msg && <p className="text-sm">{msg}</p>}
      </form>
    </div>
  );
}

function AddHotel() {
  const [msg, setMsg] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const body = {
      name: form.name.value,
      city: form.city.value,
      location: form.location.value,
      address: form.address.value,
      description: form.description.value,
      amenities: form.amenities.value,
      totalRooms: Number(form.totalRooms.value) || 20,
      singlePrice: Number(form.singlePrice.value),
      doublePrice: Number(form.doublePrice.value),
      suitePrice: Number(form.suitePrice.value),
      dormitoryPrice: Number(form.dormitoryPrice.value),
      rating: Number(form.rating.value) || 4.0,
    };
    try {
      await adminApi.post('/hotels', body);
      setMsg('Hotel added.');
      form.reset();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Add Hotel</h2>
      <form onSubmit={handleSubmit} className="space-y-3 max-w-lg">
        <input name="name" placeholder="Hotel name" className="input-field" required />
        <div className="grid grid-cols-2 gap-3">
          <input name="city" placeholder="City" className="input-field" required />
          <input name="location" placeholder="Location/Area" className="input-field" required />
        </div>
        <input name="address" placeholder="Full address" className="input-field" required />
        <textarea name="description" placeholder="Description" className="input-field" rows="3" />
        <input name="amenities" placeholder="Amenities (comma separated, e.g. WiFi, Pool, Gym)" className="input-field" />
        <input name="totalRooms" type="number" placeholder="Total rooms (default 20)" className="input-field" min="1" />
        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-semibold mb-3">Room Pricing (₹ per night)</h3>
          <div className="grid grid-cols-2 gap-3">
            <input name="singlePrice" type="number" placeholder="Single Room Price" className="input-field" required min="0" />
            <input name="doublePrice" type="number" placeholder="Double Room Price" className="input-field" required min="0" />
            <input name="suitePrice" type="number" placeholder="Suite Price" className="input-field" required min="0" />
            <input name="dormitoryPrice" type="number" placeholder="Dormitory Price" className="input-field" required min="0" />
          </div>
        </div>
        <input name="rating" type="number" step="0.1" placeholder="Rating (0-5, default 4.0)" className="input-field" min="0" max="5" />
        <button type="submit" className="btn-primary">Add Hotel</button>
        {msg && <p className="text-sm">{msg}</p>}
      </form>
    </div>
  );
}

function AddPlace() {
  const [msg, setMsg] = useState('');
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const body = {
      name: form.name.value,
      city: form.city.value,
      state: form.state.value,
      location: form.location.value,
      description: form.description.value,
      category: form.category.value,
      entryFee: Number(form.entryFee.value),
      childFee: Number(form.childFee.value),
      openingTime: form.openingTime.value,
      closingTime: form.closingTime.value,
      bestTime: form.bestTime.value,
      duration: form.duration.value,
      rating: Number(form.rating.value) || 4.0,
    };
    try {
      await adminApi.post('/places', body);
      setMsg('Place added.');
      form.reset();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Add Place</h2>
      <form onSubmit={handleSubmit} className="space-y-3 max-w-lg">
        <input name="name" placeholder="Place name" className="input-field" required />
        <div className="grid grid-cols-2 gap-3">
          <input name="city" placeholder="City" className="input-field" required />
          <input name="state" placeholder="State" className="input-field" />
        </div>
        <input name="location" placeholder="Location/Area" className="input-field" />
        <textarea name="description" placeholder="Description" className="input-field" rows="3" />
        <select name="category" className="input-field" required>
          <option value="">Select category</option>
          <option value="historical">Historical</option>
          <option value="nature">Nature</option>
          <option value="adventure">Adventure</option>
          <option value="religious">Religious</option>
          <option value="beach">Beach</option>
          <option value="hill_station">Hill Station</option>
          <option value="cultural">Cultural</option>
          <option value="amusement">Amusement</option>
          <option value="museum">Museum</option>
          <option value="other">Other</option>
        </select>
        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-semibold mb-3">Pricing & Timing</h3>
          <div className="grid grid-cols-2 gap-3">
            <input name="entryFee" type="number" placeholder="Entry fee (adult)" className="input-field" required min="0" />
            <input name="childFee" type="number" placeholder="Entry fee (child)" className="input-field" min="0" />
          </div>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <input name="openingTime" type="time" placeholder="Opening time" className="input-field" />
            <input name="closingTime" type="time" placeholder="Closing time" className="input-field" />
          </div>
        </div>
        <input name="bestTime" placeholder="Best time to visit (e.g. Oct-Mar)" className="input-field" />
        <input name="duration" placeholder="Suggested duration (e.g. 2-3 hrs)" className="input-field" />
        <input name="rating" type="number" step="0.1" placeholder="Rating (0-5, default 4.0)" className="input-field" min="0" max="5" />
        <button type="submit" className="btn-primary">Add Place</button>
        {msg && <p className="text-sm">{msg}</p>}
      </form>
    </div>
  );
}

function ManageList({ title, base, fields }) {
  const [list, setList] = useState([]);
  useEffect(() => {
    api.get(`/${base}`).then(({ data }) => setList(data)).catch(() => setList([]));
  }, [base]);
  const handleDelete = async (id) => {
    if (!confirm('Delete?')) return;
    try {
      await adminApi.delete(`/${base}/${id}`);
      setList((prev) => prev.filter((x) => x._id !== id));
    } catch (e) {
      alert(e.response?.data?.message || 'Failed');
    }
  };
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="overflow-x-auto rounded-xl border border-stone-200">
        <table className="w-full">
          <thead className="bg-stone-100">
            <tr>
              {fields.map((f) => <th key={f} className="p-3 text-left text-sm font-semibold text-stone-600">{f}</th>)}
              <th className="p-3 text-left text-sm font-semibold text-stone-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {list.map((row) => (
              <tr key={row._id} className="border-t border-stone-200 hover:bg-stone-50 transition-colors">
                {fields.map((f) => (
                  <td key={f} className="p-3 text-sm text-stone-700">{row[f] ?? '-'}</td>
                ))}
                <td className="p-3">
                  <button type="button" onClick={() => handleDelete(row._id)} className="text-sm text-red-600 hover:text-red-800 hover:underline font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && <p className="p-6 text-center text-stone-400 text-sm">No items found</p>}
      </div>
    </div>
  );
}

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [msg, setMsg] = useState('');

  const fetchUsers = () => {
    adminApi.get('/admin/users').then(({ data }) => setUsers(data)).catch(() => setUsers([]));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this user permanently?')) return;
    try {
      await adminApi.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to delete');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      await adminApi.post('/admin/users', form);
      setShowModal(false);
      setForm({ name: '', email: '', password: '', phone: '' });
      fetchUsers();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Failed to create user');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Manage Users</h2>
        <button type="button" onClick={() => setShowModal(true)} className="btn-primary text-sm py-2 px-4">+ Add User</button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-stone-800">Add New User</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleAdd} className="space-y-3">
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="input-field" required />
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email address" className="input-field" required />
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" className="input-field" required minLength={6} />
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Phone (optional)" className="input-field" />
              {msg && <p className="text-sm text-red-600">{msg}</p>}
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                <button type="submit" className="btn-primary flex-1">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-stone-200">
        <table className="w-full">
          <thead className="bg-stone-100">
            <tr>
              <th className="p-3 text-left text-sm font-semibold text-stone-600">Name</th>
              <th className="p-3 text-left text-sm font-semibold text-stone-600">Email</th>
              <th className="p-3 text-left text-sm font-semibold text-stone-600">Phone</th>
              <th className="p-3 text-left text-sm font-semibold text-stone-600">Joined</th>
              <th className="p-3 text-left text-sm font-semibold text-stone-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-stone-200 hover:bg-stone-50 transition-colors">
                <td className="p-3 text-sm font-medium text-stone-700">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-xs font-bold">{u.name?.[0]?.toUpperCase()}</div>
                    {u.name}
                  </div>
                </td>
                <td className="p-3 text-sm text-stone-600">{u.email}</td>
                <td className="p-3 text-sm text-stone-600">{u.phone || '-'}</td>
                <td className="p-3 text-sm text-stone-500">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</td>
                <td className="p-3">
                  <button type="button" onClick={() => handleDelete(u._id)} className="text-sm text-red-600 hover:text-red-800 hover:underline font-medium">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p className="p-6 text-center text-stone-400 text-sm">No users found</p>}
      </div>
    </div>
  );
}

function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  useEffect(() => {
    adminApi.get('/admin/bookings').then(({ data }) => setBookings(data)).catch(() => setBookings([]));
  }, []);
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Bookings</h2>
      <div className="overflow-x-auto rounded-xl border border-stone-200">
        <table className="w-full text-sm">
          <thead className="bg-stone-100">
            <tr>
              <th className="p-3 text-left font-semibold text-stone-600">User</th>
              <th className="p-3 text-left font-semibold text-stone-600">Type</th>
              <th className="p-3 text-left font-semibold text-stone-600">Seats</th>
              <th className="p-3 text-left font-semibold text-stone-600">Amount</th>
              <th className="p-3 text-left font-semibold text-stone-600">Status</th>
              <th className="p-3 text-left font-semibold text-stone-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} className="border-t border-stone-200 hover:bg-stone-50 transition-colors">
                <td className="p-3 text-stone-700">{b.user?.name} <span className="text-stone-400">({b.user?.email})</span></td>
                <td className="p-3">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700">{b.type}</span>
                </td>
                <td className="p-3 text-stone-600">{b.seats?.join(', ')}</td>
                <td className="p-3 font-medium text-stone-800">₹{b.totalAmount}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    b.status === 'paid' ? 'bg-green-50 text-green-700' :
                    b.status === 'cancelled' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                  }`}>{b.status}</span>
                </td>
                <td className="p-3 text-stone-500">{b.createdAt ? new Date(b.createdAt).toLocaleDateString() : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && <p className="p-6 text-center text-stone-400 text-sm">No bookings found</p>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [adminInfo, setAdminInfo] = useState({
    name: localStorage.getItem('adminName'),
    email: localStorage.getItem('adminEmail'),
  });

  useEffect(() => {
    const t = localStorage.getItem('adminToken');
    if (!t) {
      navigate('/admin');
      return;
    }
    adminApi.get('/admin/stats')
      .then(({ data }) => {
        setAdminInfo(data.admin);
        localStorage.setItem('adminName', data.admin.name);
        localStorage.setItem('adminEmail', data.admin.email);
      })
      .catch(() => { localStorage.removeItem('adminToken'); navigate('/admin'); });
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminEmail');
    navigate('/admin');
  };

  return (
    <div className="flex min-h-[80vh] bg-stone-50">
      <aside className="w-60 bg-gradient-to-b from-stone-900 to-stone-800 text-white flex flex-col shadow-xl">
        <div className="p-5 border-b border-stone-700">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {adminInfo?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate">{adminInfo?.name || 'Admin'}</p>
              <p className="text-xs text-stone-400 truncate">{adminInfo?.email || ''}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {SIDEBAR.map((item) => (
            <NavLink
              key={item.path || 'stats'}
              to={item.path ? `/admin/dashboard/${item.path}` : '/admin/dashboard'}
              end={item.end}
              className={({ isActive }) =>
                `block px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-600 text-white shadow-md'
                    : 'text-stone-300 hover:bg-stone-700/50 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-stone-700 space-y-2">
          <Link to="/" className="block py-2 text-sm text-stone-400 hover:text-white transition-colors">← Back to site</Link>
          <button type="button" onClick={logout} className="w-full py-2.5 px-4 rounded-xl bg-stone-700 hover:bg-red-600 text-stone-300 hover:text-white text-sm font-medium transition-all duration-200">Logout</button>
        </div>
      </aside>
      <div className="flex-1 p-8 overflow-auto">
        <Routes>
          <Route index element={<Stats />} />
          <Route path="add-train" element={<AddTrain />} />
          <Route path="add-bus" element={<AddBus />} />
          <Route path="add-flight" element={<AddFlight />} />
          <Route path="trains" element={<ManageList title="Manage Trains" base="trains" fields={['name', 'trainNumber', 'source', 'destination', 'pricePerSeat']} />} />
          <Route path="buses" element={<ManageList title="Manage Buses" base="buses" fields={['name', 'busNumber', 'source', 'destination', 'pricePerSeat']} />} />
          <Route path="flights" element={<ManageList title="Manage Flights" base="flights" fields={['name', 'flightNumber', 'source', 'destination', 'economyPrice', 'businessPrice']} />} />
          <Route path="add-hotel" element={<AddHotel />} />
          <Route path="hotels" element={<ManageList title="Manage Hotels" base="hotels" fields={['name', 'city', 'location', 'singlePrice', 'rating']} />} />
          <Route path="add-place" element={<AddPlace />} />
          <Route path="places" element={<ManageList title="Manage Places" base="places" fields={['name', 'city', 'category', 'entryFee', 'rating']} />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="bookings" element={<ManageBookings />} />
        </Routes>
      </div>
    </div>
  );
}
