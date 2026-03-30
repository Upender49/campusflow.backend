const HelpQuery = require('../models/HelpQuery');

// ─── GET /api/help ─────────────────────────────────────────────────────────────
exports.getQueries = async (req, res) => {
  try {
    // Optionally allow filtering by status in the future (e.g. ?status=Pending)
    const { status } = req.query;
    const filter = status ? { status } : {};

    // Sort by newest first
    const queries = await HelpQuery.find(filter).sort({ createdAt: -1 });

    res.json({ success: true, count: queries.length, data: queries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
