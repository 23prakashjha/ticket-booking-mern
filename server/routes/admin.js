import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Train from '../models/Train.js';
import Bus from '../models/Bus.js';
import Flight from '../models/Flight.js';
import Hotel from '../models/Hotel.js';
import Place from '../models/Place.js';
import { adminProtect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password required' });
    const exists = await Admin.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Admin email already registered' });
    const admin = await Admin.create({ name, email, password });
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.status(201).json({ admin: { id: admin._id, name: admin.name, email: admin.email }, token });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    if (!admin || !(await admin.comparePassword(password))) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ admin: { id: admin._id, name: admin.name, email: admin.email }, token });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/stats', adminProtect, async (req, res) => {
  try {
    const [users, bookings, trains, buses, flights, hotels, places] = await Promise.all([
      User.countDocuments(),
      Booking.find({ status: 'paid' }),
      Train.countDocuments(),
      Bus.countDocuments(),
      Flight.countDocuments(),
      Hotel.countDocuments(),
      Place.countDocuments(),
    ]);
    const revenue = bookings.reduce((s, b) => s + b.totalAmount, 0);
    res.json({
      admin: { name: req.admin.name, email: req.admin.email },
      users, bookings: bookings.length, trains, buses, flights, hotels, places, revenue
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/users', adminProtect, async (req, res) => {
  try {
    const users = await User.find().select('-password').lean();
    res.json(users);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/users', adminProtect, async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password required' });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const user = await User.create({ name, email, password, phone });
    res.status(201).json({ message: 'User created', user: { id: user._id, name: user.name, email: user.email } });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete('/users/:id', adminProtect, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/bookings', adminProtect, async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user', 'name email').populate('train bus flight').sort({ createdAt: -1 }).lean();
    res.json(bookings);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/trains', adminProtect, async (req, res) => {
  try {
    const { name, trainNumber, source, destination, departureTime, arrivalTime, date, totalSeats, firstAcPrice, secondAcPrice, thirdAcPrice, sleeperPrice } = req.body;
    
    const train = await Train.create({
      name,
      trainNumber,
      source,
      destination,
      departureTime,
      arrivalTime,
      date: new Date(date),
      totalSeats: Number(totalSeats) || 40,
      firstAcPrice: Number(firstAcPrice),
      secondAcPrice: Number(secondAcPrice),
      thirdAcPrice: Number(thirdAcPrice),
      sleeperPrice: Number(sleeperPrice)
    });
    
    res.status(201).json({ message: 'Train added successfully', train });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/buses', adminProtect, async (req, res) => {
  try {
    const { name, busNumber, source, destination, departureTime, arrivalTime, date, totalSeats, sleeperPrice, semiSleeperPrice } = req.body;
    
    const bus = await Bus.create({
      name,
      busNumber,
      source,
      destination,
      departureTime,
      arrivalTime,
      date: new Date(date),
      totalSeats: Number(totalSeats) || 36,
      sleeperPrice: Number(sleeperPrice),
      semiSleeperPrice: Number(semiSleeperPrice)
    });
    
    res.status(201).json({ message: 'Bus added successfully', bus });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/flights', adminProtect, async (req, res) => {
  try {
    const { name, flightNumber, source, destination, departureTime, arrivalTime, date, totalSeats, economyPrice, businessPrice } = req.body;
    
    const flight = await Flight.create({
      name,
      flightNumber,
      source,
      destination,
      departureTime,
      arrivalTime,
      date: new Date(date),
      totalSeats: Number(totalSeats) || 180,
      economyPrice: Number(economyPrice),
      businessPrice: Number(businessPrice)
    });
    
    res.status(201).json({ message: 'Flight added successfully', flight });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/hotels', adminProtect, async (req, res) => {
  try {
    const { name, city, location, address, description, amenities, totalRooms, singlePrice, doublePrice, suitePrice, dormitoryPrice, rating } = req.body;
    const hotel = await Hotel.create({
      name, city, location, address, description,
      amenities: amenities ? (Array.isArray(amenities) ? amenities : amenities.split(',').map(a => a.trim())) : [],
      totalRooms: Number(totalRooms) || 20,
      singlePrice: Number(singlePrice), doublePrice: Number(doublePrice),
      suitePrice: Number(suitePrice), dormitoryPrice: Number(dormitoryPrice),
      rating: Number(rating) || 4.0,
    });
    res.status(201).json({ message: 'Hotel added successfully', hotel });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/places', adminProtect, async (req, res) => {
  try {
    const place = await Place.create(req.body);
    res.status(201).json({ message: 'Place added successfully', place });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
