import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  seatNo: { type: String, required: true },
  class: { type: String, enum: ['economy', 'business'], default: 'economy' },
  status: { type: String, enum: ['available', 'booked', 'locked'], default: 'available' },
  lockedAt: Date,
});

const flightSchema = new mongoose.Schema({
  name: { type: String, required: true },
  flightNumber: { type: String, required: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  departureTime: { type: String, required: true },
  arrivalTime: { type: String, required: true },
  date: { type: Date, required: true },
  economyPrice: { type: Number, required: true },
  businessPrice: { type: Number, required: true },
  totalSeats: { type: Number, default: 60 },
  seats: [seatSchema],
}, { timestamps: true });

flightSchema.pre('save', function (next) {
  if (this.seats.length === 0 && this.totalSeats) {
    const half = Math.floor(this.totalSeats / 2);
    for (let i = 1; i <= this.totalSeats; i++) {
      this.seats.push({
        seatNo: `F${i}`,
        class: i <= half ? 'economy' : 'business',
        status: 'available',
      });
    }
  }
  next();
});

export default mongoose.model('Flight', flightSchema);
