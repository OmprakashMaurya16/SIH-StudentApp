const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        console.warn("AuthMiddleware: user not found for decoded token id", decoded.id);
        return res
          .status(401)
          .json({ success: false, message: "Not authorized, user not found" });
      }
      return next();
    } catch (err) {
      console.warn("AuthMiddleware: token verification failed", err?.message);
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, token failed" });
    }
  }
  console.warn("AuthMiddleware: missing or malformed Authorization header", authHeader);
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
