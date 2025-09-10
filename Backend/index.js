require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const userModel = require("./models/userModel.js");
const activityModel = require("./models//activityModel.js");

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL;

async function main() {
  await mongoose.connect(MONGO_URL);
}

main()
  .then(() => console.log("Mongodb connected successfully"))
  .catch((err) => console.log(`Mongodb connection error : ${err}`));

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(PORT, () => {
  console.log(`Server is started at http://localhost:${PORT}`);
});
