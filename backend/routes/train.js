import express from 'express';
import Train from '../models/Train.js';
import { adminProtect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { source, destination, date } = req.query;
    const filter = {};
    if (source) filter.source = new RegExp(source, 'i');
    if (destination) filter.destination = new RegExp(destination, 'i');
    if (date) filter.date = new Date(date);
    const trains = await Train.find(filter).sort({ date: 1, departureTime: 1 });
    res.json(trains);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const train = await Train.findById(req.params.id);
    if (!train) return res.status(404).json({ message: 'Train not found' });
    res.json(train);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/', adminProtect, async (req, res) => {
  try {
    const train = await Train.create(req.body);
    res.status(201).json(train);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.put('/:id', adminProtect, async (req, res) => {
  try {
    const train = await Train.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!train) return res.status(404).json({ message: 'Train not found' });
    res.json(train);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete('/:id', adminProtect, async (req, res) => {
  try {
    const train = await Train.findByIdAndDelete(req.params.id);
    if (!train) return res.status(404).json({ message: 'Train not found' });
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
