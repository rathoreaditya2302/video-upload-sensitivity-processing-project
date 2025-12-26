import { useRef, useState } from "react";
import api from "../services/api";

export default function VideoUpload({ onUpload }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const uploadVideo = async () => {
    if (!file) {
      alert("Please select a video file");
      return;
    }

    if (!file.type.startsWith("video/")) {
      alert("Only video files are allowed");
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      alert("Video size must be less than 100MB");
      return;
    }

    const formData = new FormData();
    formData.append("video", file);

    try {
      setLoading(true);
      await api.post("/videos/upload", formData);
      alert("Video uploaded successfully");
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      onUpload();
    } catch (error) {
      alert(error.response?.data?.message || "Video upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <input
        ref={inputRef}
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files[0])}
        disabled={loading}
      />
      <br />
      <br />
      <button onClick={uploadVideo} disabled={loading}>
        {loading ? "Uploading..." : "Upload Video"}
      </button>
    </div>
  );
}
