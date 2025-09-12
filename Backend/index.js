require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const dashboardRoute = require("./routes/dashboardRoute");
const authRoute = require("./routes/authRoute");
const adminRoute = require("./routes/adminRoute");
const activityRoute = require("./routes/activityRoute");
const errorHandler = require("./middleware/errorMiddleware");
const portfolioRoutes = require("./routes/portfolioRoutes");

const app = express();
const PORT = process.env.PORT || 8080;

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/dashboard", dashboardRoute);
app.use("/api/auth", authRoute);
app.use("/api/admin", adminRoute);
app.use("/api/activities", activityRoute);
app.use("/api/portfolio", portfolioRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
