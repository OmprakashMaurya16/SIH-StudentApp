const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res
          .status(401)
          .json({ success: false, message: "Not authorized, user not found" });
      }
      return next();
    } catch {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, token failed" });
    }
  }
  return res
    .status(401)
    .json({ success: false, message: "Not authorized, no token" });
};

const adminAndFaculty = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "faculty")) {
    return next();
  }
  return res
    .status(403)
    .json({ success: false, message: "Not authorized as admin or faculty" });
};

module.exports = { protect, adminAndFaculty };
