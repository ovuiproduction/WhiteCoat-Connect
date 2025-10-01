import React, { useState, useEffect } from "react";
// import "../css/Requests.css";
import { toast } from "react-toastify";

export default function HospitalRequests({ hospitalId }) {
  const [activeTab, setActiveTab] = useState("received");
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hospitalId) fetchRequests();
  }, [hospitalId]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const [resReceived, resSent] = await Promise.all([
        fetch(`http://localhost:5000/hospital/${hospitalId}/requests-received`),
        fetch(`http://localhost:5000/hospital/${hospitalId}/requests-sent`)
      ]);

      const receivedData = await resReceived.json();
      const sentData = await resSent.json();

      if (receivedData.status === "ok") setReceivedRequests(receivedData.data);
      if (sentData.status === "ok") setSentRequests(sentData.data);
    } catch (err) {
      console.error("Error fetching hospital requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId, action) => {
    try {
      const response = await fetch(
        `http://localhost:5000/hospital/requests/${requestId}/${action}`,
        { method: "POST" }
      );
      const data = await response.json();

      if (response.ok && data.status === "ok") {
        toast.success(`Request ${action}ed successfully!`);
        fetchRequests(); // refresh list
      } else {
        toast.error(data.message || "Action failed");
      }
    } catch (err) {
      console.error("Error updating request:", err);
      toast.error("Network error");
    }
  };

  const renderRequestCard = (req, isReceived) => (
    <div key={req._id} className="request-card">
      <div className="request-header">
        <div className="hospital-info">
          <div className="hospital-avatar">
            <span>{isReceived ? "👨‍⚕️" : "🏥"}</span>
          </div>
          <div className="hospital-details">
            <h4>
              {isReceived
                ? req.sender?.id?.name || "Doctor"
                : req.receiver?.id?.name || "Doctor"}
            </h4>
            <p>
              {isReceived ? "Doctor applied for job" : "Request sent to doctor"}
            </p>
          </div>
        </div>
        <span className="request-date">
          {req.expireDate ? `Expires: ${req.expireDate.slice(0, 10)}` : ""}
        </span>
      </div>

      <div className="request-details">
        <div className="detail-row">
          <span>Role:</span>
          <span>{req.role || "Medical Consultant"}</span>
        </div>
        <div className="detail-row">
          <span>Salary:</span>
          <span>
            {req.salary?.min && req.salary?.max
              ? `₹${req.salary.min} - ₹${req.salary.max}`
              : "Not specified"}
          </span>
        </div>
        <div className="detail-row">
          <span>Location:</span>
          <span>{req.location || "N/A"}</span>
        </div>
        <div className="detail-row">
          <span>Status:</span>
          <span className={`status-badge ${req.status.toLowerCase()}`}>
            {req.status}
          </span>
        </div>
      </div>

      {/* ✅ Only show Accept/Reject buttons for received + pending requests */}
      {isReceived && req.status === "Pending" && (
        <div className="request-actions">
          <button
            className="btn-accept"
            onClick={() => handleAction(req._id, "accept")}
          >
            Accept
          </button>
          <button
            className="btn-reject"
            onClick={() => handleAction(req._id, "reject")}
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="requests-section">
      <div className="section-header">
        <h2 className="section-title">Hospital Requests</h2>
        <p>Manage collaboration requests sent and received</p>
      </div>

      <div className="requests-toggle">
        <button
          className={activeTab === "received" ? "active" : ""}
          onClick={() => setActiveTab("received")}
        >
          Received
        </button>
        <button
          className={activeTab === "sent" ? "active" : ""}
          onClick={() => setActiveTab("sent")}
        >
          Sent
        </button>
      </div>

      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : (
        <div className="requests-list">
          {activeTab === "received" &&
            (receivedRequests.length > 0 ? (
              receivedRequests.map((req) => renderRequestCard(req, true))
            ) : (
              <div className="no-requests">No requests received.</div>
            ))}

          {activeTab === "sent" &&
            (sentRequests.length > 0 ? (
              sentRequests.map((req) => renderRequestCard(req, false))
            ) : (
              <div className="no-requests">No requests sent.</div>
            ))}
        </div>
      )}
    </div>
  );
}
