module.exports = async (video, io) => {
  let progress = 0;

  const interval = setInterval(async () => {
    try {
      progress = Math.min(progress + 20, 100);

      video.progress = progress;
      video.status = progress === 100 ? "processed" : "processing";

      if (progress === 100) {
        video.sensitivity = Math.random() > 0.7 ? "flagged" : "safe";
      }

      await video.save();

      io.emit("progress", {
        id: video._id,
        progress: video.progress,
        status: video.status,
        sensitivity: video.sensitivity
      });

      if (progress === 100) {
        clearInterval(interval);
      }
    } catch (error) {
      clearInterval(interval);
      console.error("Video processing failed:", error.message);
    }
  }, 1000);
};
