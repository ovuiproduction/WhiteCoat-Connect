import React from "react";
import { useState, useEffect } from "react";
import Header from "../partials/Header";
import "./Assests/css/search.css";
import {RequestSent} from './Alert';
import { useNavigate } from 'react-router-dom';

export default function Search() {
  const [name, setName] = useState("");
  const [dataDoctor, setDataDoctor] = useState([]);
  const [status,setStatus] = useState("");
  const navigate = useNavigate();

  const sendRequest = async(doctorEmail)=>{
    const reqDoctorEmail = doctorEmail;
      navigate('/sendRequestForm',{state:reqDoctorEmail});
  }

  const onSubmit = async () => {
    try {
      let responseDoctor = await fetch("http://localhost:5000/findDoctor", {
        method: "post",
        body: JSON.stringify({ name }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (responseDoctor.ok) {
        let data = await responseDoctor.json();
        setDataDoctor(data.data);
      } else {
        console.error("Error:", responseDoctor.statusText);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    onSubmit();
  }, []);

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
        crossOrigin="anonymous"
      ></link>
      <Header />
      {/* {status == "ok" && <RequestSent/> }   */}
      <div className="rootParentSearch">
        <div className="searchBlock">
          <div className="input-group mb-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              className="form-control"
              placeholder="Enter Name or Role"
              aria-label="Recipient's username"
              aria-describedby="button-addon2"
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              id="button-addon2"
            >
              Search
            </button>
          </div>
        </div>

        <div className="FilterBlock">
          <div className="proffessionBlock">
            <div className="professionText">Profeessions</div>
            <div className="proffessions">
              <div className="surgeonBlock pbele">Surgeon</div>
              <div className="orthopedicsBlock pbele">Surgeon</div>
              <div className="radiologyBlock pbele">Surgeon</div>
              <div className="entBlock pbele">Surgeon</div>
            </div>
          </div>
          <div className="salaryBlock">
            <div className="salaryText">Salary</div>
            <div className="salaryRanges">
              <div className="rangel pbele">Salary</div>
              <div className="range2 pbele">Salary</div>
              <div className="range3 pbele">Salary</div>
              <div className="range4 pbele">Salary</div>
            </div>
          </div>
        </div>
        <div className="displayResult">
          <div className="searchresult">
          {dataDoctor.filter(doctor => doctor.name.startsWith(name)).map(filteredDoctor => (
              <div className="card cardbody">
                <img  src="https://png.pngtree.com/png-clipart/20220911/original/pngtree-male-doctor-avatar-icon-illustration-png-image_8537702.png" className="card-img-top avatarImg" alt="..." />
                <div className="card-body">
                  <h5 className="card-title">{filteredDoctor.name}</h5>
                  <p className="card-text">Email : {filteredDoctor.email}</p>
                  <button onClick={()=>sendRequest(filteredDoctor.email)} type="button" class="btn btn-primary">send request</button>
                </div>
              </div>
            ))};
          </div>
        </div>
      </div>

      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL"
        crossOrigin="anonymous"
      ></script>
    </>
  );
}
