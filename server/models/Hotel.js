import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomNo: { type: String, required: true },
  type: { type: String, enum: ['single', 'double', 'suite', 'dormitory'], required: true },
  price: { type: Number, required: true },
  capacity: { type: Number, default: 1 },
  status: { type: String, enum: ['available', 'booked', 'locked'], default: 'available' },
  lockedAt: Date,
});

const hotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String },
  amenities: [{ type: String }],
  rating: { type: Number, default: 4.0, min: 0, max: 5 },
  image: { type: String, default: '🏨' },
  totalRooms: { type: Number, default: 20 },
  rooms: [roomSchema],
  singlePrice: { type: Number },
  doublePrice: { type: Number },
  suitePrice: { type: Number },
  dormitoryPrice: { type: Number },
  checkInTime: { type: String, default: '14:00' },
  checkOutTime: { type: String, default: '11:00' },
}, { timestamps: true });

hotelSchema.pre('save', function (next) {
  if (this.rooms.length === 0 && this.totalRooms) {
    for (let i = 1; i <= 5; i++) this.rooms.push({ roomNo: `S-${i}`, type: 'single', price: this.singlePrice || 1500, capacity: 1, status: 'available' });
    for (let i = 1; i <= 5; i++) this.rooms.push({ roomNo: `D-${i}`, type: 'double', price: this.doublePrice || 2500, capacity: 2, status: 'available' });
    for (let i = 1; i <= 5; i++) this.rooms.push({ roomNo: `SU-${i}`, type: 'suite', price: this.suitePrice || 5000, capacity: 4, status: 'available' });
    for (let i = 1; i <= 5; i++) this.rooms.push({ roomNo: `DO-${i}`, type: 'dormitory', price: this.dormitoryPrice || 800, capacity: 1, status: 'available' });
  }
  next();
});

export default mongoose.model('Hotel', hotelSchema);
