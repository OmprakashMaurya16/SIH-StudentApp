const User = require("../models/userModel");
const Activity = require("../models/activityModel");

const getPortfolio = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const activities = await Activity.find({
      studentId: req.user._id,
    }).populate("validation.facultyId", "fullName email");

    res.status(200).json({
      success: true,
      message: "Portfolio fetched successfully",
      data: {
        user,
        activities,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getPortfolio };
