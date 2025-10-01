import React, { useState } from "react";
import { toast } from "react-toastify";
import "../css/AddJobOpeningModal.css";

export default function AddJobOpeningModal({ hospitalId, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requiredEducation: "",
    requiredSpecialities: [],
    experienceRequired: "",
    salaryRange: { min: "", max: "" },
    location: "",
    applicationDeadline: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSpecialitiesChange = (e) => {
    setFormData({
      ...formData,
      requiredSpecialities: e.target.value
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
    });
  };

  const handleSalaryChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      salaryRange: {
        ...formData.salaryRange,
        [name]: value ? parseInt(value, 10) : "",
      },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:5000/hospital/${hospitalId}/addOpening`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();
      if (res.ok && data.status === "ok") {
        toast.success("Job opening posted!");
        onClose();
      } else {
        toast.error(data.message || "Failed to add job opening");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h3>Add Job Opening</h3>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
      </div>
      <div className="modal-body">
        <form onSubmit={handleSubmit} className="modal-form">
          <input
            type="text"
            name="title"
            placeholder="Job Title (e.g., Cardiologist)"
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Job Description"
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="requiredEducation"
            placeholder="Required Education (e.g., MBBS, MD)"
            onChange={handleChange}
          />
          <input
            type="text"
            name="requiredSpecialities"
            placeholder="Required Specialities (comma separated)"
            onChange={handleSpecialitiesChange}
          />
          <input
            type="text"
            name="experienceRequired"
            placeholder="Experience Required (e.g., 5 years)"
            onChange={handleChange}
          />

          {/* ✅ Separate fields for Salary Min and Max */}
          <div className="salary-fields">
            <input
              type="number"
              name="min"
              placeholder="Minimum Salary"
              value={formData.salaryRange.min}
              onChange={handleSalaryChange}
              required
            />
            <input
              type="number"
              name="max"
              placeholder="Maximum Salary"
              value={formData.salaryRange.max}
              onChange={handleSalaryChange}
              required
            />
          </div>

          <input
            type="text"
            name="location"
            placeholder="Job Location"
            onChange={handleChange}
          />
          <label>Application Deadline</label>
          <input
            type="date"
            name="applicationDeadline"
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Posting..." : "Post Job Opening"}
          </button>
        </form>
      </div>
    </div>
  );
}
