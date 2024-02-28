import React from 'react';
import Header from '../components/partials/Header';
import { useState } from 'react';
import "./Assests/css/Login.css";
import {AlertSuccess,AlertWarning,AlertDanger} from './Alert';
import { useNavigate } from 'react-router-dom';


export default function HLogin() {

    const navigate = useNavigate();
    const [email , setEmail] = useState("");
    const [password , setPassword] = useState("");

    const [status ,setStatus] = useState("");

    const onSubmit = async(e)=>{

    e.preventDefault();

    let result = await fetch("http://localhost:5000/loginhospital", {
      method: "post",
      body: JSON.stringify({email, password}),
      headers: {
        "Content-Type": "application/json",
      }, 
    })
    .then((response) => response.json())
      .then((data) => {
        setStatus(data.status);
      })
      .catch((error) => {
        console.error('Error submitting form:', error);
      });
    }

  return (
    <>
    <Header />
    
    <div className="loginBlock">
    <form className="loginForm" >
    {status == "ok" && <AlertSuccess/> && navigate("/homeHospital")}  
    {status == "user not found" && <AlertWarning/>}  
    {status == "password Incorrect" && <AlertDanger/>}  
  <div className="mb-3">
    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
    <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
  </div>
  <div className="mb-3">
    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
    <input  value={password} onChange={(e)=>setPassword(e.target.value)} type="password" className="form-control" id="exampleInputPassword1" />
  </div>
  <div className="mb-3 form-check">
    <input type="checkbox" className="form-check-input" id="exampleCheck1" />
    <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
  </div>
  <button onClick={onSubmit} type="submit" className="btn btn-primary">Submit</button>
</form>
    </div>  
    </>
  )
}