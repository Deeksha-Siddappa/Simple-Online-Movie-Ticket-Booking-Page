require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
// Middleware
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
// Connect to MongoDB
const dbURI = process.env.MONGO_URI;


 // Replace 'my-node-project' with your database name
mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Movie Schema
const bookingSchema = new mongoose.Schema({
    movie: String,
    date: String,
    theater: String,
    seats: [Number],
    price: Number
});
const Booking = mongoose.model('Booking', bookingSchema);
// Routes
app.post('/api/book_ticket', async (req, res) => {
    const { movie, date, theater, seats, price } = req.body;
    try {
        const newBooking = new Booking({ movie, date, theater, seats, price });
        await newBooking.save();
        res.status(201).json({ message: 'Booking confirmed' }); // ✅ proper JSON response
    } catch (err) {
        res.status(400).json({ error: err.message }); // ✅ proper JSON error
    }
});

// Catch-all route to serve index.html for any other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
// Start Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
