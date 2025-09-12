// List students in faculty's department
const listDepartmentStudents = async (req, res) => {
  try {
    const department = req.user.department;
    const students = await User.find({ role: "student", department }).select("_id fullName email rollNo course year department");
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get student profile and activity stats for faculty view
const getStudentProfileStats = async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await User.findOne({ _id: studentId, role: "student" }).select("_id fullName email rollNo course year department profile");
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    // Only allow faculty from same department
    if (student.department !== req.user.department) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }
    const activities = await Activity.find({ studentId }).sort({ date: -1 });
    const totalActivities = activities.length;
    const approved = activities.filter(a => a.status === "approved").length;
    const pending = activities.filter(a => a.status === "pending").length;
    const credits = activities.filter(a => a.status === "approved").reduce((sum, a) => sum + (a.credit || 1), 0);
    const recentActivities = activities.slice(0, 5).map(a => ({
      title: a.title,
      type: a.activityType,
      date: a.date,
      status: a.status,
    }));
    res.status(200).json({
      success: true,
      data: {
        student,
        totalActivities,
        approved,
        pending,
        credits,
        recentActivities,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
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


// Student dashboard: total credits, pending/approved counts, recent activities
const getStudentDashboard = async (req, res) => {
  try {
    // Get all activities for the student
    const activities = await Activity.find({ studentId: req.user._id }).sort({ date: -1 });

    // Total credits (approved only)
    const creditsEarned = activities
      .filter(a => a.status === "approved")
      .reduce((sum, curr) => sum + (curr.credit || 1), 0);

    // Count by status
    const pending = activities.filter(a => a.status === "pending").length;
    const approved = activities.filter(a => a.status === "approved").length;

    // Recent activities (last 5)
    const recentActivities = activities.slice(0, 5).map(a => ({
      title: a.title,
      type: a.activityType,
      date: a.date,
      status: a.status,
    }));

    res.status(200).json({
      success: true,
      data: {
        creditsEarned,
        pending,
        approved,
        recentActivities,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const User = require("../models/userModel");

// Faculty dashboard: pending reviews, total students, total activities this month
const getFacultyDashboard = async (req, res) => {
  try {
    const facultyDept = req.user.department;
    // Pending reviews: activities with status 'pending' for students in faculty's department
    const students = await User.find({ role: "student", department: facultyDept }).select("_id");
    const studentIds = students.map(s => s._id);
    const pendingReviews = await Activity.countDocuments({ status: "pending", studentId: { $in: studentIds } });

    // Total students in department
    const totalStudents = students.length;

    // Total activities this month in department
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const totalActivitiesThisMonth = await Activity.countDocuments({
      studentId: { $in: studentIds },
      date: { $gte: startOfMonth }
    });

    res.status(200).json({
      success: true,
      data: {
        pendingReviews,
        totalStudents,
        totalActivitiesThisMonth,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardSummary, getDashboardStats, getStudentDashboard, getFacultyDashboard, listDepartmentStudents, getStudentProfileStats };
