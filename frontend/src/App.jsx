import { useContext, useState } from "react";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function AppContent() {
  const { token } = useContext(AuthContext);
  const [showRegister, setShowRegister] = useState(false);

  if (token) {
    return <Dashboard />;
  }

  return (
    <div>
      {showRegister ? <Register /> : <Login />}

      <p
        className="auth-link"
        onClick={() => setShowRegister((prev) => !prev)}
      >
        {showRegister
          ? "Already have an account? Login"
          : "New user? Register"}
      </p>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
