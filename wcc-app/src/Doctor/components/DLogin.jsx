import React, { useState } from "react";
import "../css/Login.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const DLogin = ({ onClose, switchToSignup }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/doctor/login", {
        method: "POST",
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setStatus(data.status);

      if (response.ok && data.status === "ok") {
        // Store JWT token (session or local depending on rememberMe)
        if (formData.rememberMe) {
          localStorage.setItem("doctorToken", data.token);
          localStorage.setItem("doctorId", data.doctorId);
        } else {
          sessionStorage.setItem("doctorToken", data.token);
          sessionStorage.setItem("doctorId", data.doctorId);
        }

        onClose();
        toast.success("Login Successfully!");
        sessionStorage.setItem(
          "hostDoctor",
          JSON.stringify({
            doctorId: data.doctorId,
            email: formData.email,
            token: data.token,
          })
        );
        sessionStorage.setItem("userId", data.doctorId);
        sessionStorage.setItem("userType", "Doctor"); // "Doctor" or "Hospital"
        navigate("/homeDoctor", { state: { doctorId: data.doctorId } });
      } else {
        setErrors({ submit: data.message || "Login failed" });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header doctor-modal-header">
        <h3>Doctor Login</h3>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
      </div>

      <div className="modal-body">
        {errors.submit && (
          <div className="alert alert-danger">{errors.submit}</div>
        )}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="doctorLoginEmail" className="form-label">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? "error" : ""}`}
              id="doctorLoginEmail"
              placeholder="Enter your professional email"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="doctorLoginPassword" className="form-label">
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? "error" : ""}`}
              id="doctorLoginPassword"
              placeholder="Enter your password"
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="checkbox-input"
              />
              <span className="checkmark"></span>
              Remember me
            </label>
            <button
              type="button"
              className="forgot-password-btn doctor-forgot-password"
            >
              Forgot Password?
            </button>
          </div>

          <button
            type="submit"
            className="modal-submit-btn doctor-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="spinner"></div>
                Signing In...
              </>
            ) : (
              "Access Doctor Portal"
            )}
          </button>
        </form>

        <div className="modal-footer">
          <p>
            Don’t have a doctor account?{" "}
            <button
              className="link-button doctor-link-button"
              onClick={switchToSignup}
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DLogin;
