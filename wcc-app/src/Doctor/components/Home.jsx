import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Hospital,
  ClipboardList,
  Briefcase,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";
import UpdateProfileDoctor from "./UpdateProfileDoctor";
import { toast } from "react-toastify";
import JobOpeningsForDoctors from "./JobOpeningsForDoctors";
import DoctorRequests from "./DoctorRequests";
import ActiveCollaborations from "./ActiveCollaborations";

export default function DHome() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const doctorId =
    localStorage.getItem("doctorId") || sessionStorage.getItem("doctorId");
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const fetchDoctor = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/doctor/getDoctor/${doctorId}`
      );
      const data = await response.json();
      if (response.ok && data.status === "ok") {
        setDoctor(data.data);
      } else {
        console.error("Error fetching doctor info:", data.message);
      }
    } catch (err) {
      console.error("Error fetching doctor:", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/doctor/${doctorId}/requests-received`
      );
      const data = await res.json();

      if (res.ok && data.status === "ok") {
        setNotifications(data.data);
      } else {
        toast.error(data.message || "Failed to fetch requests");
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
      toast.error("Network error while fetching requests");
    }
  };

  const pendingNotificationsCount = notifications.filter((n) =>
    n.status.startsWith("Pending")
  ).length;

  useEffect(() => {
    if (doctorId) {
      fetchDoctor();
      fetchNotifications();
    }
  }, [doctorId]);

  return (
    <div className="doctor-dashboard">
      {/* Header */}
      <header className="doctor-header">
        <div className="header-content">
          <div className="doctor-brand">
            <span className="brand-icon">🩺</span>
            <div className="brand-text">
              <h1>Doctor Portal</h1>
              <p>Medical Professional Dashboard</p>
            </div>
          </div>
          <div className="header-actions">
            <div className="user-profile">
              <div className="profile-avatar">
                <span>DR</span>
              </div>
              <div className="profile-info">
                <span className="profile-name">
                  Dr. {doctor?.name || "Professional"}
                </span>
                <span className="profile-role">Medical Practitioner</span>
              </div>
            </div>
            <button
              className={`notification-btn ${
                pendingNotificationsCount > 0 ? "has-notifications" : ""
              }`}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <span className="notification-icon">🔔</span>
              {pendingNotificationsCount > 0 && (
                <span className="notification-badge">
                  {pendingNotificationsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="doctor-sidebar">
          <nav className="sidebar-nav">
            
            <div className="nav-section">
              <h3 className="nav-section-title">MAIN</h3>

              {/* Dashboard */}
              <button
                className={`nav-item ${
                  activeTab === "dashboard" ? "active" : ""
                }`}
                onClick={() => setActiveTab("dashboard")}
              >
                <span className="nav-icon">
                  <LayoutDashboard size={20} />
                </span>
                <span className="nav-text">Dashboard</span>
              </button>

              {/* Actively Working */}
              <button
                className={`nav-item ${activeTab === "active" ? "active" : ""}`}
                onClick={() => setActiveTab("active")}
              >
                <span className="nav-icon">
                  <Hospital size={20} />
                </span>
                <span className="nav-text">Actively Working</span>
              </button>

              {/* Requests */}
              <button
                className={`nav-item ${
                  activeTab === "requests" ? "active" : ""
                }`}
                onClick={() => setActiveTab("requests")}
              >
                <span className="nav-icon">
                  <ClipboardList size={20} />
                </span>
                <span className="nav-text">Requests</span>
                {pendingNotificationsCount > 0 && (
                  <span className="nav-badge">{pendingNotificationsCount}</span>
                )}
              </button>

              {/* Job Openings */}
              <button
                className={`nav-item ${
                  activeTab === "jobopenings" ? "active" : ""
                }`}
                onClick={() => setActiveTab("jobopenings")}
              >
                <span className="nav-icon">
                  <Briefcase size={20} />
                </span>
                <span className="nav-text">Job Openings</span>
              </button>
            </div>

            <div className="nav-section">
              <h3 className="nav-section-title">PROFILE</h3>
              <button
                className="nav-item update-profile-btn"
                onClick={() => setIsUpdateModalOpen(true)}
              >
                <span className="nav-icon">👤</span>
                <span className="nav-text">Update Profile</span>
              </button>
              <UpdateProfileDoctor
                isOpen={isUpdateModalOpen}
                onClose={() => setIsUpdateModalOpen(false)}
                doctor={doctor}
              />
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="doctor-main">
          {activeTab === "dashboard" && (
            <div className="dashboard-content">
              {/* Profile Section */}
              <div className="profile-section">
                <div className="section-header">
                  <h3 className="section-title">Professional Profile</h3>
                  <button
                    className="edit-profile-btn"
                    onClick={() => setIsUpdateModalOpen(true)}
                  >
                    Edit Profile
                  </button>
                </div>

                {doctor ? (
                  <div className="profile-card">
                    <div className="profile-header">
                      <div className="profile-avatar-large">
                        <span>DR</span>
                      </div>
                      <div className="profile-info-main">
                        <h4>Dr. {doctor.name}</h4>
                        <p className="profile-specialty">
                          {doctor.specialities?.join(", ") ||
                            "Medical Professional"}
                        </p>
                        <p className="profile-email">{doctor.email}</p>
                      </div>
                    </div>

                    <div className="profile-details">
                      <div className="detail-group">
                        <div className="detail-item">
                          <span className="detail-label">Phone</span>
                          <span className="detail-value">
                            {doctor.phone || "Not provided"}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Registration No</span>
                          <span className="detail-value">
                            {doctor.registrationNumber || "Not provided"}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Experience</span>
                          <span className="detail-value">
                            {doctor.yearsOfExperience || "0"} years
                          </span>
                        </div>
                      </div>

                      <div className="detail-group">
                        <div className="detail-item full-width">
                          <span className="detail-label">Education</span>
                          <span className="detail-value">
                            {doctor.education?.join(", ") || "Not updated yet"}
                          </span>
                        </div>
                        <div className="detail-item full-width">
                          <span className="detail-label">Specialities</span>
                          <span className="detail-value">
                            {doctor.specialities?.join(", ") ||
                              "Not updated yet"}
                          </span>
                        </div>
                        <div className="detail-item">
                          <span className="detail-label">Expected Salary</span>
                          <span className="detail-value">
                            {doctor.expectedSalary || "0"} ₹
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="loading-profile">
                    <div className="spinner"></div>
                    <p>Loading profile information...</p>
                  </div>
                )}
              </div>
            </div>
          )}
          {activeTab === "active" && (
            <ActiveCollaborations doctorId={doctorId} />
          )}

          {activeTab === "requests" && <DoctorRequests doctorId={doctorId} />}
        </main>

        {activeTab === "jobopenings" && (
          <JobOpeningsForDoctors doctorId={doctorId} />
        )}
      </div>

      {showNotifications && (
        <div className="notifications-panel">
          <div className="notifications-header">
            <h3>Notifications</h3>
            <button
              className="close-btn"
              onClick={() => setShowNotifications(false)}
            >
              ×
            </button>
          </div>

          <div className="notifications-list">
            {notifications.filter((req) => req.status === "Pending").length >
            0 ? (
              notifications
                .filter((req) => req.status === "Pending")
                .map((request, index) => (
                  <div
                    key={index}
                    className="notification-item"
                    onClick={() => setActiveTab("requests")}
                  >
                    <div className="notification-icon">📋</div>
                    <div className="notification-content">
                      <h4>
                        New Request from{" "}
                        {request.sender?.type === "Hospital"
                          ? request.sender?.id?.name || "Hospital"
                          : "Unknown Sender"}
                      </h4>

                      <p>
                        <strong>Role:</strong>{" "}
                        {request.role || "Medical Consultant"}
                      </p>
                      {request.salary?.min && request.salary?.max && (
                        <p>
                          <strong>Salary:</strong> ₹
                          {request.salary.min.toLocaleString()} - ₹
                          {request.salary.max.toLocaleString()}
                        </p>
                      )}
                      {request.location && (
                        <p>
                          <strong>Location:</strong> {request.location}
                        </p>
                      )}

                      <span className="notification-time">
                        Expires:{" "}
                        {request.expireDate
                          ? request.expireDate.slice(0, 10)
                          : "No expiry"}
                      </span>
                    </div>
                  </div>
                ))
            ) : (
              <div className="no-notifications">
                <p>No new notifications</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Chat Floating Button */}
      <button
        className="chat-floating-btn"
        onClick={() => navigate("/chatDoctor")}
      >
        <span className="chat-icon">💬</span>
        <span className="chat-text">Messages</span>
      </button>
    </div>
  );
}
