import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Auth from './pages/Auth';
import About from './pages/About';
import Contact from './pages/Contact';
import TrainPage from './pages/TrainPage';
import TrainDetails from './pages/TrainDetails';
import BusPage from './pages/BusPage';
import BusDetails from './pages/BusDetails';
import FlightPage from './pages/FlightPage';
import FlightDetails from './pages/FlightDetails';
import MyBookings from './pages/MyBookings';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccess from './pages/PaymentSuccess';
import AdminAuth from './pages/admin/AdminAuth';
import AdminDashboard from './pages/admin/Dashboard';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/trains" element={<TrainPage />} />
        <Route path="/trains/:id" element={<TrainDetails />} />
        <Route path="/buses" element={<BusPage />} />
        <Route path="/buses/:id" element={<BusDetails />} />
        <Route path="/flights" element={<FlightPage />} />
        <Route path="/flights/:id" element={<FlightDetails />} />
        <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="/payment" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
        <Route path="/payment-success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
        <Route path="/admin" element={<AdminAuth />} />
        <Route path="/admin/dashboard/*" element={<AdminDashboard />} />
        <Route path="/pnr-status" element={<div className="max-w-4xl mx-auto px-4 py-8"><h1 className="text-3xl font-bold mb-4">PNR Status</h1><p className="text-slate-600">PNR Status feature coming soon...</p></div>} />
        <Route path="/live-train-status" element={<div className="max-w-4xl mx-auto px-4 py-8"><h1 className="text-3xl font-bold mb-4">Live Train Status</h1><p className="text-slate-600">Live Train Status feature coming soon...</p></div>} />
      </Routes>
    </Layout>
  );
}
