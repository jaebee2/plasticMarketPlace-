// server.js
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // for JSON body parsing

// Import routes
const userRoutes = require('./routes/users');
const listingRoutes = require('./routes/listings');
const reservationRoutes = require('./routes/reservations');
const paymentRoutes = require('./routes/payments');
const ratingRoutes = require('./routes/ratings');

// Use routes
app.use('/users', userRoutes);
app.use('/listings', listingRoutes);
app.use('/reservations', reservationRoutes);
app.use('/payments', paymentRoutes);
app.use('/ratings', ratingRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
