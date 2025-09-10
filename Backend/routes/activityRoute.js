const express = require("express");
const router = express.Router();

const {
  createActivity,
  getMyActivities,
  getActivityStatus,
} = require("../controllers/activityController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createActivity);

router.get("/my", protect, getMyActivities);

router.get("/:id/status", protect, getActivityStatus);

module.exports = router;
