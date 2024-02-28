import React, { useState,useEffect } from "react";
import {useNavigate} from 'react-router-dom';
import Header from "../partials/Header";
import "./Assests/css/Home.css";

export default function DHome() {
    const navigate = useNavigate();
    const [Notifications ,setNotifications] = useState([]);

    const submit = async(notification)=>{
      navigate('/requestControl',{state:notification});
    }

    const getNotify = async()=>{
    try{
      let responses = await fetch("http://localhost:5000/getNotifications", {
        method: "post",
        body: JSON.stringify(),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (responses.ok) {
        let data = await responses.json();
        setNotifications(data.data);

      } else {
        console.error("Error:", responseDoctor.statusText);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
    };

    useEffect(() => {
      getNotify();
    }, []);

  return (
    <>
      <Header />
      <div className="mainBodyDoctor">
      <h1 className="welcome">Welcome Doctor</h1>
      <button
        class="btn btn-primary"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#offcanvasScrolling"
        aria-controls="offcanvasScrolling"
      >
        Notifications
        <span class="badge text-bg-dark rounded-pill">14</span>
      </button>

      <div
        class="offcanvas offcanvas-start"
        data-bs-scroll="true"
        data-bs-backdrop="false"
        tabindex="-1"
        id="offcanvasScrolling"
        aria-labelledby="offcanvasScrollingLabel"
      >
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="offcanvasScrollingLabel">
            Notifications
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div class="offcanvas-body">
          <ul class="list-group">
            { Notifications.filter(notify => notify.status.startsWith("Pending")).map(notification=>(
            <li class="list-group-item">
                <div class="notificationBox">
                    <h5><button onClick={()=>submit(notification)} type="button" >{notification.sender}</button></h5>
                    <p>Ex. Date: {notification.expireDate && notification.expireDate.slice(0,10)}</p>
                </div>
            </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="chatLinkBlock">
        <a className="chatlink" href="/chatDoctor">Chat</a>
      </div>
      </div>
    </>
  );
}
