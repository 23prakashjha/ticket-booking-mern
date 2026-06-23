import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['train', 'bus', 'flight', 'hotel', 'place'], required: true },
  train: { type: mongoose.Schema.Types.ObjectId, ref: 'Train' },
  bus: { type: mongoose.Schema.Types.ObjectId, ref: 'Bus' },
  flight: { type: mongoose.Schema.Types.ObjectId, ref: 'Flight' },
  hotel: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' },
  place: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
  seats: [{ type: String }],
  seatClass: { 
    type: String, 
    enum: ['economy', 'business', '1st_ac', '2nd_ac', '3rd_ac', 'sleeper', 'semi_sleeper', 'single', 'double', 'suite', 'dormitory'],
    required: false
  },
  roomType: { type: String },
  guests: { type: Number },
  checkIn: { type: Date },
  checkOut: { type: Date },
  visitDate: { type: Date },
  timeSlot: { type: String },
  adults: { type: Number },
  children: { type: Number },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' },
  // Stripe payment fields
  stripeSessionId: String,
  stripePaymentId: String,
  stripeCustomerId: String,
  paidAt: { type: Date },
  // Legacy Razorpay fields for backward compatibility
  razorpayOrderId: String,
  razorpayPaymentId: String,
  razorpaySignature: String,
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
