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
const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://prakashjha:9HCxyuc9up7KrMw@cluster0.mwessps.mongodb.net/ticket-booking?retryWrites=true&w=majority')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/trains', trainRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payment', paymentRoutes);

app.get('/api/health', (_, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 50001;
app.listen(PORT, () => console.log(`Server on http://localhost:${PORT}`));
