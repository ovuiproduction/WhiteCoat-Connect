import React from "react";
import { useState } from "react";
import {Link}from "react-router-dom";

import Header from '../partials/Header'
import "./Assests/css/Signup.css";

export default function Dsignup() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [education, setEducation] = useState("");
  const [speciality, setSpeciality] = useState("");

  const onHandleSubmit = async (e) => {
    e.preventDefault();

    const specialityArray = speciality.split(',').map(str => str.trim());
    let result = await fetch("http://localhost:5000/registerDoctor", {
      method: "post",
      body: JSON.stringify({ name, email, password ,education,specialityArray}),
      headers: {
        "Content-Type": "application/json",
      }, 
    })
    .then((response) => response.json())
      .then((data) => {
        console.log(result);
      })
      .catch((error) => {
        console.error('Error submitting form:', error);
      });
  };
  return (
    <>
       <Header />
       <Link className="navbar-brand text-light" to="/">Home</Link>
      <div className="loginHospitalForm">
        <form className="formhospital">
          <div className="mb-3">
            <label htmlFor="userNameDoctor" className="form-label">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              id="userNameDoctor"
              aria-describedby="emailHelp"
            />
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="emailDoctor" className="form-label">
              Email address
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="form-control"
              id="emailDoctor"
              aria-describedby="emailHelp"
            />
            <div id="emailHelp" className="form-text">
              We'll never share your email with anyone else.
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="passwordDoctor" className="form-label">
              Password
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="form-control"
              id="passwordDoctor"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="educationDoctor" className="form-label">
              Education
            </label>
            <input
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              type="text"
              className="form-control"
              id="educationDoctor"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="specialityDoctor" className="form-label">
              Specialities
            </label>
            <input
              value={speciality}
              onChange={(e) => setSpeciality(e.target.value)}
              type="text"
              className="form-control"
              id="specialityDoctor"
            />
          </div>
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="exampleCheck1"
            />
            
            <label className="form-check-label" htmlFor="exampleCheck1">
              Check me out
            </label>
          </div>
          <button onClick={onHandleSubmit}  type="submit" className="btn btn-primary"><Link to="/">Submit</Link></button>
        </form>
      </div>
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
        crossOrigin="anonymous"
      ></script>
    </>
  );
}
