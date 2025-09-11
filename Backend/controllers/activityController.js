const Activity = require("../models/activityModel");

const createActivity = async (req, res) => {
  const { activityType, title, description, date, proof } = req.body;
  try {
    const newActivity = await Activity.create({
      studentId: req.user._id,
      activityType,
      title,
      description,
      date,
      proof,
    });
    res.status(201).json({ success: true, data: newActivity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ studentId: req.user._id });
    res.status(200).json({ success: true, data: activities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res
        .status(404)
        .json({ success: false, message: "Activity not found" });
    }
    if (activity.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this activity",
      });
    }
    res.status(200).json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateActivity = async (req, res) => {
  const { activityType, title, description, date, proof } = req.body;
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res
        .status(404)
        .json({ success: false, message: "Activity not found" });
    }
    if (activity.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this activity",
      });
    }
    if (activity.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Cannot update an approved activity",
      });
    }

    activity.activityType = activityType || activity.activityType;
    activity.title = title || activity.title;
    activity.description = description || activity.description;
    activity.date = date || activity.date;
    activity.proof = proof || activity.proof;

    const updatedActivity = await activity.save();
    res.status(200).json({ success: true, data: updatedActivity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteActivity = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res
        .status(404)
        .json({ success: false, message: "Activity not found" });
    }
    if (activity.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this activity",
      });
    }
    if (activity.status === "approved") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete an approved activity",
      });
    }

    await activity.deleteOne();
    res.status(200).json({ success: true, message: "Activity removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getActivityStatus = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id);
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
  createActivity,
  getMyActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
  getActivityStatus,
};
