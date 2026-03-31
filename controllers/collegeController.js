const College = require('../models/College');
const CollegeAdmin = require('../models/CollegeAdmin');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// ─── GET /api/colleges?status= ────────────────────────────────────────────────
exports.getColleges = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};

    const colleges = await College.find(filter)
      .select('collegeName category code codeType status naacGrade nirfRanking affiliatedTo logo logoUrl createdAt')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: colleges.length, data: colleges });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/colleges/:id ────────────────────────────────────────────────────
exports.getCollegeById = async (req, res) => {
  try {
    const college = await College.findById(req.params.id);
    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found' });
    }

    // Append VIEWED log to DB
    college.logs.push({
      action: 'VIEWED',
      message: `College profile viewed by portal admin ${req.admin.name}`,
      performedBy: req.admin.name,
      timestamp: new Date(),
    });
    await college.save();

    // Check if admin already created
    const adminExists = await CollegeAdmin.findOne({ collegeId: college._id });

    res.json({
      success: true,
      data: college,
      adminCreated: !!adminExists,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── PATCH /api/colleges/:id/status ──────────────────────────────────────────
exports.updateStatus = async (req, res) => {
  try {
    const { status, reason } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be approved or rejected' });
    }

    const college = await College.findById(req.params.id);
    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found' });
    }

    if (college.status === status) {
      return res.status(400).json({ success: false, message: `College is already ${status}` });
    }

    college.status = status;
    college.logs.push({
      action: status === 'approved' ? 'APPROVED' : 'REJECTED',
      message: reason
        ? `${status === 'approved' ? 'Approved' : 'Rejected'} by ${req.admin.name}. Reason: ${reason}`
        : `College ${status} by portal admin ${req.admin.name}`,
      performedBy: req.admin.name,
      timestamp: new Date(),
    });

    await college.save();

    res.json({
      success: true,
      message: `College has been ${status} successfully`,
      data: { status: college.status },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── POST /api/colleges/:id/create-admin ─────────────────────────────────────
exports.createCollegeAdmin = async (req, res) => {
  try {
    const { contactPersonIndex } = req.body;

    const college = await College.findById(req.params.id);
    if (!college) {
      return res.status(404).json({ success: false, message: 'College not found' });
    }

    if (college.status !== 'approved') {
      return res.status(400).json({
        success: false,
        message: 'College must be approved before creating an admin',
      });
    }

    const idx = parseInt(contactPersonIndex, 10);
    const contactPerson = college.contactPersons[idx];
    if (!contactPerson) {
      return res.status(400).json({ success: false, message: 'Invalid contact person selected' });
    }

    // Check duplicate admin for this college
    const existing = await CollegeAdmin.findOne({ collegeId: college._id });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An admin has already been created for this college',
      });
    }

    // Generate secure credentials
    const prefix = college.code ? college.code.toUpperCase().slice(0, 4) : 'CA';
    const uniquePart = crypto.randomBytes(3).toString('hex').toUpperCase();
    const userId = `${prefix}${Date.now().toString(36).toUpperCase().slice(-4)}${uniquePart}`;
    const plainPassword =
      crypto.randomBytes(6).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 8) +
      Math.floor(10 + Math.random() * 90) +
      '!';
    const hashedPassword = await bcrypt.hash(plainPassword, 12);

    const adminName = [contactPerson.prefix, contactPerson.firstName, contactPerson.lastName]
      .filter(Boolean)
      .join(' ');

    await CollegeAdmin.create({
      name: adminName,
      email: contactPerson.email,
      generatedUserId: userId,
      generatedPassword: hashedPassword,
      collegeId: college._id,
    });

    // Append ADMIN_CREATED log
    college.logs.push({
      action: 'ADMIN_CREATED',
      message: `Admin account created for ${adminName} (${contactPerson.email}) — UserID: ${userId}`,
      performedBy: req.admin.name,
      timestamp: new Date(),
    });
    await college.save();

    res.status(201).json({
      success: true,
      message: 'College admin created successfully. Save these credentials — shown only once!',
      credentials: {
        userId,
        password: plainPassword,
        name: adminName,
        email: contactPerson.email,
        collegeName: college.collegeName,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


