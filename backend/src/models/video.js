const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema(
  {
    filename: String,
    originalName: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    status: {
      type: String,
      enum: ["uploaded", "processing", "processed"],
      default: "uploaded"
    },
    sensitivity: {
      type: String,
      enum: ["safe", "flagged"],
      default: "safe"
    },
    progress: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Video", videoSchema);
