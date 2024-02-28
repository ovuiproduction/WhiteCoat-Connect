import React from 'react';
import Header from './partials/Header';
import "../css/Cover.css";


function Cover() {
  return (
    <>
    <Header />
    <script src="https://kit.fontawesome.com/630e6cad6a.js" crossOrigin="anonymous"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
    <div className="mainContainer">
        <div className="hospitalCon">
            <div className="hospitalConLayer">
            <h1 className="blockHeader">Hospital</h1>
            <div className="controls">
            <button type="button" className="btn  btn-lg">
                    <a href="/loginHospital">
                    <div className="loginCredentials">
                        <i className="fa-regular fa-hospital loginIcon"></i>
                        <h4 className="loginText">Login</h4>
                    </div>
                </a>
            </button>
            <button type="button" className="btn  btn-lg">
                <a href="">
                <div className="loginCredentials">
                    <i className="fa-regular fa-hospital loginIcon"></i>
                    <h4 className="loginText">Signup</h4>
                </div>
            </a>
        </button>
            </div>
        </div>
        </div>

        <div className="doctorCon">
            <div className="doctorConLayer">
        <h1 className="blockHeader" >Doctor</h1>
        <div className="controls">
            <button type="button" className="btn  btn-lg">
                <a href="/loginDoctor">
                <div className="loginCredentials">
                    <i className="fa-solid fa-stethoscope"></i>
                    <h4 className="loginText">Login</h4>
                </div>
            </a>
        </button>
        <button type="button" className="btn  btn-lg">
            <a href="/signupDoctor">
            <div className="loginCredentials">
                <i className="fa-solid fa-stethoscope"></i>
                <h4 className="loginText">Signup</h4>
            </div>
        </a>
    </button>
        </div>
        </div>
        </div>
    </div>
    
    </>
  )
}

export default Cover