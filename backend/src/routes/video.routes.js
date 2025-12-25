const express = require("express");
const fs = require("fs");
const path = require("path");

const auth = require("../middlewares/auth.middleware");
const role = require("../middlewares/role.middleware");
const upload = require("../middlewares/upload.middleware");

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
  uploadVideo
);

// Get user videos
router.get("/", auth, getVideos);

// Video streaming (HTTP Range Requests)
router.get("/stream/:filename", auth, (req, res) => {
  const videoPath = path.join("uploads", req.params.filename);

  if (!fs.existsSync(videoPath)) {
    return res.status(404).json({ message: "Video not found" });
  }

  const stat = fs.statSync(videoPath);
  const range = req.headers.range;

  if (!range) {
    return res.status(416).send("Range header required");
  }

  const parts = range.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;

  const fileSize = stat.size;
  const chunkSize = end - start + 1;

  const file = fs.createReadStream(videoPath, { start, end });

  res.writeHead(206, {
    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": chunkSize,
    "Content-Type": "video/mp4"
  });

  file.pipe(res);
});

module.exports = router;
