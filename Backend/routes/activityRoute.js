const express = require("express");
const {
  createActivity,
  getMyActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
  getActivityStatus,
} = require("../controllers/activityController");
const { protect } = require("../middleware/authMiddleware");
const parser = require("../middleware/upload");

const router = express.Router();

router.use(protect);

router.post("/", parser.single("proof"), createActivity);

router.get("/", getMyActivities);

router.get("/:id", getActivityById);

router.put("/:id", updateActivity);

router.delete("/:id", deleteActivity);

router.get("/:id/status", getActivityStatus);

module.exports = router;
