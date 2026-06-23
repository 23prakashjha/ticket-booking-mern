import mongoose from 'mongoose';

const placeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String },
  description: { type: String },
  category: { type: String, enum: ['historical', 'nature', 'adventure', 'religious', 'beach', 'hill_station', 'cultural', 'amusement', 'museum', 'other'], default: 'other' },
  image: { type: String, default: '🏛️' },
  rating: { type: Number, default: 4.0, min: 0, max: 5 },
  entryFee: { type: Number, default: 100 },
  childFee: { type: Number, default: 50 },
  openingTime: { type: String, default: '09:00' },
  closingTime: { type: String, default: '18:00' },
  bestTime: { type: String },
  duration: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

placeSchema.index({ city: 1, category: 1 });

export default mongoose.model('Place', placeSchema);
