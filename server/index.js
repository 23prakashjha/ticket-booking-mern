import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables first
dotenv.config();

import authRoutes from './routes/auth.js';
import adminRoutes from './routes/admin.js';
import trainRoutes from './routes/train.js';
import busRoutes from './routes/bus.js';
import flightRoutes from './routes/flight.js';
import bookingRoutes from './routes/booking.js';
import paymentRoutes from './routes/payment.js';
import hotelRoutes from './routes/hotel.js';
import placeRoutes from './routes/place.js';
const app = express();
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:50001',
  'https://ticket-booking-mern.onrender.com',
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(null, true);
  },
  credentials: true,
}));
app.use(express.json());

if (!process.env.MONGODB_URI) {
  console.error('FATAL: MONGODB_URI is not set. Create server/.env with:');
  console.error('  MONGODB_URI=mongodb://<user>:<pass>@host:port/db?ssl=true&replicaSet=...');
  process.exit(1);
}
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('WARNING: RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not set.');
  console.error('  Payment orders will fail. Set them in server/.env or Render dashboard.');
} else {
  console.log('Razorpay keys configured');
}
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    if (err.code === 'ECONNREFUSED' || err.message?.includes('querySrv')) {
      console.error('Tip: If you see a DNS/querySrv error, switch to a standard mongodb:// URI');
      console.error('Get the exact connection string from your Atlas cluster -> Connect -> Drivers');
    }
  });

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/trains', trainRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/places', placeRoutes);

app.get('/api/health', (_, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 50001;

// Only start the server when NOT on Vercel (serverless)
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
}

export default app;
