import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  seatNo: { type: String, required: true },
  class: { type: String, enum: ['1st_ac', '2nd_ac', '3rd_ac', 'sleeper'], required: true },
  status: { type: String, enum: ['available', 'booked', 'locked'], default: 'available' },
  lockedAt: Date,
});

const trainSchema = new mongoose.Schema({
  name: { type: String, required: true },
  trainNumber: { type: String, required: true, unique: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  date: { type: Date, required: true },
  totalSeats: { type: Number, default: 40 },
  seats: [seatSchema],
  // Different prices for different classes (with backward compatibility)
  pricePerSeat: { type: Number }, // Legacy field for backward compatibility
  firstAcPrice: { type: Number },
  secondAcPrice: { type: Number },
  thirdAcPrice: { type: Number },
  sleeperPrice: { type: Number },
}, { timestamps: true });

trainSchema.pre('save', function (next) {
  if (this.seats.length === 0 && this.totalSeats) {
    // Create seats for each class (10 seats per class)
    for (let i = 1; i <= 10; i++) {
      this.seats.push({ seatNo: `1AC-${i}`, class: '1st_ac', status: 'available' });
    }
    for (let i = 1; i <= 10; i++) {
      this.seats.push({ seatNo: `2AC-${i}`, class: '2nd_ac', status: 'available' });
    }
    for (let i = 1; i <= 10; i++) {
      this.seats.push({ seatNo: `3AC-${i}`, class: '3rd_ac', status: 'available' });
    }
    for (let i = 1; i <= 10; i++) {
      this.seats.push({ seatNo: `SL-${i}`, class: 'sleeper', status: 'available' });
    }
  }
  next();
});

export default mongoose.model('Train', trainSchema);
