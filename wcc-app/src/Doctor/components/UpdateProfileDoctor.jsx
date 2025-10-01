import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../css/UpdateProfile.css";

// Predefined lists
const professions = [
  "Cardiologist",
  "Neurologist",
  "Orthopedic Surgeon",
  "Pediatrician",
  "Radiologist",
  "General Surgeon",
  "ENT Specialist",
  "Dermatologist",
  "Psychiatrist",
  "Oncologist",
  "Urologist",
  "Ophthalmologist",
];

const degrees = [
  "MBBS",
  "MD",
  "MS",
  "DM",
  "MCh",
  "BDS",
  "BAMS",
  "BHMS",
  "BNYS",
  "BPT",
  "BSc Nursing",
  "MSc Nursing",
  "PhD",
  "DNB",
  "MRCP",
  "FRCS",
];

export default function UpdateProfileDoctor({ isOpen, onClose, doctor }) {
  const location = useLocation();
  const navigate = useNavigate();
  const doctorData = doctor || location.state?.doctor || {};
  const doctorId =
    localStorage.getItem("doctorId") || sessionStorage.getItem("doctorId");

  const [formData, setFormData] = useState({
    education: doctorData.education || [],
    specialities: doctorData.specialities || [],
    yearsOfExperience: doctorData.yearsOfExperience || "",
    expectedSalary: doctorData.expectedSalary || "",
    bio: doctorData.bio || "",
    city: doctorData.city || "",
    state: doctorData.state || "",
    country: doctorData.country || "",
  });

  const [customEducation, setCustomEducation] = useState("");
  const [customSpeciality, setCustomSpeciality] = useState("");
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens with new doctor data
  useEffect(() => {
    if (isOpen && doctor) {
      setFormData({
        education: doctor.education || [],
        specialities: doctor.specialities || [],
        yearsOfExperience: doctor.yearsOfExperience || "",
        expectedSalary: doctor.expectedSalary || "",
        bio: doctor.bio || "",
        city: doctor.city || "",
        state: doctor.state || "",
        country: doctor.country || "",
      });
    }
    setCustomEducation("");
    setCustomSpeciality("");
  }, [isOpen, doctor]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Add education from select
  const handleAddEducation = (e) => {
    const value = e.target.value;
    if (value && !formData.education.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        education: [...prev.education, value],
      }));
    }
    e.target.value = ""; // Reset select
  };

  // Add custom education
  const handleAddCustomEducation = () => {
    const trimmed = customEducation.trim();
    if (trimmed && !formData.education.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        education: [...prev.education, trimmed],
      }));
      setCustomEducation("");
    }
  };

  // Add speciality from select
  const handleAddSpeciality = (e) => {
    const value = e.target.value;
    if (value && !formData.specialities.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        specialities: [...prev.specialities, value],
      }));
    }
    e.target.value = ""; // Reset select
  };

  // Add custom speciality
  const handleAddCustomSpeciality = () => {
    const trimmed = customSpeciality.trim();
    if (trimmed && !formData.specialities.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        specialities: [...prev.specialities, trimmed],
      }));
      setCustomSpeciality("");
    }
  };

  const handleRemoveItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/doctor/updateProfile/${doctorId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok && data.status === "ok") {
        toast.success("Profile updated successfully!");
        onClose();
        if (window.location.pathname === "/homeDoctor") {
          window.location.reload();
        }
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Network error, please try again");
    } finally {
      setLoading(false);
    }
  };

  // Close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.keyCode === 27 && isOpen) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Update Profile</h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        
        <form className="profile-update-form" onSubmit={handleSubmit}>
          {/* Education */}
          <div className="form-group">
            <label>Education</label>
            <div className="tags-container">
              {formData.education.map((edu, idx) => (
                <span key={idx} className="tag">
                  {edu}
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => handleRemoveItem("education", idx)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            
            <div className="select-with-add">
              <select 
                className="form-select"
                onChange={handleAddEducation}
                defaultValue=""
              >
                <option value="">Select a degree...</option>
                {degrees.map((degree, index) => (
                  <option key={index} value={degree}>
                    {degree}
                  </option>
                ))}
              </select>
              <span className="select-divider">or</span>
              <div className="custom-input-group">
                <input
                  type="text"
                  value={customEducation}
                  onChange={(e) => setCustomEducation(e.target.value)}
                  placeholder="Add custom degree..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomEducation();
                    }
                  }}
                />
                <button 
                  type="button" 
                  className="add-custom-btn"
                  onClick={handleAddCustomEducation}
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Specialities */}
          <div className="form-group">
            <label>Specialities</label>
            <div className="tags-container">
              {formData.specialities.map((spec, idx) => (
                <span key={idx} className="tag">
                  {spec}
                  <button
                    type="button"
                    className="remove-btn"
                    onClick={() => handleRemoveItem("specialities", idx)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            
            <div className="select-with-add">
              <select 
                className="form-select"
                onChange={handleAddSpeciality}
                defaultValue=""
              >
                <option value="">Select a speciality...</option>
                {professions.map((profession, index) => (
                  <option key={index} value={profession}>
                    {profession}
                  </option>
                ))}
              </select>
              <span className="select-divider">or</span>
              <div className="custom-input-group">
                <input
                  type="text"
                  value={customSpeciality}
                  onChange={(e) => setCustomSpeciality(e.target.value)}
                  placeholder="Add custom speciality..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddCustomSpeciality();
                    }
                  }}
                />
                <button 
                  type="button" 
                  className="add-custom-btn"
                  onClick={handleAddCustomSpeciality}
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Years of Experience</label>
              <input
                type="number"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                placeholder="Enter years of experience"
              />
            </div>

            <div className="form-group">
              <label>Expected Salary</label>
              <input
                type="number"
                name="expectedSalary"
                value={formData.expectedSalary}
                onChange={handleChange}
                placeholder="Enter expected salary"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
              placeholder="Short professional summary..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
              />
            </div>

            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state"
              />
            </div>

            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Enter country"
              />
            </div>
          </div>

          <div className="modal-actions">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}