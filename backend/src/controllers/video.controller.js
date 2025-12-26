const Video = require("../models/Video");
const bucket = require("../config/firebase");

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

    const fileName = `videos/${Date.now()}-${req.file.originalname}`;
    const file = bucket.file(fileName);

    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype
      }
    });

    stream.on("error", () => {
      res.status(500).json({ message: "Firebase upload failed" });
    });

    stream.on("finish", async () => {
      await file.makePublic();

      const videoUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

      const video = await Video.create({
        filename: fileName,
        originalName: req.file.originalname,
        user: req.user.id,
        url: videoUrl,
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

        if (progress === 100) clearInterval(interval);
      }, 1000);
    });

    stream.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVideoProgress = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }
    res.json({
      progress: video.progress,
      status: video.status
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    await bucket.file(video.filename).delete();
    await video.deleteOne();

    res.json({ message: "Video deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

