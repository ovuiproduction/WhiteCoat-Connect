import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "../css/HospitalActiveCollaborations.css";

export default function HospitalActiveCollaborations({ hospitalId }) {
  const [activeRequests, setActiveRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActiveRequests = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/hospital/${hospitalId}/activeRequests`
      );
      const data = await response.json();

      if (response.ok && data.status === "ok") {
        setActiveRequests(data.data || []);
      } else {
        toast.error(data.message || "Failed to fetch collaborations");
      }
    } catch (err) {
      console.error("Error fetching hospital collaborations:", err);
      toast.error("Network error while fetching collaborations");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hospitalId) {
      fetchActiveRequests();
    }
  }, [hospitalId]);

  return (
    <div className="hospital-active-section">
      <h2 className="section-title">Active Doctor Collaborations</h2>
      <p className="section-subtitle">
        Doctors currently working with your hospital
      </p>

      {isLoading ? (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading active collaborations...</p>
        </div>
      ) : activeRequests.length > 0 ? (
        <div className="active-list">
          {activeRequests.map((req, index) => {
            const doctor =
              req.sender?.type === "Doctor"
                ? req.sender.id
                : req.receiver?.type === "Doctor"
                ? req.receiver.id
                : null;

            return (
              <div key={index} className="active-card">
                <h3>{doctor?.name || "Doctor"}</h3>
                <p>
                  <strong>Email:</strong> {doctor?.email || "N/A"}
                </p>
                <p>
                  <strong>Specialities:</strong>{" "}
                  {doctor?.specialities?.join(", ") || "General Practice"}
                </p>
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
            );
          })}
        </div>
      ) : (
        <div className="no-active">
          <p>No active doctor collaborations yet.</p>
        </div>
      )}
    </div>
  );
}
