const express = require("express");
const router = express.Router();

const {
  getPendingActivities,
  approveActivity,
  rejectActivity,
} = require("../controllers/adminController");
const { protect, adminAndFaculty } = require("../middleware/authMiddleware");

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
