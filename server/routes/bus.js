import express from 'express';
import Bus from '../models/Bus.js';
import { adminProtect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { source, destination, date } = req.query;
    const filter = {};
    if (source) filter.source = new RegExp(source, 'i');
    if (destination) filter.destination = new RegExp(destination, 'i');
    if (date) filter.date = new Date(date);
    const buses = await Bus.find(filter).sort({ date: 1, departureTime: 1 });
    res.json(buses);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) return res.status(404).json({ message: 'Bus not found' });
    res.json(bus);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/', adminProtect, async (req, res) => {
  try {
    const bus = await Bus.create(req.body);
    res.status(201).json(bus);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.put('/:id', adminProtect, async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!bus) return res.status(404).json({ message: 'Bus not found' });
    res.json(bus);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete('/:id', adminProtect, async (req, res) => {
  try {
    const bus = await Bus.findByIdAndDelete(req.params.id);
    if (!bus) return res.status(404).json({ message: 'Bus not found' });
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
