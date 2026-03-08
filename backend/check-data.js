import mongoose from 'mongoose';
import Train from './models/Train.js';
import Bus from './models/Bus.js';
import Flight from './models/Flight.js';

async function checkData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://prakashjha:9HCxyuc9up7KrMw@cluster0.mwessps.mongodb.net/ticket-booking?retryWrites=true&w=majority');
    console.log('Connected to MongoDB');

    // Check current data
    const trains = await Train.find();
    const buses = await Bus.find();
    const flights = await Flight.find();

    console.log(`\n=== CURRENT DATA ===`);
    console.log(`Trains: ${trains.length}`);
    trains.forEach(train => {
      console.log(`- ${train.name} (${train.trainNumber}) - ${train.source} to ${train.destination} - ₹${train.pricePerSeat || train.firstAcPrice || 'N/A'}`);
    });

    console.log(`\nBuses: ${buses.length}`);
    buses.forEach(bus => {
      console.log(`- ${bus.name} (${bus.busNumber}) - ${bus.source} to ${bus.destination} - ₹${bus.pricePerSeat || bus.sleeperPrice || 'N/A'}`);
    });

    console.log(`\nFlights: ${flights.length}`);
    flights.forEach(flight => {
      console.log(`- ${flight.name} (${flight.flightNumber}) - ${flight.source} to ${flight.destination} - ₹${flight.pricePerSeat || flight.economyPrice || 'N/A'}`);
    });

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
  }
}

checkData();
