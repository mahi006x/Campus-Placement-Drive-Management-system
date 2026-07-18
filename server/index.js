const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors({ origin: '*' })); // Enable all CORS for simple client-server cross communication
app.use(express.json());

// Main Router Declarations
app.use('/api/auth', require('./routes/auth'));
app.use('/api/drives', require('./routes/drives'));
app.use('/api/registrations', require('./routes/registrations'));

// Route not found fallback
app.use((req, res, next) => {
  res.status(404).json({ message: 'API Endpoint Not Found' });
});

// Centralized express error handler
app.use((err, req, res, next) => {
  console.error('Express Error boundary caught:', err.stack);
  res.status(500).json({
    message: err.message || 'An unexpected server error occurred',
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
