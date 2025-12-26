const express = require("express");

const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const upload = require("../middlewares/upload.middleware");

const {
  uploadVideo,
  getVideos,
  getVideoById,
  getVideoProgress,
  deleteVideo
} = require("../controllers/video.controller");

const router = express.Router();

// Upload video (Editor/Admin only)
router.post(
  "/upload",
  auth,
  role(["editor", "admin"]),
  upload.single("video"),
  uploadVideo
);

// Get logged-in user's videos
router.get("/", auth, getVideos);

// Get single video metadata
router.get("/:id", auth, getVideoById);

// Get video processing progress
router.get("/:id/progress", auth, getVideoProgress);

// Delete video (Firebase + MongoDB)
router.delete("/:id", auth, deleteVideo);

module.exports = router;
