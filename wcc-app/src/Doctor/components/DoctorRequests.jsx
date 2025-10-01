import React, { useState, useEffect } from "react";
import "../css/Requests.css";

export default function DoctorRequests({ doctorId }) {
  const [activeView, setActiveView] = useState("received"); // "received" or "sent"
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch received + sent requests
  useEffect(() => {
    if (doctorId) {
      fetchReceivedRequests(doctorId);
      fetchSentRequests(doctorId);
    }
  }, [doctorId]);

  const fetchReceivedRequests = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/doctor/${id}/requests-received`
      );
      const data = await res.json();
      if (res.ok && data.status === "ok") setReceivedRequests(data.data);
    } catch (err) {
      console.error("Error fetching received requests:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSentRequests = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:5000/doctor/${id}/requests-sent`
      );
      const data = await res.json();
      if (res.ok && data.status === "ok") setSentRequests(data.data);
    } catch (err) {
      console.error("Error fetching sent requests:", err);
    }
  };

  const handleAccept = async (requestId) => {
    try {
      const res = await fetch("http://localhost:5000/doctor/requests/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });
      const data = await res.json();
      if (res.ok && data.status === "ok") {
        toast.success("Request accepted!");
        fetchReceivedRequests();
      }
    } catch (err) {
      toast.error("Error accepting request");
    }
  };

  const handleReject = async (requestId) => {
    try {
      const res = await fetch("http://localhost:5000/doctor/requests/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });
      const data = await res.json();
      if (res.ok && data.status === "ok") {
        toast.info("Request rejected!");
        fetchReceivedRequests();
      }
    } catch (err) {
      toast.error("Error rejecting request");
    }
  };

  // Format salary
  const formatSalary = (salary) => {
    if (salary?.min && salary?.max) {
      return `₹${salary.min.toLocaleString()} - ₹${salary.max.toLocaleString()}`;
    }
    return "Not specified";
  };

  return (
    <div className="requests-section">
      <div className="section-header">
        <h2 className="section-title">Collaboration Requests</h2>
        <p>Manage both requests you received and sent</p>
      </div>

      {/* Toggle Between Received and Sent */}
      <div className="requests-toggle">
        <button
          className={activeView === "received" ? "active" : ""}
          onClick={() => setActiveView("received")}
        >
          📥 Received
        </button>
        <button
          className={activeView === "sent" ? "active" : ""}
          onClick={() => setActiveView("sent")}
        >
          📤 Sent
        </button>
      </div>

      <div className="requests-list">
        {isLoading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : activeView === "received" ? (
          receivedRequests.length > 0 ? (
            receivedRequests.map((req, idx) => (
              <div key={idx} className="request-card">
                <div className="request-header">
                  <div className="hospital-info">
                    <div className="hospital-avatar">🏥</div>
                    <div className="hospital-details">
                      <h4>{req.sender?.id?.name || "Unknown Hospital"}</h4>
                      <p>{req.sender?.id?.email || "N/A"}</p>
                    </div>
                  </div>
                  <span className="request-date">
                    Expires:{" "}
                    {req.expireDate ? req.expireDate.slice(0, 10) : "N/A"}
                  </span>
                </div>

                <div className="request-details">
                  <div className="detail-row">
                    <span>Role:</span> {req.role || "Consultant"}
                  </div>
                  <div className="detail-row">
                    <span>Salary:</span> {formatSalary(req.salary)}
                  </div>
                  <div className="detail-row">
                    <span>Location:</span> {req.location || "N/A"}
                  </div>
                  <div className="detail-row">
                    <span>Status:</span>{" "}
                    <span
                      className={`status-badge ${req.status.toLowerCase()}`}
                    >
                      {req.status}
                    </span>
                  </div>
                </div>

                <div className="request-actions">
                  {req.status === "Pending" ? (
                    <>
                      <button
                        className="btn-accept"
                        onClick={() => handleAccept(request._id)}
                      >
                        Accept
                      </button>
                      <button
                        className="btn-reject"
                        onClick={() => handleReject(request._id)}
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span
                      className={`status-badge ${req.status.toLowerCase()}`}
                    >
                      {req.status}
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="no-requests">No Received Requests</div>
          )
        ) : sentRequests.length > 0 ? (
          sentRequests.map((req, idx) => (
            <div key={idx} className="request-card">
              <div className="request-header">
                <div className="hospital-info">
                  <div className="hospital-avatar">🏥</div>
                  <div className="hospital-details">
                    <h4>{req.receiver?.id?.name || "Unknown Hospital"}</h4>
                    <p>{req.receiver?.id?.email || "N/A"}</p>
                  </div>
                </div>
                <span className="request-date">
                  Sent: {new Date(req.dateOfAppeal).toLocaleDateString()}
                </span>
              </div>

              <div className="request-details">
                <div className="detail-row">
                  <span>Role:</span> {req.role || "Consultant"}
                </div>
                <div className="detail-row">
                  <span>Salary:</span> {formatSalary(req.salary)}
                </div>
                <div className="detail-row">
                  <span>Location:</span> {req.location || "N/A"}
                </div>
                <div className="detail-row">
                  <span>Status:</span>{" "}
                  <span className={`status-badge ${req.status.toLowerCase()}`}>
                    {req.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-requests">No Sent Requests</div>
        )}
      </div>
    </div>
  );
}
