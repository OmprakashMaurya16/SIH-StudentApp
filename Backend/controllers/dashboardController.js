const Activity = require("../models/activityModel");

const getDashboardSummary = async (req, res) => {
  try {
    const studentId = { _id: "68c1a5b2f984b1790e3f95d6" };

    const activities = await Activity.find({
      studentId,
      status: "approved",
    });

    if (!activities || activities.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No approved activities found for this student",
      });
    }

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
      studentId,
      totalActivities,
      creditsEarned,
      activityByType,
      activities,
    });
  } catch (error) {
    console.error("Error in getDashboardSummary:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error while fetching dashboard summary",
    });
  }
};

module.exports = { getDashboardSummary };
