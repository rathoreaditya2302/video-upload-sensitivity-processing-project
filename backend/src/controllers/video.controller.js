const Video = require("../models/Video");
const processVideo = require("../utils/videoProcessor");


exports.getVideos = async (req, res) => {
  try {
    const videos = await Video.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




exports.uploadVideo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No video file uploaded" });
    }

    const video = await Video.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      user: req.user.id,
      status: "processing",
      progress: 0
    });

    res.status(201).json(video);

    let progress = 0;

    const interval = setInterval(async () => {
      progress += 20;

      await Video.findByIdAndUpdate(video._id, {
        progress,
        status: progress === 100 ? "processed" : "processing"
      });

      req.io.emit("progress", {
        id: video._id,
        progress
      });

      if (progress === 100) {
        clearInterval(interval);
      }
    }, 1000);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
