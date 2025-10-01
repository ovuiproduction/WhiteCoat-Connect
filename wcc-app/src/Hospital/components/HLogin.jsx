import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const HLogin = ({ onClose, switchToSignup }) => {
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
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email";
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
      const response = await fetch("http://localhost:5000/hospital/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      setStatus(data.status);

      if (response.ok && data.status === "ok") {
        // Save session
        const sessionData = {
          hospitalId: data.hospitalId,
          token: data.token,
          email: formData.email,
        };
        if (formData.rememberMe) {
          localStorage.setItem("hospitalSession", JSON.stringify(sessionData));
        } else {
          sessionStorage.setItem("hospitalSession", JSON.stringify(sessionData));
        }

        toast.success("Login Successfully");
        onClose();
        navigate("/homeHospital", { state: { hospitalId: data.hospitalId } });
      } else {
        setErrors({ submit: data.message || "Login failed" });
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setErrors({ submit: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <div className="modal-header">
        <h3>Hospital Login</h3>
        <button className="modal-close" onClick={onClose}>×</button>
      </div>

      <div className="modal-body">
        {errors.submit && <div className="alert alert-danger">{errors.submit}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
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
            <label className="form-label">Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`form-input ${errors.password ? "error" : ""}`}
              placeholder="Enter password"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
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
            <button type="button" className="forgot-password-btn">
              Forgot Password?
            </button>
          </div>

          <button type="submit" className="modal-submit-btn" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In to Hospital Portal"}
          </button>
        </form>

        <div className="modal-footer">
          <p>
            Don’t have a hospital account?{" "}
            <button className="link-button" onClick={switchToSignup}>
              Create one here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HLogin;
