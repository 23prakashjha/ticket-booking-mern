import express from 'express';
import Place from '../models/Place.js';
import { adminProtect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { city, category, search } = req.query;
    const filter = { isActive: true };
    if (city) filter.city = new RegExp(city, 'i');
    if (category) filter.category = category;
    if (search) filter.name = new RegExp(search, 'i');
    const places = await Place.find(filter).sort({ rating: -1 });
    res.json(places);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: 'Place not found' });
    res.json(place);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/', adminProtect, async (req, res) => {
  try {
    const place = await Place.create(req.body);
    res.status(201).json(place);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.put('/:id', adminProtect, async (req, res) => {
  try {
    const place = await Place.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!place) return res.status(404).json({ message: 'Place not found' });
    res.json(place);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete('/:id', adminProtect, async (req, res) => {
  try {
    const place = await Place.findByIdAndDelete(req.params.id);
    if (!place) return res.status(404).json({ message: 'Place not found' });
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
