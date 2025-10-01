import React, { useState, useEffect } from "react";
import "../css/HospitalHistory.css";

export default function HospitalHistory() {
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    totalDoctors: 0,
    totalExpenditure: 0,
    pendingRequests: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("all");

  const hospitalId = localStorage.getItem("hospitalId");

  useEffect(() => {
    if (hospitalId) {
      fetchHistory();
    }
  }, [timeRange, hospitalId]);

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/hospital/history/${hospitalId}`);
      const data = await response.json();
      if (response.ok && data.status === "ok") {
        setRequests(data.data || []);
        calculateStats(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (requestData) => {
    const accepted = requestData.filter((req) => req.status === "Accepted");
    const pending = requestData.filter((req) => req.status === "Pending");

    const totalExpenditure = accepted.reduce(
      (sum, req) => sum + (parseFloat(req.salary?.max) || 0),
      0
    );

    setStats({
      totalDoctors: accepted.length,
      totalExpenditure,
      pendingRequests: pending.length,
    });
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="history-section">
      <h2 className="section-title">Hospital Collaboration History</h2>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Active Collaborations</p>
          <p className="stat-value">{stats.totalDoctors}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Pending Requests</p>
          <p className="stat-value">{stats.pendingRequests}</p>
        </div>
        <div className="stat-card">
          <p className="stat-label">Total Expenditure</p>
          <p className="stat-value">{formatCurrency(stats.totalExpenditure)}</p>
        </div>
      </div>

      {/* Requests Table */}
      <div className="table-section">
        {isLoading ? (
          <div className="loading"><div className="spinner"></div></div>
        ) : requests.length > 0 ? (
          <table className="history-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Doctor</th>
                <th>Specialities</th>
                <th>Role</th>
                <th>Salary Offered</th>
                <th>Location</th>
                <th>Request Date</th>
                <th>Expire Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, idx) => (
                <tr key={req._id}>
                  <td>#{idx + 1}</td>
                  <td>{req.receiver?.id?.name || "Unknown Doctor"}</td>
                  <td>{req.receiver?.id?.specialities?.join(", ") || "N/A"}</td>
                  <td>{req.role || "Consultant"}</td>
                  <td>
                    {req.salary?.min && req.salary?.max
                      ? `${formatCurrency(req.salary.min)} - ${formatCurrency(req.salary.max)}`
                      : "Not specified"}
                  </td>
                  <td>{req.location || "N/A"}</td>
                  <td>{new Date(req.dateOfAppeal).toLocaleDateString()}</td>
                  <td>{req.expireDate ? new Date(req.expireDate).toLocaleDateString() : "N/A"}</td>
                  <td>
                    <span className={`status-badge status-${req.status.toLowerCase()}`}>
                      {req.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-results">
            <p>No requests found for this hospital.</p>
          </div>
        )}
      </div>
    </div>
  );
}
