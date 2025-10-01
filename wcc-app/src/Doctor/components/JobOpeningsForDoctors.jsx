import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "../css/JobOpenings.css";

export default function JobOpeningsForDoctors({ doctorId }) {
  const [jobOpenings, setJobOpenings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchJobOpenings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/doctor/jobOpenings/${doctorId}`);
      const data = await response.json();
      if (response.ok && data.status === "ok") {
        setJobOpenings(data.data);
      } else {
        toast.error(data.message || "Failed to fetch job openings");
      }
    } catch (err) {
      toast.error("Network error while fetching jobs");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobOpenings();
  }, []);

  const applyForJob = async (job) => {
    if (job.applied) {
      toast.info("You have already applied for this job");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/doctor/applyJob", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId,
          hospitalId: job.hospital._id,
          jobOpeningId: job._id,
          role: job.title,
          location: job.location,
          salary: job.salaryRange,
        }),
      });

      const data = await response.json();
      if (response.ok && data.status === "ok") {
        toast.success("Applied successfully!");
        fetchJobOpenings(); // refresh to mark as applied
      } else {
        toast.error(data.message || "Failed to apply");
      }
    } catch (err) {
      toast.error("Network error while applying");
      console.error(err);
    }
  };

  return (
    <div className="job-openings-section">
      <h2 className="section-title">Available Job Openings</h2>

      {isLoading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : jobOpenings.length > 0 ? (
        <div className="job-grid">
          {jobOpenings.map((job) => (
            <div key={job._id} className="job-card">
              <h3>{job.title}</h3>
              <p><strong>Hospital:</strong> {job.hospital.name}</p>
              <p><strong>Hospital Email:</strong> {job.hospital.email}</p>
              <p><strong>Hospital Phone:</strong> {job.hospital.phone}</p>
              <p><strong>Location:</strong> {job.location}</p>
              <p><strong>Education:</strong> {job.requiredEducation}</p>
              <p><strong>Specialities:</strong> {job.requiredSpecialities?.join(", ")}</p>
              <p><strong>Experience:</strong> {job.experienceRequired}</p>
              <p><strong>Salary:</strong> {job.salaryRange?.min} - {job.salaryRange?.max}</p>
              <p><strong>Deadline:</strong> {job.applicationDeadline?.slice(0, 10)}</p>

              <button
                className={`apply-btn ${job.applied ? "applied" : ""}`}
                onClick={() => applyForJob(job)}
                disabled={job.applied}
              >
                {job.applied ? "Already Applied" : "Apply Now"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No job openings available.</p>
      )}
    </div>
  );
}
