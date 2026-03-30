const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getColleges,
  getCollegeById,
  updateStatus,
  createCollegeAdmin,
  registerCollege,
} = require('../controllers/collegeController');

// Public routes
router.post('/register', registerCollege);

// Apply auth middleware to all other routes
router.use(auth);

router.get('/', getColleges);
router.get('/:id', getCollegeById);
router.patch('/:id/status', updateStatus);
router.post('/:id/create-admin', createCollegeAdmin);

module.exports = router;
