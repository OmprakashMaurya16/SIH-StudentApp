const express = require("express");
const {
  getDashboardSummary,
  getDashboardStats,
} = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/summary", protect, getDashboardSummary);
router.get("/stats", protect, getDashboardStats);

module.exports = router;
