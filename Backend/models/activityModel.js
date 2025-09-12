const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    activityType: {
      type: String,
      enum: ["conference", "workshop", "competition", "volunteering", "other"],
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    date: {
      type: Date,
      required: true,
    },

    proof: {
      fileUrl: {
        type: String,
        trim: true,
      },

      fileType: {
        type: String,
        trim: true,
      },
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    validation: {
      facultyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      validatedAt: {
        type: Date,
      },

      validationComment: {
        type: String,
        trim: true,
        maxlength: 500,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
