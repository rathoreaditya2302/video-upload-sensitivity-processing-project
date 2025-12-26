const express = require("express");
const fs = require("fs");
const path = require("path");

const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const upload = require("../middlewares/upload.middleware");
const Video = require("../models/Video");

const {
  uploadVideo,
  getVideos
} = require("../controllers/video.controller");

const router = express.Router();

// Upload video (Editor/Admin only)
router.post(
  "/upload",
  auth,
  role(["editor", "admin"]),
  upload.single("video"),
  (req, res, next) => {
    console.log("File received:", req.file);
    next();
  },
  uploadVideo
);

// Get logged-in user's videos
router.get("/", auth, getVideos);

// Secure video streaming with ownership check
router.get("/stream/:filename", auth, async (req, res) => {
  try {
    const video = await Video.findOne({
      filename: req.params.filename,
      user: req.user.id
    });

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    const videoPath = path.join("uploads", video.filename);

    if (!fs.existsSync(videoPath)) {
      return res.status(404).json({ message: "File not found on server" });
    }

    const stat = fs.statSync(videoPath);
    const range = req.headers.range;

    if (!range) {
      return res.status(416).send("Range header required");
    }

    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;

    const chunkSize = end - start + 1;
    const file = fs.createReadStream(videoPath, { start, end });

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${stat.size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunkSize,
      "Content-Type": "video/mp4"
    });

    file.pipe(res);
  } catch (error) {
    res.status(500).json({ message: "Video streaming failed" });
  }
});

module.exports = router;
