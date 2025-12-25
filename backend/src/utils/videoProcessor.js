module.exports = (video, io) => {
  let progress = 0;

  const interval = setInterval(() => {
    progress += 20;
    io.emit("progress", { id: video._id, progress });

    if (progress >= 100) {
      clearInterval(interval);
      video.status = "processed";
      video.sensitivity = Math.random() > 0.7 ? "flagged" : "safe";
      video.progress = 100;
      video.save();
    } else {
      video.progress = progress;
      video.status = "processing";
      video.save();
    }
  }, 1000);
};
