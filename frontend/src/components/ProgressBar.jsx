export default function ProgressBar({ progress = 0 }) {
  return (
    <div style={containerStyle}>
      <div style={{ ...barStyle, width: `${progress}%` }} />
      <span style={textStyle}>{progress}%</span>
    </div>
  );
}

const containerStyle = {
  width: "300px",
  height: "14px",
  backgroundColor: "#e0e0e0",
  borderRadius: "8px",
  overflow: "hidden",
  position: "relative",
  marginTop: "8px"
};

const barStyle = {
  height: "100%",
  backgroundColor: "#4caf50",
  transition: "width 0.4s ease"
};

const textStyle = {
  position: "absolute",
  right: "8px",
  top: "-18px",
  fontSize: "12px",
  color: "#333"
};
