// Admin Reports Dashboard: total activities, active students, credits awarded, pending review
const getAdminReportsDashboard = async (req, res) => {
  try {
    const { from, to, department } = req.query;
    const activityFilter = {};
    const userFilter = { role: "student" };
    if (from && to) {
      activityFilter.date = { $gte: new Date(from), $lte: new Date(to) };
    }
    if (department && department !== "all") {
      userFilter.department = department;
    }
    // Get students (optionally filtered by department)
    const students = await User.find(userFilter).select("_id");
    const studentIds = students.map(s => s._id);
    if (studentIds.length > 0) {
      activityFilter.studentId = { $in: studentIds };
    }

    // Total activities
    const totalActivities = await Activity.countDocuments(activityFilter);

    // Active students (students with at least one activity in filter)
    const activeStudents = await Activity.distinct("studentId", activityFilter);
    const activeStudentsCount = activeStudents.length;

    // Credits awarded (sum of credit field for approved activities)
    const approvedActivities = await Activity.find({ ...activityFilter, status: "approved" });
    const creditsAwarded = approvedActivities.reduce((sum, a) => sum + (a.credit || 1), 0);

    // Pending review (activities with status 'pending')
    const pendingReview = await Activity.countDocuments({ ...activityFilter, status: "pending" });

    res.status(200).json({
      success: true,
      data: {
        totalActivities,
        activeStudents: activeStudentsCount,
        creditsAwarded,
        pendingReview,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
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


const User = require("../models/userModel");

// Admin dashboard stats: total users, students, faculties, activities
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalFaculties = await User.countDocuments({ role: "faculty" });
    const totalActivities = await Activity.countDocuments();
    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalStudents,
        totalFaculties,
        totalActivities,
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
  getAdminStats,
  getAdminReportsDashboard,
};
