# BookTrip – Train / Bus / Flight Ticket Booking (MERN)

Ticket booking website built with **MERN** (MongoDB, Express, React, Node.js), **TailwindCSS**, and **Razorpay**.

## Features

- **Home**: Hero, search form (Train/Bus/Flight tabs), popular routes, features section, CTA
- **Trains**: List with filters (source, destination, date), train details, seat layout, book → checkout
- **Buses**: List with filters, bus details, seat grid (green = available, red = occupied), select seats, total price
- **Flights**: List with filters, flight details, seat class (Economy/Business), seat layout, book now
- **Auth**: Single page Login + Register, JWT in `localStorage`, redirect after login; booking disabled when not logged in
- **ProtectedRoute**: Wraps My Bookings (and any route that requires login)
- **Admin**: Admin login/register, dashboard with sidebar: Add Train/Bus/Flight, Manage Trains/Buses/Flights, Manage Users, Manage Bookings, Revenue stats
- **Seat logic**: Select seat → check availability → lock seat → create booking → on payment success → mark seat booked
- **Razorpay**: Pay Now → backend creates order → frontend opens Razorpay popup → on success verify signature → save booking, update seat status

## Setup

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env: MONGODB_URI, JWT_SECRET, RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET
npm install
npm run dev
```

Runs at `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
# Optional: create .env with VITE_RAZORPAY_KEY_ID=rzp_test_xxx (or backend sends it)
npm run dev
```

Runs at `http://localhost:3000` with API proxy to backend.

### MongoDB

Have MongoDB running locally (or set `MONGODB_URI` in backend `.env`).

### Razorpay

1. Create a Razorpay account and get test **Key ID** and **Key Secret**.
2. Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in backend `.env`.
3. Optionally set `VITE_RAZORPAY_KEY_ID` in frontend `.env` for the checkout script.

## Scripts

- **Backend**: `npm run dev` (watch), `npm start`
- **Frontend**: `npm run dev`, `npm run build`, `npm run preview`
