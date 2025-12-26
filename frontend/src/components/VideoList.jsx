import { useEffect, useState } from "react";
import api from "../services/api";
import ProgressBar from "./ProgressBar";
import { io } from "socket.io-client";

export default function VideoList({ refresh }) {
  const [videos, setVideos] = useState([]);

  const fetchVideos = async () => {
    try {
      const res = await api.get("/videos");
      setVideos(res.data);
    } catch (error) {
      console.error("Failed to fetch videos");
    }
  };

  useEffect(() => {
    fetchVideos();
  }, [refresh]);

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("progress", ({ id, progress }) => {
      setVideos((prev) =>
        prev.map((v) =>
          v._id === id
            ? {
                ...v,
                progress,
                status: progress === 100 ? "processed" : "processing"
              }
            : v
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h3>Your Videos</h3>

      {videos.length === 0 && <p>No videos uploaded yet</p>}

      {videos.map((video) => (
        <div key={video._id} style={{ marginBottom: "20px" }}>
          <strong>{video.originalName}</strong>
          <div>Status: {video.status}</div>

          {video.status !== "processed" ? (
            <ProgressBar progress={video.progress || 0} />
          ) : (
            <>
              <video width="300" controls>
                <source src={video.url} type="video/mp4" />
              </video>
              <div>Sensitivity: {video.sensitivity}</div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
