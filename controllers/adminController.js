const PortalAdmin = require('../models/PortalAdmin');
const College = require('../models/College');

// ─── GET /api/portal-admin/profile ──────────────────────────────────────────
exports.getProfile = async (req, res) => {
  try {
    const admin = await PortalAdmin.findOne({ email: req.admin.email }).select('-password');

    if (!admin) {
      return res.json({
        success: true,
        data: {
          _id: req.admin.id,
          name: req.admin.name,
          email: req.admin.email,
          role: req.admin.role,
          createdAt: new Date(),
        },
      });
    }

    res.json({ success: true, data: admin });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ─── GET /api/portal-admin/logs ─────────────────────────────────────────────
// Aggregates REAL logs from all colleges in DB — no hardcoded data
exports.getActivityLogs = async (req, res) => {
  try {
    const colleges = await College.find({}, 'collegeName logs').lean();

    const allLogs = [];

    colleges.forEach((college) => {
      (college.logs || []).forEach((log) => {
        // Exclude routine VIEWED logs from the portal-level activity feed
        if (log.action !== 'VIEWED') {
          allLogs.push({
            action: log.action,
            message: log.message,
            collegeName: college.collegeName,
            performedBy: log.performedBy,
            timestamp: log.timestamp,
          });
        }
      });
    });

    // Sort latest first
    allLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({ success: true, data: allLogs.slice(0, 30) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
