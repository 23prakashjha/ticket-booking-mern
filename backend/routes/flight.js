import express from 'express';
import Flight from '../models/Flight.js';
import { adminProtect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { source, destination, date } = req.query;
    const filter = {};
    if (source) filter.source = new RegExp(source, 'i');
    if (destination) filter.destination = new RegExp(destination, 'i');
    if (date) filter.date = new Date(date);
    const flights = await Flight.find(filter).sort({ date: 1, departureTime: 1 });
    res.json(flights);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) return res.status(404).json({ message: 'Flight not found' });
    res.json(flight);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/', adminProtect, async (req, res) => {
  try {
    const flight = await Flight.create(req.body);
    res.status(201).json(flight);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.put('/:id', adminProtect, async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!flight) return res.status(404).json({ message: 'Flight not found' });
    res.json(flight);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete('/:id', adminProtect, async (req, res) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);
    if (!flight) return res.status(404).json({ message: 'Flight not found' });
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
