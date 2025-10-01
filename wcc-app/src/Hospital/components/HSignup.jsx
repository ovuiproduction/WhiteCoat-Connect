import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const HSignup = ({ onClose, switchToLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    registrationNumber: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Hospital name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.registrationNumber.trim()) {
      newErrors.registrationNumber = "Registration Number is required";
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/hospital/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          registrationNumber: formData.registrationNumber,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === "ok") {
        localStorage.setItem("hospitalId", data.hospitalId);
        toast.success("Signup successful! Please complete your profile.");
        onClose();
        switchToLogin(); // or navigate("/hospital/updateProfile")
      } else {
        setErrors({ submit: data.message || "Signup failed" });
      }
    } catch (err) {
      setErrors({ submit: "Network error, please try again" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h3>Hospital Registration</h3>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="modal-body">
        {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Hospital Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? "error" : ""}`}
              placeholder="Enter hospital name"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? "error" : ""}`}
              placeholder="Enter hospital email"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Phone Number *</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`form-input ${errors.phone ? "error" : ""}`}
              placeholder="Enter hospital phone"
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? "error" : ""}`}
              placeholder="Create a strong password"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Registration Number *</label>
            <input
              type="text"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              className={`form-input ${errors.registrationNumber ? "error" : ""}`}
              placeholder="Enter hospital registration number"
            />
            {errors.registrationNumber && <span className="error-text">{errors.registrationNumber}</span>}
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="checkbox-input"
              />
              <span className="checkmark"></span>
              I agree to the <a href="/terms" className="terms-link">Terms and Conditions</a> and{" "}
              <a href="/privacy" className="terms-link">Privacy Policy</a>
            </label>
            {errors.agreeToTerms && <span className="error-text">{errors.agreeToTerms}</span>}
          </div>

          <button type="submit" className="modal-submit-btn" disabled={isLoading}>
            {isLoading ? "Registering..." : "Create Hospital Account"}
          </button>
        </form>

        <div className="modal-footer">
          <p>
            Already have an account?{" "}
            <button className="link-button" onClick={switchToLogin}>
              Login here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HSignup;
