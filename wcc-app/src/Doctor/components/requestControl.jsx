import React, { useEffect, useState } from "react";
import "../css/requestControl.css";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function RequestControl() {
  const location = useLocation();
  const navigate = useNavigate();

  const [hospitalName, setHospitalName] = useState("");
  const [locationName, setLocationName] = useState("");
  const [appealDate, setAppealDate] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [salary, setSalary] = useState({});
  const [role, setRole] = useState("");
  const [requestId, setRequestId] = useState("");

  useEffect(() => {
    if (location.state) {
      setHospitalName(location.state.sender?.id?.name || "Hospital");
      setLocationName(location.state.location || "Not specified");
      setAppealDate(location.state.dateOfAppeal);
      setExpireDate(location.state.expireDate);
      setSalary(location.state.salary || {});
      setRole(location.state.role || "Medical Consultant");
      setRequestId(location.state._id);
    }
  }, [location.state]);

  const handleRequestAction = async (action) => {
    try {
      const response = await fetch(`http://localhost:5000/doctor/requests/${action}`, {
        method: "POST",
        body: JSON.stringify({ requestId }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (response.ok && data.status === "ok") {
        toast.success(`Request ${action}ed successfully!`);
        navigate("/homeDoctor");
      } else {
        toast.error(data.message || `Failed to ${action} request`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error");
    }
  };

  return (
    <div className="maincontainer">
      <div className="hospitalName">
        <h2>{hospitalName}</h2>
      </div>

      <div className="mainBlock">
        <div className="locationBlock">
          <p>
            <strong>Location:</strong> {locationName}
          </p>
        </div>
        <div className="roleBlock">
          <p>
            <strong>Role:</strong> {role}
          </p>
          <p>
            <strong>Offered Salary:</strong>{" "}
            {salary.min && salary.max
              ? `₹${salary.min.toLocaleString()} - ₹${salary.max.toLocaleString()}`
              : "Not specified"}
          </p>
        </div>
        <div className="dateBlock">
          <p>
            <strong>Date Of Appeal:</strong>{" "}
            {appealDate ? appealDate.slice(0, 10) : "N/A"}
          </p>
          <p>
            <strong>Date of Expiry:</strong>{" "}
            {expireDate ? expireDate.slice(0, 10) : "N/A"}
          </p>
        </div>
        <div className="ratingsHospital">
          <p>
            <strong>Rating Of Hospital:</strong> ⭐ 4+
          </p>
        </div>
      </div>

      <div className="controls">
        <button
          style={{ backgroundColor: "green" }}
          type="button"
          onClick={() => handleRequestAction("accept")}
          className="acceptBtn"
        >
          Accept
        </button>
        <button
          style={{ backgroundColor: "red" }}
          type="button"
          onClick={() => handleRequestAction("reject")}
          className="rejectBtn"
        >
          Reject
        </button>
      </div>
    </div>
  );
}
