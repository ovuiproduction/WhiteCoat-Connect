import React, { useState, useEffect } from "react";
import "../css/SearchDoctor.css";
import { toast } from "react-toastify";

export default function SearchDoctor() {
  const [searchQuery, setSearchQuery] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [filters, setFilters] = useState({
    profession: "",
    salaryRange: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // Request Modal State
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // 🔹 Fetch all doctors on mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  // 🔹 Filter doctors whenever search query or filters change
  useEffect(() => {
    filterDoctors();
  }, [doctors, searchQuery, filters]);

  // Fetch doctors from backend
  const fetchDoctors = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/hospital/getDoctors");
      const data = await response.json();
      if (response.ok && data.status === "ok") {
        setDoctors(data.data || []);
        setSearchPerformed(true);
      } else {
        toast.error(data.message || "Failed to fetch doctors");
      }
    } catch (error) {
      console.error("Error fetching doctors:", error);
      toast.error("Network error while fetching doctors");
    } finally {
      setIsLoading(false);
    }
  };

  const filterDoctors = () => {
    let filtered = doctors.filter((doctor) => {
      const matchesSearch =
        doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.specialities?.some((s) =>
          s.toLowerCase().includes(searchQuery.toLowerCase())
        );
      const matchesProfession =
        !filters.profession ||
        doctor.specialities?.includes(filters.profession);
      const matchesSalary =
        !filters.salaryRange ||
        checkSalaryRange(doctor.expectedSalary, filters.salaryRange);

      return matchesSearch && matchesProfession && matchesSalary;
    });
    setFilteredDoctors(filtered);
  };

  const checkSalaryRange = (salary, range) => {
    const salaryNum = parseFloat(salary) || 0;
    switch (range) {
      case "0-50k":
        return salaryNum <= 50000;
      case "50k-100k":
        return salaryNum > 50000 && salaryNum <= 100000;
      case "100k-150k":
        return salaryNum > 100000 && salaryNum <= 150000;
      case "150k+":
        return salaryNum > 150000;
      default:
        return true;
    }
  };

  const handleSearch = () => {
    filterDoctors();
  };

  // inside SearchDoctor.jsx
  const [requestForm, setRequestForm] = useState({
    salaryMin: "",
    salaryMax: "",
    expireDate: "",
    location: "",
    role: "",
    message: "",
  });

  // 🔹 Send collaboration request
  const sendRequest = async () => {
    try {
      const hospitalSession = JSON.parse(
        localStorage.getItem("hospitalSession") ||
          sessionStorage.getItem("hospitalSession")
      );
      const hospitalId = hospitalSession?.hospitalId;

      if (!hospitalId) {
        toast.error("Hospital not logged in!");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/hospital/sendRequest",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            hospitalId,
            doctorId: selectedDoctor._id,
            salaryMin: requestForm.salaryMin,
            salaryMax: requestForm.salaryMax,
            expireDate: requestForm.expireDate,
            location: requestForm.location,
            role: requestForm.role,
            message: requestForm.message,
          }),
        }
      );

      const data = await response.json();
      if (response.ok && data.status === "ok") {
        toast.success("Request sent successfully!");
        setSelectedDoctor(null); // close modal
        setRequestForm({
          salaryMin: "",
          salaryMax: "",
          expireDate: "",
          location: "",
          role: "",
          message: "",
        });
      } else {
        toast.error(data.message || "Failed to send request");
      }
    } catch (error) {
      console.error("Error sending request:", error);
      toast.error("Network error while sending request");
    }
  };

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

  const salaryRanges = ["0-50k", "50k-100k", "100k-150k", "150k+"];

  const clearFilters = () => {
    setFilters({ profession: "", salaryRange: "" });
    setSearchQuery("");
  };

  return (
    <div className="search-doctor-section">
      <h2 className="section-title">Find Medical Professionals</h2>

      {/* Search Form */}
      <div className="search-form">
        <div className="search-input-wrapper">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search by doctor name, specialization..."
            className="search-input"
          />
          <button onClick={handleSearch} className="search-btn">
            🔍 Search
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <div className="filter-header">
          <h3 className="filter-title">Refine Your Search</h3>
          <button onClick={clearFilters} className="clear-filters-btn">
            Clear All
          </button>
        </div>

        <div className="filter-group">
          <label className="filter-label">Specialization</label>
          <div className="filter-options">
            {professions.map((prof) => (
              <button
                key={prof}
                className={`filter-chip ${
                  filters.profession === prof ? "active" : ""
                }`}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    profession: prev.profession === prof ? "" : prof,
                  }))
                }
              >
                {prof}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Expected Salary</label>
          <div className="filter-options">
            {salaryRanges.map((range) => (
              <button
                key={range}
                className={`filter-chip ${
                  filters.salaryRange === range ? "active" : ""
                }`}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    salaryRange: prev.salaryRange === range ? "" : range,
                  }))
                }
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="results-section">
        {isLoading ? (
          <div className="loading">
            <div className="spinner"></div>
          </div>
        ) : (
          <>
            <h3 className="results-count">
              {filteredDoctors.length} Medical Professional
              {filteredDoctors.length !== 1 ? "s" : ""} Found
            </h3>
            <div className="doctors-grid">
              {filteredDoctors.length > 0 ? (
                filteredDoctors.map((doctor) => (
                  <div key={doctor._id} className="doctor-card">
                    <div className="doctor-avatar">
                      <img
                        src={
                          doctor.profileImage ||
                          "https://cdn-icons-png.flaticon.com/512/387/387561.png"
                        }
                        alt={doctor.name}
                      />
                    </div>
                    <div className="doctor-info">
                      <h3 className="doctor-name">{doctor.name}</h3>
                      <p className="doctor-role">
                        {doctor.education?.join(", ") || "Medical Professional"}
                      </p>
                      <p className="doctor-role">
                        {doctor.specialities?.join(", ") || "General Practice"}
                      </p>
                      <p className="doctor-email">{doctor.email}</p>
                      <div className="doctor-meta">
                        <span>
                          <strong>Experience:</strong>{" "}
                          {doctor.yearsOfExperience} yrs
                        </span>
                        <span>
                          <strong>Expected Salary:</strong>{" "}
                          {doctor.expectedSalary || "N/A"}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedDoctor(doctor)}
                        className="request-btn"
                      >
                        Send Collaboration Request
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <p>
                    {searchPerformed
                      ? "No doctors found. Try adjusting your search filters."
                      : "Use the search bar above to find doctors."}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {selectedDoctor && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Send Request to {selectedDoctor.name}</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendRequest();
              }}
            >
              <input
                type="text"
                placeholder="Role (e.g. Cardiologist)"
                value={requestForm.role}
                onChange={(e) =>
                  setRequestForm({ ...requestForm, role: e.target.value })
                }
              />
              <div className="salary-inputs">
                <input
                  type="number"
                  placeholder="Min Salary"
                  value={requestForm.salaryMin}
                  onChange={(e) =>
                    setRequestForm({
                      ...requestForm,
                      salaryMin: e.target.value,
                    })
                  }
                  required
                />
                <input
                  type="number"
                  placeholder="Max Salary"
                  value={requestForm.salaryMax}
                  onChange={(e) =>
                    setRequestForm({
                      ...requestForm,
                      salaryMax: e.target.value,
                    })
                  }
                />
              </div>
              <input
                type="date"
                placeholder="Expiry Date"
                value={requestForm.expireDate}
                onChange={(e) =>
                  setRequestForm({ ...requestForm, expireDate: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Work Location"
                value={requestForm.location}
                onChange={(e) =>
                  setRequestForm({ ...requestForm, location: e.target.value })
                }
              />
              <textarea
                placeholder="Message (optional)"
                value={requestForm.message}
                onChange={(e) =>
                  setRequestForm({ ...requestForm, message: e.target.value })
                }
              ></textarea>

              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  Send Request
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setSelectedDoctor(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
