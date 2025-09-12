const express = require("express");
const router = express.Router();

const {
  getDashboardSummary,
  getDashboardStats,
  getStudentDashboard,
  getFacultyDashboard,
  listDepartmentStudents,
  getStudentProfileStats,
} = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");

// GET /api/dashboard/faculty/students - list students in faculty's department
router.get("/faculty/students", protect, listDepartmentStudents);

// GET /api/dashboard/faculty/student/:id - get student profile/stats
router.get("/faculty/student/:id", protect, getStudentProfileStats);

// GET /api/dashboard/student
router.get("/student", protect, getStudentDashboard);

// GET /api/dashboard/faculty
router.get("/faculty", protect, getFacultyDashboard);

router.get("/summary", protect, getDashboardSummary);
router.get("/stats", protect, getDashboardStats);

module.exports = router;
