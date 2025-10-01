import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import "../css/UpdateHospitalProfile.css"

export default function UpdateHospitalProfile({ onClose, onProfileUpdated }) {
  const hospitalSession = JSON.parse(
    sessionStorage.getItem("hospitalSession") ||
    localStorage.getItem("hospitalSession")
  );
  const hospitalId = hospitalSession?.hospitalId;

  const [formData, setFormData] = useState({
    type: "",
    address: { street: "", city: "", state: "", country: "", pincode: "" },
    bedCapacity: "",
    departments: [],
    servicesArray: [],
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (field, value) => {
    setFormData({
      ...formData,
      address: { ...formData.address, [field]: value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/hospital/updateProfile/${hospitalId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();

      if (res.ok && data.status === "ok") {
        toast.success("Profile updated successfully!");
        if (onProfileUpdated) onProfileUpdated(); // refresh parent state
        if (onClose) onClose(); // close modal
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overlay-modal">
      <div className="modal-box">
        <h2>Update Hospital Profile</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="type"
            placeholder="Hospital Type (Private/Government)"
            onChange={handleChange}
          />
          <input
            type="number"
            name="bedCapacity"
            placeholder="Bed Capacity"
            onChange={handleChange}
          />
          <textarea
            name="departments"
            placeholder="Departments (comma separated)"
            onChange={(e) =>
              setFormData({
                ...formData,
                departments: e.target.value.split(",").map((d) => d.trim()),
              })
            }
          />
          <textarea
            name="servicesArray"
            placeholder="Services (comma separated)"
            onChange={(e) =>
              setFormData({
                ...formData,
                servicesArray: e.target.value.split(",").map((s) => s.trim()),
              })
            }
          />

          {/* Address Section */}
          <h4>Address</h4>
          <input
            type="text"
            placeholder="Street"
            onChange={(e) => handleAddressChange("street", e.target.value)}
          />
          <input
            type="text"
            placeholder="City"
            onChange={(e) => handleAddressChange("city", e.target.value)}
          />
          <input
            type="text"
            placeholder="State"
            onChange={(e) => handleAddressChange("state", e.target.value)}
          />
          <input
            type="text"
            placeholder="Country"
            onChange={(e) => handleAddressChange("country", e.target.value)}
          />
          <input
            type="text"
            placeholder="Pincode"
            onChange={(e) => handleAddressChange("pincode", e.target.value)}
          />

          <div className="modal-actions">
            <button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Save Profile"}
            </button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
