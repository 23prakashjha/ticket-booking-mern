import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Booking from '../models/Booking.js';
import Train from '../models/Train.js';
import Bus from '../models/Bus.js';
import Flight from '../models/Flight.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

if (!key_id || !key_secret) {
  console.error('RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET is not set. Payment orders will fail.');
}

const razorpay = new Razorpay({
  key_id: key_id || 'rzp_test_xxxxxxxxxx',
  key_secret: key_secret || 'xxxxxxxxxxxxxx',
});

router.post('/create-order', protect, async (req, res) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) return res.status(400).json({ message: 'bookingId is required' });

    const booking = await Booking.findOne({ _id: bookingId, user: req.user._id, status: 'pending' });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    const amount = Math.round(booking.totalAmount * 100);
    if (!amount || amount < 100) {
      return res.status(400).json({ message: 'Invalid booking amount' });
    }

    const options = {
      amount,
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
      key: key_id,
    });
  } catch (error) {
    const msg = error?.error?.description || error?.message || error || 'Payment order creation failed';
    console.error('Razorpay order creation error:', msg);
    res.status(500).json({ message: msg });
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
      .createHmac('sha256', key_secret || 'xxxxxxxxxxxxxx')
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
    res.status(500).json({ message: error?.error?.description || error?.message || 'Payment verification failed' });
  }
});

export default router;
