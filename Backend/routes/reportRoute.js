const express = require('express');
const router = express.Router();

const { generateActivityReportPDF, generateActivityReportExcel } = require('../controllers/reportController');
const { protect, adminAndFaculty } = require('../middleware/authMiddleware');

// GET /api/reports/excel?from=YYYY-MM-DD&to=YYYY-MM-DD&activityType=all|conference|workshop|competition|volunteering|other
router.get('/excel', protect, adminAndFaculty, generateActivityReportExcel);

// GET /api/reports/pdf?from=YYYY-MM-DD&to=YYYY-MM-DD&activityType=all|conference|workshop|competition|volunteering|other
router.get('/pdf', protect, adminAndFaculty, generateActivityReportPDF);

module.exports = router;
