const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["student", "faculty", "admin"],
      default: "student",
      required: true,
    },

    rollNo: {
      type: String,
      trim: true,
      unique: true,
    },

    course: {
      type: String,
      trim: true,
      required: function () {
        return this.role === "student";
      },
    },

    year: {
      type: Number,
      min: 1,
      max: 10,
      required: function () {
        return this.role === "student";
      },
    },

    department: {
      type: String,
      trim: true,
      required: function () {
        return this.role === "student";
      },
    },

    profile: {
      profilePhoto: {
        type: String,
        trim: true,
      },

      bio: {
        type: String,
        trim: true,
        maxlength: 500,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
