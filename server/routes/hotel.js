import express from 'express';
import Hotel from '../models/Hotel.js';
import { adminProtect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { city, location, minPrice, maxPrice } = req.query;
    const filter = {};
    if (city) filter.city = new RegExp(city, 'i');
    if (location) filter.location = new RegExp(location, 'i');
    if (minPrice || maxPrice) {
      filter.$or = [
        { singlePrice: { $gte: Number(minPrice) || 0, $lte: Number(maxPrice) || 999999 } },
        { doublePrice: { $gte: Number(minPrice) || 0, $lte: Number(maxPrice) || 999999 } },
      ];
    }
    const hotels = await Hotel.find(filter).sort({ rating: -1 });
    res.json(hotels);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    res.json(hotel);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/', adminProtect, async (req, res) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json(hotel);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.put('/:id', adminProtect, async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    res.json(hotel);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.delete('/:id', adminProtect, async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    res.json({ message: 'Deleted' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
