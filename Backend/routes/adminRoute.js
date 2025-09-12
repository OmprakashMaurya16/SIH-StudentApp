const express = require("express");
const router = express.Router();

const {
  getPendingActivities,
  approveActivity,
  rejectActivity,
  getAdminStats,
  getAdminReportsDashboard,
} = require("../controllers/adminController");
const { protect, adminAndFaculty } = require("../middleware/authMiddleware");

// GET /api/admin/reports/dashboard?from=YYYY-MM-DD&to=YYYY-MM-DD&department=all|<department>
router.get("/reports/dashboard", protect, adminAndFaculty, getAdminReportsDashboard);
// GET /api/admin/stats
router.get("/stats", protect, adminAndFaculty, getAdminStats);

router.get(
  "/activities/pending",
  protect,
  adminAndFaculty,
  getPendingActivities
);

router.put(
  "/activities/:id/approve",
  protect,
  adminAndFaculty,
  approveActivity
);

router.put("/activities/:id/reject", protect, adminAndFaculty, rejectActivity);

module.exports = router;
