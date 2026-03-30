const mongoose = require('mongoose');

const collegeAdminSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  generatedUserId: { type: String, required: true, unique: true },
  generatedPassword: { type: String, required: true }, // bcrypt hashed
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CollegeAdmin', collegeAdminSchema, 'collegeadmins');
