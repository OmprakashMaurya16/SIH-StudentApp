const express = require("express");
const {
  getPendingActivities,
  approveActivity,
  rejectActivity,
} = require("../controllers/adminController");
const { protect, adminAndFaculty } = require("../middleware/authMiddleware");

const router = express.Router();

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
