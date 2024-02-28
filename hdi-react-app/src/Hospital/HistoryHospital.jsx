import React, { useState,useEffect }  from "react";
import Header from "../partials/Header";
import "./Assests/css/HistoryHospital.css"

export default function HistoryHospital(){
    const [request,setRequest] = useState([]);
    let sno = 1;
    const fetchRequest = async()=>{
        try {
            let response = await fetch("http://localhost:5000/fetchReqest", {
              method: "post",
              body: JSON.stringify(),
              headers: {
                "Content-Type": "application/json",
              },
            });
            if (response.ok) {
              let data = await response.json();
              setRequest(data.data);
            } else {
              console.error("Error:", response.statusText);
            }
          } catch (error) {
            console.error("An error occurred:", error);
          }
    }

    useEffect(() => {
        fetchRequest();
      }, []);
    

    return(
        <>
        <Header />
        <div class="bodyContainer">
        <div class="maincontainer">
        <table class="table">
            <thead class="table-light">
              <tr>
                <th scope="col">Srno.</th>
                <th scope="col">Name</th>
                <th scope="col">Date</th>
                <th scope="col">Salary</th>
                <th scope="col">Role</th>
                <th scope="col">status</th>
              </tr>
            </thead>
            <tbody>
            {request && request.filter(req => req.status.startsWith("Pending")).map(pendingReq =>(
                <tr class="table-warning">
                <th scope="row">{sno++}</th>
                <td>{pendingReq.receiver}</td>
                <td>{pendingReq.dateOfAppeal.slice(0,10)}</td>
                <td>{pendingReq.salary}</td>
                <td>Role</td>
                <td>{pendingReq.status}</td>
                </tr>
            ))}
             {request && request.filter(req => req.status.startsWith("Accepted")).map(pendingReq =>(
                <tr class="table-success">
                <th scope="row">{sno++}</th>
                <td>{pendingReq.receiver}</td>
                <td>{pendingReq.dateOfAppeal.slice(0,10)}</td>
                <td>{pendingReq.salary}</td>
                <td>Role</td>
                <td>{pendingReq.status}</td>
                </tr>
            ))}
            
            {request && request.filter(req => req.status.startsWith("Rejected")).map(pendingReq =>(
                <tr class="table-danger">
                <th scope="row">{sno++}</th>
                <td>{pendingReq.receiver}</td>
                <td>{pendingReq.dateOfAppeal.slice(0,10)}</td>
                <td>{pendingReq.salary}</td>
                <td>Role</td>
                <td>{pendingReq.status}</td>
                </tr>
            ))}
            </tbody>
          </table>  
    </div>
    </div>
        </>
    )
}