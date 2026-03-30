const express = require('express');
const { getQueries } = require('../controllers/helpController');
const auth = require('../middleware/auth');

const router = express.Router();

// Option to protect or keep public. Based on logic, this is for admin to view queries.
router.use(auth);

router.get('/', getQueries);

module.exports = router;
