const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const collegeRoutes = require('./routes/collegeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const helpRoutes = require('./routes/helpRoutes');

const app = express();

// Middleware
app.use(cors({ 
  origin: ['http://localhost:5173', 'https://admin-campusflow.onrender.com'] 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/colleges', collegeRoutes);
app.use('/api/portal-admin', adminRoutes);
app.use('/api/help', helpRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: '🎓 College ERP API is running', status: 'ok', version: '1.0.0' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas (college_erp)');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });
