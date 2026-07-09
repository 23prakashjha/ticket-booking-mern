import express from 'express';
import Booking from '../models/Booking.js';
import Train from '../models/Train.js';
import Bus from '../models/Bus.js';
import Flight from '../models/Flight.js';
import Hotel from '../models/Hotel.js';
import Place from '../models/Place.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('train bus flight hotel place').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/lock-seats', protect, async (req, res) => {
  try {
    console.log('Lock seats request:', req.body);
    const { type, id, seats, seatClass, roomType, guests, checkIn, checkOut, visitDate, timeSlot, adults, children } = req.body;
    let Model, priceKey;

    if (type === 'place') {
      Model = Place;
      priceKey = 'entryFee';
    } else if (type === 'hotel') {
      Model = Hotel;
      const roomPriceMap = { single: 'singlePrice', double: 'doublePrice', suite: 'suitePrice', dormitory: 'dormitoryPrice' };
      priceKey = roomPriceMap[roomType] || 'singlePrice';
    } else if (type === 'train') { 
      Model = Train; 
      switch (seatClass) {
        case '1st_ac': priceKey = 'firstAcPrice'; break;
        case '2nd_ac': priceKey = 'secondAcPrice'; break;
        case '3rd_ac': priceKey = 'thirdAcPrice'; break;
        case 'sleeper': priceKey = 'sleeperPrice'; break;
        default: priceKey = 'pricePerSeat'; break;
      }
    }
    else if (type === 'bus') { 
      Model = Bus; 
      switch (seatClass) {
        case 'sleeper': priceKey = 'sleeperPrice'; break;
        case 'semi_sleeper': priceKey = 'semiSleeperPrice'; break;
        default: priceKey = 'pricePerSeat'; break;
      }
    }
    else if (type === 'flight') { 
      Model = Flight; 
      priceKey = seatClass === 'business' ? 'businessPrice' : 'economyPrice'; 
    }
    else return res.status(400).json({ message: 'Invalid type' });

    const doc = await Model.findById(id);
    if (!doc) return res.status(404).json({ message: 'Not found' });

    // Handle backward compatibility for existing data
    let price;
    if (type === 'place') {
      const adultFee = doc.entryFee || 100;
      const childFee = doc.childFee || 50;
      price = adultFee;
    } else if (type === 'hotel') {
      price = doc[priceKey] || 1500;
    } else if (type === 'train') {
      // For existing trains without class pricing, use legacy price or set defaults
      if (doc[priceKey]) {
        price = doc[priceKey];
      } else if (doc.pricePerSeat) {
        price = doc.pricePerSeat; // Fallback to legacy price
      } else {
        // Set default prices if none exist
        const defaultPrices = {
          '1st_ac': 1500,
          '2nd_ac': 1000,
          '3rd_ac': 700,
          'sleeper': 300
        };
        price = defaultPrices[seatClass] || 500;
      }
    } else if (type === 'bus') {
      // For existing buses without class pricing, use legacy price or set defaults
      if (doc[priceKey]) {
        price = doc[priceKey];
      } else if (doc.pricePerSeat) {
        price = doc.pricePerSeat; // Fallback to legacy price
      } else {
        // Set default prices if none exist
        const defaultPrices = {
          'sleeper': 800,
          'semi_sleeper': 500
        };
        price = defaultPrices[seatClass] || 400;
      }
    } else {
      price = type === 'flight'
        ? (seatClass === 'business' ? (doc.businessPrice || 5000) : (doc.economyPrice || 3000))
        : doc[priceKey];
    }

    // For existing trains/buses without seat classes, create seats with default class
    if (doc.seats.length > 0 && !doc.seats[0].class) {
      if (type === 'train') {
        // Assign classes to existing seats (distribute evenly)
        const seatClasses = ['1st_ac', '2nd_ac', '3rd_ac', 'sleeper'];
        doc.seats.forEach((seat, index) => {
          seat.class = seatClasses[index % 4];
        });
      } else if (type === 'bus') {
        // Assign classes to existing bus seats
        const seatClasses = ['sleeper', 'semi_sleeper'];
        doc.seats.forEach((seat, index) => {
          seat.class = seatClasses[index % 2];
        });
      }
      await doc.save();
    }

    if (type === 'place') {
      // No seat locking needed for places
    } else if (type === 'hotel') {
      for (const roomNo of seats) {
        const room = doc.rooms.find(r => r.roomNo === roomNo);
        if (!room || room.status !== 'available') return res.status(400).json({ message: `Room ${roomNo} not available` });
        if (room.type !== roomType) return res.status(400).json({ message: `Room ${roomNo} type mismatch` });
      }
      for (const roomNo of seats) {
        const room = doc.rooms.find(r => r.roomNo === roomNo);
        room.status = 'locked';
        room.lockedAt = new Date();
      }
    } else {
      for (const seatNo of seats) {
        const seat = doc.seats.find(s => s.seatNo === seatNo);
        if (!seat || seat.status !== 'available') return res.status(400).json({ message: `Seat ${seatNo} not available` });
        if (type !== 'flight' && seat.class && seat.class !== seatClass) {
          return res.status(400).json({ message: `Seat ${seatNo} class mismatch` });
        }
        if (type === 'flight' && seat.class !== seatClass) {
          return res.status(400).json({ message: `Seat ${seatNo} class mismatch` });
        }
      }
      for (const seatNo of seats) {
        const seat = doc.seats.find(s => s.seatNo === seatNo);
        seat.status = 'locked';
        seat.lockedAt = new Date();
      }
    }
    await doc.save();

    let totalAmount;
    if (type === 'place') {
      totalAmount = (doc.entryFee || 100) * (Number(adults) || 1) + (doc.childFee || 50) * (Number(children) || 0);
    } else {
      totalAmount = type === 'hotel' ? price * seats.length * (guests || 1) : price * seats.length;
    }

    const bookingData = {
      user: req.user._id,
      type,
      [type]: id,
      totalAmount,
      status: 'pending',
    };
    if (type === 'place') {
      bookingData.visitDate = visitDate;
      bookingData.timeSlot = timeSlot;
      bookingData.adults = Number(adults) || 1;
      bookingData.children = Number(children) || 0;
      bookingData.seatClass = undefined;
    } else {
      bookingData.seats = seats;
      bookingData.seatClass = seatClass || undefined;
      if (type === 'hotel') {
        bookingData.roomType = roomType;
        bookingData.guests = guests;
        bookingData.checkIn = checkIn;
        bookingData.checkOut = checkOut;
      }
    }
    const booking = await Booking.create(bookingData);
    res.json({ booking, totalAmount });
  } catch (e) {
    console.error('Booking creation error:', e);
    if (e.name === 'ValidationError') {
      const errors = Object.values(e.errors).map(err => err.message);
      return res.status(400).json({ message: 'Validation failed', errors });
    }
    res.status(500).json({ message: e.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if booking belongs to the user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this booking' });
    }
    
    // Only allow deletion of pending bookings
    if (booking.status === 'paid') {
      return res.status(400).json({ message: 'Cannot delete paid bookings' });
    }
    
    // Release the locked seats
    if (booking.type === 'place') {
      await Booking.findByIdAndDelete(req.params.id);
      return res.json({ message: 'Booking cancelled successfully' });
    }
    let Model;
    if (booking.type === 'train') Model = Train;
    else if (booking.type === 'bus') Model = Bus;
    else if (booking.type === 'flight') Model = Flight;
    else Model = Hotel;
    
    const doc = await Model.findById(booking[booking.type]);
    if (doc) {
      const items = booking.type === 'hotel' ? doc.rooms : doc.seats;
      for (const itemNo of booking.seats) {
        const item = items.find(s => (s.seatNo || s.roomNo) === itemNo);
        if (item && item.status === 'locked') {
          item.status = 'available';
          item.lockedAt = undefined;
        }
      }
      await doc.save();
    }
    
    // Delete the booking
    await Booking.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Booking cancelled successfully' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

export default router;
