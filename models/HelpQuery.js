const mongoose = require('mongoose');

const helpQuerySchema = new mongoose.Schema({
  collegeName: {
    type: String,
    required: true,
  },
  queryTitle: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Resolved'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('HelpQuery', helpQuerySchema);
