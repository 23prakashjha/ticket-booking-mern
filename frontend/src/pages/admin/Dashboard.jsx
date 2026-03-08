import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Routes, Route, Link, NavLink } from 'react-router-dom';
import adminApi from '../../api/adminAxios';
import api from '../../api/axios';

const SIDEBAR = [
  { path: '', label: 'Revenue & Stats', end: true },
  { path: 'add-train', label: 'Add Train' },
  { path: 'add-bus', label: 'Add Bus' },
  { path: 'add-flight', label: 'Add Flight' },
  { path: 'trains', label: 'Manage Trains' },
  { path: 'buses', label: 'Manage Buses' },
  { path: 'flights', label: 'Manage Flights' },
  { path: 'users', label: 'Manage Users' },
  { path: 'bookings', label: 'Manage Bookings' },
];

function Stats() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    adminApi.get('/admin/stats').then(({ data }) => setStats(data)).catch(() => setStats(null));
  }, []);
  if (!stats) return <div>Loading...</div>;
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Revenue & Stats</h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200"><p className="text-stone-500 text-sm">Revenue</p><p className="text-2xl font-bold text-primary-600">₹{stats.revenue}</p></div>
        <div className="bg-white p-4 rounded-xl border border-stone-200"><p className="text-stone-500 text-sm">Users</p><p className="text-2xl font-bold">{stats.users}</p></div>
        <div className="bg-white p-4 rounded-xl border border-stone-200"><p className="text-stone-500 text-sm">Bookings</p><p className="text-2xl font-bold">{stats.bookings}</p></div>
        <div className="bg-white p-4 rounded-xl border border-stone-200"><p className="text-stone-500 text-sm">Trains</p><p className="text-2xl font-bold">{stats.trains}</p></div>
        <div className="bg-white p-4 rounded-xl border border-stone-200"><p className="text-stone-500 text-sm">Buses</p><p className="text-2xl font-bold">{stats.buses}</p></div>
        <div className="bg-white p-4 rounded-xl border border-stone-200"><p className="text-stone-500 text-sm">Flights</p><p className="text-2xl font-bold">{stats.flights}</p></div>
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
      <div className="overflow-x-auto">
        <table className="w-full border border-stone-200 rounded-lg overflow-hidden">
          <thead className="bg-stone-100"><tr>{fields.map((f) => <th key={f} className="p-2 text-left">{f}</th>)}<th className="p-2">Action</th></tr></thead>
          <tbody>
            {list.map((row) => (
              <tr key={row._id} className="border-t border-stone-200">
                {fields.map((f) => (
                  <td key={f} className="p-2">{row[f] ?? '-'}</td>
                ))}
                <td className="p-2"><button type="button" onClick={() => handleDelete(row._id)} className="text-red-600 text-sm">Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ManageUsers() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    adminApi.get('/admin/users').then(({ data }) => setUsers(data)).catch(() => setUsers([]));
  }, []);
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Manage Users</h2>
      <div className="overflow-x-auto">
        <table className="w-full border border-stone-200 rounded-lg">
          <thead className="bg-stone-100"><tr><th className="p-2 text-left">Name</th><th className="p-2 text-left">Email</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-stone-200"><td className="p-2">{u.name}</td><td className="p-2">{u.email}</td></tr>
            ))}
          </tbody>
        </table>
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
      <div className="overflow-x-auto">
        <table className="w-full border border-stone-200 rounded-lg text-sm">
          <thead className="bg-stone-100">
            <tr><th className="p-2 text-left">User</th><th className="p-2 text-left">Type</th><th className="p-2 text-left">Seats</th><th className="p-2 text-left">Amount</th><th className="p-2 text-left">Status</th></tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} className="border-t border-stone-200">
                <td className="p-2">{b.user?.name} ({b.user?.email})</td>
                <td className="p-2">{b.type}</td>
                <td className="p-2">{b.seats?.join(', ')}</td>
                <td className="p-2">₹{b.totalAmount}</td>
                <td className="p-2">{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const t = localStorage.getItem('adminToken');
    if (!t) {
      navigate('/admin');
      return;
    }
    adminApi.get('/admin/stats').catch(() => { localStorage.removeItem('adminToken'); navigate('/admin'); });
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  return (
    <div className="flex min-h-[80vh]">
      <aside className="w-56 bg-white border-r border-stone-200 p-4 flex flex-col">
        <h2 className="font-bold text-primary-600 mb-4">Admin Dashboard</h2>
        <nav className="flex-1 space-y-1">
          {SIDEBAR.map((item) => (
            <NavLink
              key={item.path || 'stats'}
              to={item.path ? `/admin/dashboard/${item.path}` : '/admin/dashboard'}
              end={item.end}
              className={({ isActive }) => `block px-3 py-2 rounded-lg ${isActive ? 'bg-primary-600 text-white' : 'hover:bg-stone-100'}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="pt-4 border-t border-stone-200">
          <Link to="/" className="block py-2 text-sm text-stone-600 hover:text-primary-600">Back to site</Link>
          <button type="button" onClick={logout} className="btn-secondary w-full mt-2">Logout</button>
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
          <Route path="users" element={<ManageUsers />} />
          <Route path="bookings" element={<ManageBookings />} />
        </Routes>
      </div>
    </div>
  );
}
