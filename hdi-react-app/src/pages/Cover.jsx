import React, { useState } from "react";
import "../css/Cover.css";
import HLogin from "../Hospital/components/HLogin";
import HSignup from "../Hospital/components/HSignup";
import DLogin from "../Doctor/components/DLogin";
import DSignup from "../Doctor/components/DSignup";

function Cover() {
  const [activeModal, setActiveModal] = useState(null);

  // Modal handlers
  const openHospitalLogin = () => setActiveModal("hospital-login");
  const openHospitalSignup = () => setActiveModal("hospital-signup");
  const openDoctorLogin = () => setActiveModal("doctor-login");
  const openDoctorSignup = () => setActiveModal("doctor-signup");
  const closeModal = () => setActiveModal(null);

  const switchToHospitalSignup = () => setActiveModal("hospital-signup");
  const switchToHospitalLogin = () => setActiveModal("hospital-login");
  const switchToDoctorSignup = () => setActiveModal("doctor-signup");
  const switchToDoctorLogin = () => setActiveModal("doctor-login");

  return (
    <div className="cover-container">
      {/* Header */}
      <header className="cover-header">
        <div className="header-content">
          <div className="logo">
            <h1>HDI</h1>
            <span>Healthcare Interface</span>
          </div>
          <nav className="nav-menu">
            <button className="nav-link">
              About
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="cover-main">
        
        <div className="hero-section-cover">
          <div className="hero-content-cover">
            <h1 className="hero-title-cover">Welcome to Healthcare Digital Interface</h1>
            <p className="hero-subtitle-cover">
              Connecting Hospitals and Doctors for Better Patient Care
            </p>
          </div>
        </div>

        <div className="cards-container">
          {/* Hospital Section */}
          <div className="card hospital-card">
            <div className="card-icon">🏥</div>
            <h2 className="card-title">Hospital Portal</h2>
            <p className="card-description">
              Manage your hospital operations, patient records, and medical staff efficiently
            </p>
            <div className="card-actions">
              <button 
                className="btn btn-primary hospital-btn"
                onClick={openHospitalLogin}
              >
                <span className="btn-icon">→</span>
                <span>Hospital Login</span>
              </button>
              <button 
                className="btn btn-secondary hospital-btn"
                onClick={openHospitalSignup}
              >
                <span className="btn-icon">+</span>
                <span>Hospital Signup</span>
              </button>
            </div>
          </div>

          {/* Doctor Section */}
          <div className="card doctor-card-cover">
            <div className="card-icon">🩺</div>
            <h2 className="card-title">Doctor Portal</h2>
            <p className="card-description">
              Access patient information, manage appointments, and provide quality care
            </p>
            <div className="card-actions">
              <button 
                className="btn btn-primary doctor-btn"
                onClick={openDoctorLogin}
              >
                <span className="btn-icon">→</span>
                <span>Doctor Login</span>
              </button>
              <button 
                className="btn btn-secondary doctor-btn"
                onClick={openDoctorSignup}
              >
                <span className="btn-icon">+</span>
                <span>Doctor Signup</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="cover-footer">
        <p>&copy; 2024 Healthcare Digital Interface. All rights reserved.</p>
      </footer>

      {/* Modals */}
      {activeModal && (
        <div className="modal-overlay" onClick={closeModal}>
          {activeModal === "hospital-login" && (
            <HLogin 
              onClose={closeModal} 
              switchToSignup={switchToHospitalSignup}
            />
          )}
          {activeModal === "hospital-signup" && (
            <HSignup 
              onClose={closeModal} 
              switchToLogin={switchToHospitalLogin}
            />
          )}
          {activeModal === "doctor-login" && (
            <DLogin 
              onClose={closeModal} 
              switchToSignup={switchToDoctorSignup}
            />
          )}
          {activeModal === "doctor-signup" && (
            <DSignup 
              onClose={closeModal} 
              switchToLogin={switchToDoctorLogin}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default Cover;