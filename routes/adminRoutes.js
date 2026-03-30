const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getProfile, getActivityLogs } = require('../controllers/adminController');

router.use(auth);

router.get('/profile', getProfile);
router.get('/logs', getActivityLogs);

module.exports = router;
