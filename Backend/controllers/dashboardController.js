const Activity = require("../models/activityModel");

const getDashboardSummary = async (req, res) => {
  try {
    const activities = await Activity.find({
      studentId: req.user._id,
      status: "approved",
    });

    const totalActivities = activities.length;
    const creditsEarned = activities.reduce(
      (sum, curr) => sum + (curr.credit || 1),
      0
    );

    const activityByType = activities.reduce((map, curr) => {
      const type = curr.activityType || "unknown";
      map[type] = (map[type] || 0) + 1;
      return map;
    }, {});

    res.status(200).json({
      success: true,
      message: "Dashboard summary fetched successfully",
      data: { totalActivities, creditsEarned, activityByType, activities },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const approved = await Activity.countDocuments({
      studentId: req.user._id,
      status: "approved",
    });

    const pending = await Activity.countDocuments({
      studentId: req.user._id,
      status: "pending",
    });

    const rejected = await Activity.countDocuments({
      studentId: req.user._id,
      status: "rejected",
    });

    res.status(200).json({
      success: true,
      message: "Dashboard stats fetched successfully",
      data: { approved, pending, rejected },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardSummary, getDashboardStats };
