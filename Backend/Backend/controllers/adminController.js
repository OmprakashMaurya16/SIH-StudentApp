const Activity = require("../models/activityModel");

const getPendingActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ status: "pending" }).populate(
      "studentId",
      "fullName email rollNo"
    );
    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const approveActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res
        .status(404)
        .json({ success: false, message: "Activity not found" });
    }

    if (activity.status !== "pending") {
      return res
        .status(400)
        .json({ success: false, message: "Activity is not pending" });
    }

    activity.status = "approved";
    activity.validation.facultyId = req.user._id;
    activity.validation.validatedAt = new Date();

    const updatedActivity = await activity.save();
    res.status(200).json({ success: true, data: updatedActivity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const rejectActivity = async (req, res) => {
  const { validationComment } = req.body;
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res
        .status(404)
        .json({ success: false, message: "Activity not found" });
    }

    if (activity.status !== "pending") {
      return res
        .status(400)
        .json({ success: false, message: "Activity is not pending" });
    }

    activity.status = "rejected";
    activity.validation.facultyId = req.user._id;
    activity.validation.validatedAt = new Date();
    activity.validation.validationComment =
      validationComment || "Rejected by faculty/admin";

    const updatedActivity = await activity.save();
    res.status(200).json({ success: true, data: updatedActivity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getActivityStatus = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id).populate(
      "validation.facultyId",
      "fullName email"
    );

    if (!activity) {
      return res
        .status(404)
        .json({ success: false, message: "Activity not found" });
    }

    if (activity.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this activity status",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        status: activity.status,
        validation: activity.validation,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPendingActivities,
  approveActivity,
  rejectActivity,
  getActivityStatus,
};
