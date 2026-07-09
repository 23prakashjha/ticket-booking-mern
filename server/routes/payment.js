import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Booking from '../models/Booking.js';
import Train from '../models/Train.js';
import Bus from '../models/Bus.js';
import Flight from '../models/Flight.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_xxxxxxxxxx',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'xxxxxxxxxxxxxx',
});

router.post('/create-order', protect, async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findOne({ _id: bookingId, user: req.user._id, status: 'pending' });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const options = {
      amount: Math.round(booking.totalAmount * 100),
      currency: 'INR',
      receipt: `booking_${bookingId}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    await Booking.findByIdAndUpdate(bookingId, { razorpayOrderId: order.id });

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_xxxxxxxxxx',
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/verify', protect, async (req, res) => {
  try {
    const { orderId, paymentId, signature } = req.body;
    const booking = await Booking.findOne({ razorpayOrderId: orderId, user: req.user._id });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'xxxxxxxxxxxxxx')
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (expectedSignature !== signature) {
      return res.status(400).json({ message: 'Payment verification failed - invalid signature' });
    }

    booking.status = 'paid';
    booking.razorpayPaymentId = paymentId;
    booking.razorpaySignature = signature;
    booking.paidAt = new Date();
    await booking.save();

    let Model;
    if (booking.type === 'train') Model = Train;
    else if (booking.type === 'bus') Model = Bus;
    else Model = Flight;

    const doc = await Model.findById(booking[booking.type]);
    if (doc) {
      for (const seatNo of booking.seats) {
        const seat = doc.seats.find(s => s.seatNo === seatNo);
        if (seat) {
          seat.status = 'booked';
          seat.lockedAt = undefined;
        }
      }
      await doc.save();
    }

    res.json({ success: true, booking });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
