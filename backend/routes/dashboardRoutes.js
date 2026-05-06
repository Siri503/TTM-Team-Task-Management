const express = require('express');
const { getDashboardStats, getProjectStats } = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, getDashboardStats);
router.get('/project/:projectId', auth, getProjectStats);

module.exports = router;
