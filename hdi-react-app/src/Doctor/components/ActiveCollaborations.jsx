import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "../css/ActiveCollaborations.css";

export default function ActiveCollaborations({ doctorId }) {
  const [activeRequests, setActiveRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActiveRequests = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/doctor/${doctorId}/active-collaborations`
      );
      const data = await response.json();

      if (response.ok && data.status === "ok") {
        setActiveRequests(data.data || []);
      } else {
        toast.error(data.message || "Failed to fetch active collaborations");
      }
    } catch (err) {
      console.error("Error fetching active collaborations:", err);
      toast.error("Network error while fetching active collaborations");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (doctorId) {
      fetchActiveRequests();
    }
  }, [doctorId]);

  return (
    <div className="active-section">
      <h2 className="section-title">Actively Working</h2>
      <p className="section-subtitle">
        All accepted collaborations where you are currently working
      </p>

      {isLoading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading active collaborations...</p>
        </div>
      ) : activeRequests.length > 0 ? (
        <div className="active-list">
          {activeRequests.map((req, index) => (
            <div key={index} className="active-card">
              <h3>
                {req.sender?.type === "Hospital"
                  ? req.sender?.id?.name || "Hospital"
                  : req.receiver?.type === "Hospital"
                  ? req.receiver?.id?.name || "Hospital"
                  : "Unknown"}
              </h3>
              <p>
                <strong>Role:</strong> {req.role || "Medical Consultant"}
              </p>
              <p>
                <strong>Location:</strong> {req.location || "Not specified"}
              </p>
              {req.salary?.min && req.salary?.max && (
                <p>
                  <strong>Salary:</strong> ₹
                  {req.salary.min.toLocaleString()} - ₹
                  {req.salary.max.toLocaleString()}
                </p>
              )}
              <p>
                <strong>Since:</strong>{" "}
                {new Date(req.updatedAt).toLocaleDateString("en-IN")}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-active">
          <p>No active collaborations yet.</p>
        </div>
      )}
    </div>
  );
}
