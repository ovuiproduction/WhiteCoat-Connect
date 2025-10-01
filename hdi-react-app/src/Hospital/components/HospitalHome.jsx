import React, { useState, useEffect } from "react";
import SearchDoctor from "./SearchDoctor";
import HospitalHistory from "./HospitalHistory";
import UpdateHospitalProfile from "./UpdateHospitalProfile";
import "../css/Home.css";
import {
  LayoutDashboard,
  Search,
  BarChart3,
  Users,
  Mail,
  Hospital,
  Briefcase,
} from "lucide-react";
import AddJobOpeningModal from "./AddJobOpeningModal";
import HospitalJobOpenings from "./HospitalJobOpenings";
import HospitalRequests from "./HospitalRequests";
import HospitalActiveCollaborations from "../components/HospitalActiveCollaborations";

export default function HospitalHome() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [hospitalData, setHospitalData] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showJobModal, setShowJobModal] = useState(false);

  const hospitalSession = JSON.parse(
    sessionStorage.getItem("hospitalSession") ||
      localStorage.getItem("hospitalSession")
  );
  const hospitalEmail = hospitalSession?.email;

  useEffect(() => {
    if (hospitalEmail) {
      fetchHospitalDetails();
      fetchDashboardData();
    }
  }, [hospitalEmail]);

  const fetchHospitalDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/hospital/details/${hospitalEmail}`
      );
      const data = await response.json();
      if (response.ok && data.status === "ok") {
        setHospitalData(data.data);
      }
    } catch (error) {
      console.error("Error fetching hospital details:", error);
    }
  };

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/hospital/history/${hospitalSession.hospitalId}`
      );
      if (response.ok) {
        const data = await response.json();
        const requests = data.data || [];
        setRecentActivity(
          requests.slice(0, 5).map((req, i) => ({
            id: req._id,
            doctor: req.receiver?.id?.name || "Unknown Doctor",
            specialization: req.receiver?.id?.specialities?.join(", ") || "N/A",
            action:
              req.status === "Accepted"
                ? "Collaboration Started"
                : req.status === "Pending"
                ? "Request Sent"
                : req.status === "Rejected"
                ? "Request Declined"
                : "Status Updated",
            salary:
              req.salary?.min && req.salary?.max
                ? `₹${req.salary.min.toLocaleString()} - ₹${req.salary.max.toLocaleString()}`
                : "Not specified",
            time: formatTimeAgo(new Date(req.dateOfAppeal)),
            type:
              req.status === "Accepted"
                ? "success"
                : req.status === "Pending"
                ? "info"
                : req.status === "Rejected"
                ? "error"
                : "warning",
          }))
        );
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    return date.toLocaleDateString();
  };

  const handleCloseProfileModal = () => {
    setShowProfileModal(false);
    fetchHospitalDetails(); // Refresh data after update
  };

  const handleCloseJobModal = () => {
    setShowJobModal(false);
    fetchHospitalDetails(); // Refresh hospital to get new job openings
  };

  return (
    <div className="hospital-dashboard">
      {/* Dashboard Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="hospital-info">
            <div className="hospital-logo">
              <span className="logo-icon">
                <Hospital size={28} strokeWidth={2} />
              </span>

              <div className="logo-text">
                <h1>{hospitalData?.name}</h1>
              </div>
            </div>
          </div>
          <div className="header-actions">
            <button
              className="btn btn-outline-primary"
              onClick={() => setShowProfileModal(true)}
            >
              Update Profile
            </button>
            <button
              className="btn btn-success"
              onClick={() => setShowJobModal(true)}
            >
              Add Job Opening
            </button>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        {/* Sidebar Navigation */}
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            <div className="nav-section">
              <h3 className="nav-section-title">MAIN</h3>
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

              <button
                className={`nav-item ${
                  activeTab === "activecollaborations" ? "active" : ""
                }`}
                onClick={() => setActiveTab("activecollaborations")}
              >
                <span className="nav-icon">
                  <Users size={20} />
                </span>
                <span className="nav-text">Active Doctors</span>
              </button>

              <button
                className={`nav-item ${activeTab === "search" ? "active" : ""}`}
                onClick={() => setActiveTab("search")}
              >
                <span className="nav-icon">
                  <Search size={20} />
                </span>
                <span className="nav-text">Find Doctors</span>
              </button>
              <button
                className={`nav-item ${
                  activeTab === "requests" ? "active" : ""
                }`}
                onClick={() => setActiveTab("requests")}
              >
                <span className="nav-icon">
                  <Mail size={20} />
                </span>
                <span className="nav-text">Requests</span>
              </button>
              <button
                className={`nav-item ${
                  activeTab === "history" ? "active" : ""
                }`}
                onClick={() => setActiveTab("history")}
              >
                <span className="nav-icon">
                  <BarChart3 size={20} />
                </span>
                <span className="nav-text">Hospital Analytics</span>
              </button>
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
          </nav>
        </aside>

        {/* Main Content */}
        <main className="dashboard-main">
          {activeTab === "dashboard" && (
            <div className="dashboard-overview">
              <div className="overview-header">
                <h2>Doctor Collaboration Dashboard</h2>
                <p>Manage staff, requests, and openings efficiently</p>
              </div>

              {/* Hospital Details */}
              {hospitalData && (
                <div className="hospital-details-card">
                  <h3>Hospital Information</h3>
                  <p>
                    <strong>Name:</strong> {hospitalData.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {hospitalData.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {hospitalData.phone || "N/A"}
                  </p>
                  <p>
                    <strong>Type:</strong> {hospitalData.type || "N/A"}
                  </p>
                  <p>
                    <strong>Bed Capacity:</strong>{" "}
                    {hospitalData.bedCapacity || "N/A"}
                  </p>
                  <p>
                    <strong>Address:</strong>{" "}
                    {hospitalData.address
                      ? `${hospitalData.address.street}, ${hospitalData.address.city}, ${hospitalData.address.state}, ${hospitalData.address.country} - ${hospitalData.address.pincode}`
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Departments:</strong>{" "}
                    {hospitalData.departments?.join(", ") || "N/A"}
                  </p>
                  <p>
                    <strong>Services:</strong>{" "}
                    {hospitalData.servicesArray?.join(", ") || "N/A"}
                  </p>
                </div>
              )}

              {/* Stats */}
              {isLoading ? (
                <p>Loading dashboard...</p>
              ) : (
                <>
                  {/* Recent Activity Section */}
                  <div className="recent-activity-section">
                    <div className="section-header">
                      <h3>Recent Activity</h3>
                      <button
                        className="view-all-btn"
                        onClick={() => setActiveTab("history")}
                      >
                        View All
                      </button>
                    </div>

                    {recentActivity.length > 0 ? (
                      <ul className="activity-list">
                        {recentActivity.map((activity) => (
                          <li
                            key={activity.id}
                            className={`activity-item ${activity.type}`}
                          >
                            <div className="activity-icon">
                              {activity.type === "success" && "✅"}
                              {activity.type === "info" && "📤"}
                              {activity.type === "error" && "❌"}
                              {activity.type === "warning" && "⚠️"}
                            </div>
                            <div className="activity-content">
                              <p className="activity-title">
                                {activity.doctor} ({activity.specialization})
                              </p>
                              <p className="activity-description">
                                {activity.action}
                              </p>
                              <p className="activity-salary">
                                💰 {activity.salary}
                              </p>
                            </div>
                            <span className="activity-time">
                              {activity.time}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="no-activity">
                        <p>No recent activity found.</p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
          {activeTab === "jobopenings" && (
            <HospitalJobOpenings hospitalId={hospitalSession.hospitalId} />
          )}
          {activeTab === "search" && <SearchDoctor />}
          {activeTab === "requests" && (
            <HospitalRequests hospitalId={hospitalSession.hospitalId} />
          )}
          {activeTab === "history" && <HospitalHistory />}
          {activeTab === "activecollaborations" && (
            <HospitalActiveCollaborations
              hospitalId={hospitalSession.hospitalId}
            />
          )}
        </main>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="modal-overlay">
          <UpdateHospitalProfile
            hospitalData={hospitalData}
            onClose={handleCloseProfileModal}
          />
        </div>
      )}

      {/* Job Opening Modal */}
      {showJobModal && (
        <div className="modal-overlay">
          <AddJobOpeningModal
            hospitalId={hospitalSession.hospitalId}
            onClose={handleCloseJobModal}
          />
        </div>
      )}
    </div>
  );
}
