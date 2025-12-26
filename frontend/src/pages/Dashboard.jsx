import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import VideoUpload from "../components/VideoUpload";
import VideoList from "../components/VideoList";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const [refresh, setRefresh] = useState(false);

  const handleUploadComplete = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h2>Dashboard</h2>

        <div>
          <span style={userStyle}>
            {user?.name} ({user?.role})
          </span>
          <button onClick={logout} style={logoutButtonStyle}>
            Logout
          </button>
        </div>
      </header>

      {(user?.role === "editor" || user?.role === "admin") && (
        <VideoUpload onUpload={handleUploadComplete} />
      )}

      <VideoList refresh={refresh} />
    </div>
  );
}

const containerStyle = {
  maxWidth: "900px",
  margin: "0 auto",
  padding: "20px"
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px"
};

const userStyle = {
  marginRight: "15px",
  fontWeight: "bold"
};

const logoutButtonStyle = {
  padding: "6px 12px",
  backgroundColor: "#d9534f",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer"
};
