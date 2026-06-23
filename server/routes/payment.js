import express from 'express';
import Stripe from 'stripe';
import Booking from '../models/Booking.js';
import Train from '../models/Train.js';
import Bus from '../models/Bus.js';
import Flight from '../models/Flight.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Check if Stripe keys are properly configured
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY;

if (!stripeSecretKey || stripeSecretKey.includes('your_stripe_secret_key_here')) {
  console.warn('⚠️  Stripe Secret Key not configured. Using mock mode for development.');
}

if (!stripePublishableKey || stripePublishableKey.includes('your_stripe_publishable_key_here')) {
  console.warn('⚠️  Stripe Publishable Key not configured. Using mock mode for development.');
}

const stripe = stripeSecretKey && !stripeSecretKey.includes('your_stripe_secret_key_here') 
  ? new Stripe(stripeSecretKey) 
  : null;

router.post('/create-checkout-session', protect, async (req, res) => {
  try {
    const { bookingId, amount, customerEmail, customerName } = req.body;
    
    // Find and validate booking
    const booking = await Booking.findOne({ _id: bookingId, user: req.user._id, status: 'pending' });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Mock mode for development when Stripe keys are not configured
    if (!stripe) {
      console.log('🔧 Using mock Stripe session for development');
      const mockSessionId = `cs_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await Booking.findByIdAndUpdate(bookingId, { 
        stripeSessionId: mockSessionId,
        stripePaymentIntentId: `pi_test_${Date.now()}` 
      });

      return res.json({ 
        sessionId: mockSessionId,
        mock: true,
        message: 'Mock session created - configure Stripe keys for real payments'
      });
    }

    // Create real Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: {
            name: `${booking.type.charAt(0).toUpperCase() + booking.type.slice(1)} Ticket`,
            description: `Booking ID: ${bookingId}`,
            images: [],
          },
          unit_amount: Math.round(booking.totalAmount * 100), // Convert to paise
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/payment/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
      cancel_url: `${req.protocol}://${req.get('host')}/payment/cancel?booking_id=${bookingId}`,
      metadata: {
        bookingId: bookingId,
        userId: req.user._id.toString(),
      },
    });

    // Update booking with Stripe session ID
    await Booking.findByIdAndUpdate(bookingId, { 
      stripeSessionId: session.id,
      stripePaymentIntentId: session.payment_intent 
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe session creation error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Legacy endpoint for backward compatibility
router.post('/create-order', protect, async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findOne({ _id: bookingId, user: req.user._id, status: 'pending' });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Mock mode for development
    if (!stripe) {
      console.log('🔧 Using mock Stripe order for development');
      const mockSessionId = `cs_test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await Booking.findByIdAndUpdate(bookingId, { stripeSessionId: mockSessionId });
      
      return res.json({ 
        sessionId: mockSessionId, 
        amount: Math.round(booking.totalAmount * 100),
        key: stripePublishableKey || 'pk_test_mock_key',
        mock: true,
        message: 'Mock order created - configure Stripe keys for real payments'
      });
    }

    // Create real Stripe checkout session for backward compatibility
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: {
            name: `${booking.type.charAt(0).toUpperCase() + booking.type.slice(1)} Ticket`,
            description: `Booking ID: ${bookingId}`,
          },
          unit_amount: Math.round(booking.totalAmount * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/payment/success?session_id={CHECKOUT_SESSION_ID}&booking_id=${bookingId}`,
      cancel_url: `${req.protocol}://${req.get('host')}/payment/cancel?booking_id=${bookingId}`,
      metadata: {
        bookingId: bookingId,
        userId: req.user._id.toString(),
      },
    });

    await Booking.findByIdAndUpdate(bookingId, { stripeSessionId: session.id });
    
    res.json({ 
      sessionId: session.id, 
      amount: session.amount_total,
      key: stripePublishableKey 
    });
  } catch (error) {
    console.error('Stripe order creation error:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  // Mock webhook handling when Stripe is not configured
  if (!stripe) {
    console.log('🔧 Mock webhook received - configure Stripe keys for real webhooks');
    return res.json({ received: true, mock: true });
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET || 'whsec_your_webhook_secret');
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Find booking using session metadata
    const booking = await Booking.findOne({ 
      stripeSessionId: session.id,
      user: session.metadata.userId 
    });
    
    if (!booking) {
      console.log('Booking not found for session:', session.id);
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Update booking status
    booking.status = 'paid';
    booking.stripePaymentId = session.payment_intent;
    booking.stripeCustomerId = session.customer;
    booking.paidAt = new Date();
    await booking.save();

    // Update seat status
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

    console.log('Payment successful for booking:', booking._id);
  }

  res.json({ received: true });
});

// Legacy verify endpoint for backward compatibility
router.post('/verify', protect, async (req, res) => {
  try {
    const { sessionId } = req.body;
    const booking = await Booking.findOne({ stripeSessionId: sessionId, user: req.user._id });
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Mock verification when Stripe is not configured
    if (!stripe) {
      console.log('🔧 Using mock payment verification for development');
      booking.status = 'paid';
      booking.paidAt = new Date();
      await booking.save();

      // Update seat status
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

      return res.json({ 
        success: true, 
        booking,
        mock: true,
        message: 'Mock payment verified - configure Stripe keys for real payments'
      });
    }

    // Retrieve real checkout session to verify payment
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === 'paid') {
      booking.status = 'paid';
      booking.stripePaymentId = session.payment_intent;
      booking.paidAt = new Date();
      await booking.save();

      // Update seat status
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
    } else {
      res.status(400).json({ message: 'Payment not completed' });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
