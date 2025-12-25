const Video = require("../models/video");
const processVideo = require("../utils/videoProcessor");

exports.uploadVideo = async (req, res) => {
  const video = await Video.create({
    filename: req.file.filename,
    originalName: req.file.originalname,
    uploadedBy: req.user.id
  });

  processVideo(video, req.io);
  res.json(video);
};

exports.getVideos = async (req, res) => {
  const videos = await Video.find({ uploadedBy: req.user.id });
  res.json(videos);
};
