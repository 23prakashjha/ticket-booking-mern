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
  { path: 'add-hotel', label: 'Add Hotel' },
  { path: 'hotels', label: 'Manage Hotels' },
  { path: 'add-place', label: 'Add Place' },
  { path: 'places', label: 'Manage Places' },
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
        <div className="bg-white p-4 rounded-xl border border-stone-200"><p className="text-stone-500 text-sm">Hotels</p><p className="text-2xl font-bold">{stats.hotels}</p></div>
        <div className="bg-white p-4 rounded-xl border border-stone-200"><p className="text-stone-500 text-sm">Places</p><p className="text-2xl font-bold">{stats.places}</p></div>
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
