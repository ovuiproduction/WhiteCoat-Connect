import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Cover from "./pages/Cover";
import HHome from "./Hospital/components/HospitalHome";
import DHome from "./Doctor/components/Home";
import DocChat from "./pages/DocChat";

function FloatingChatButton() {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide button on Cover page
  if (location.pathname === "/" || location.pathname === "/chatDoctor") return null;

  return (
    <button
      className="chat-floating-btn"
      onClick={() => navigate("/chatDoctor")}
    >
      <span className="chat-icon">💬</span>
      <span className="chat-text">Messages</span>
    </button>
  );
}

export default function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        theme="colored"
      />

      <Routes>
        <Route path="/" element={<Cover />} />
        <Route path="/homeHospital" element={<HHome />} />
        <Route path="/homeDoctor" element={<DHome />} />
        <Route path="/chatDoctor" element={<DocChat />} />
      </Routes>

      {/* Floating button rendered conditionally */}
      <FloatingChatButton />
    </Router>
  );
}
