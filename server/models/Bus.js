import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  seatNo: { type: String, required: true },
  class: { type: String, enum: ['sleeper', 'semi_sleeper'], required: true },
  status: { type: String, enum: ['available', 'booked', 'locked'], default: 'available' },
  lockedAt: Date,
});

const busSchema = new mongoose.Schema({
  name: { type: String, required: true },
  busNumber: { type: String, required: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  date: { type: Date, required: true },
  totalSeats: { type: Number, default: 36 },
  seats: [seatSchema],
  // Different prices for different classes (with backward compatibility)
  pricePerSeat: { type: Number }, // Legacy field for backward compatibility
  sleeperPrice: { type: Number },
  semiSleeperPrice: { type: Number },
}, { timestamps: true });

busSchema.pre('save', function (next) {
  if (this.seats.length === 0 && this.totalSeats) {
    // Create seats for each class (18 seats per class)
    for (let i = 1; i <= 18; i++) {
      this.seats.push({ seatNo: `SL-${i}`, class: 'sleeper', status: 'available' });
    }
    for (let i = 1; i <= 18; i++) {
      this.seats.push({ seatNo: `SSL-${i}`, class: 'semi_sleeper', status: 'available' });
    }
  }
  next();
});

export default mongoose.model('Bus', busSchema);
