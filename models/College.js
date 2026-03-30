const mongoose = require('mongoose');

const campusSchema = new mongoose.Schema({
  campusName: { type: String, trim: true },
  addressLine: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  pincode: { type: String, trim: true },
  latitude: { type: String },
  longitude: { type: String },
});

const contactPersonSchema = new mongoose.Schema({
  prefix: { type: String, trim: true },
  firstName: { type: String, trim: true },
  lastName: { type: String, trim: true },
  gender: { type: String, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phones: [{ type: String }],
  landlines: [{ type: String }],
});

const logSchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ['CREATED', 'VIEWED', 'APPROVED', 'REJECTED', 'ADMIN_CREATED'],
    required: true,
  },
  message: { type: String },           // human-readable description
  performedBy: { type: String, default: 'System' },
  timestamp: { type: Date, default: Date.now },
});

const collegeSchema = new mongoose.Schema(
  {
    // Basic Info
    collegeName: { type: String, required: true, trim: true },
    category: { type: String, trim: true },
    codeType: { type: String, trim: true },
    code: { type: String, trim: true },
    affiliatedTo: { type: String, trim: true },
    naacGrade: { type: String, trim: true },
    nirfRanking: { type: String },
    domain: { type: String, trim: true },
    establishedYear: { type: Number },
    websites: [{ type: String }],

    // Address
    campuses: [campusSchema],

    // Contact
    phones: [{ type: String }],
    landlines: [{ type: String }],

    // Contact Persons
    contactPersons: [contactPersonSchema],

    // Documents
    logoUrl: { type: String },           // legacy URL
    logo: { type: String },              // asset filename e.g. "ou_logo.png"


    // Status
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },

    // Logs
    logs: [logSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('College', collegeSchema, 'colleges');
