const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getColleges,
  getCollegeById,
  updateStatus,
  createCollegeAdmin,
} = require('../controllers/collegeController');

// Protected routes only — auth required for all
router.use(auth);

router.get('/', getColleges);
router.get('/:id', getCollegeById);
router.patch('/:id/status', updateStatus);
router.post('/:id/create-admin', createCollegeAdmin);

module.exports = router;
