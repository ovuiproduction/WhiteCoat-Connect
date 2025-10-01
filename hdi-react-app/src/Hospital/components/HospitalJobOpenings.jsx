import React, { useEffect, useState } from "react";
import "../css/HospitalJobOpenings.css";

export default function HospitalJobOpenings({ hospitalId }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchJobOpenings = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/hospital/${hospitalId}/jobOpenings`
      );
      const data = await response.json();

      if (response.ok && data.status === "ok") {
        setJobs(data.data || []);
      } else {
        console.error("Failed to fetch jobs:", data.message);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hospitalId) fetchJobOpenings();
  }, [hospitalId]);

  return (
    <div className="job-openings-section">
      <h2 className="section-title">My Job Openings</h2>

      {loading ? (
        <p>Loading job openings...</p>
      ) : jobs.length === 0 ? (
        <p className="no-jobs">No job openings posted yet.</p>
      ) : (
        <div className="job-list">
          {jobs.map((job) => (
            <div key={job._id} className="job-card">
              <div className="job-header">
                <h3 className="job-title">{job.title}</h3>
                <span className={`status-badge ${job.status.toLowerCase()}`}>
                  {job.status}
                </span>
              </div>
              <p className="job-desc">{job.description || "No description"}</p>
              <div className="job-details">
                <p>
                  <strong>Education:</strong> {job.requiredEducation || "N/A"}
                </p>
                <p>
                  <strong>Specialities:</strong>{" "}
                  {job.requiredSpecialities?.length > 0
                    ? job.requiredSpecialities.join(", ")
                    : "N/A"}
                </p>
                <p>
                  <strong>Experience:</strong>{" "}
                  {job.experienceRequired || "Not specified"}
                </p>
                <p>
                  <strong>Salary:</strong>{" "}
                  {job.salaryRange?.min && job.salaryRange?.max
                    ? `₹${job.salaryRange.min.toLocaleString()} - ₹${job.salaryRange.max.toLocaleString()}`
                    : "Negotiable"}
                </p>
                <p>
                  <strong>Location:</strong> {job.location || "N/A"}
                </p>
                <p>
                  <strong>Deadline:</strong>{" "}
                  {job.applicationDeadline
                    ? new Date(job.applicationDeadline).toLocaleDateString()
                    : "Open until filled"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
