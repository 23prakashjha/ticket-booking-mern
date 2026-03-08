import mongoose from 'mongoose';
import Booking from './models/Booking.js';

async function cleanBookings() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://prakashjha:9HCxyuc9up7KrMw@cluster0.mwessps.mongodb.net/ticket-booking?retryWrites=true&w=majority');
    console.log('Connected to MongoDB');

    // Delete all bookings that might have invalid seatClass values
    const result = await Booking.deleteMany({});
    console.log(`Deleted ${result.deletedCount} existing bookings to clean up validation issues`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    console.log('Booking cleanup completed. Please try booking again.');
  } catch (error) {
    console.error('Error:', error);
  }
}

cleanBookings();
