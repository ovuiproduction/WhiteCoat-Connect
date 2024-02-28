import react, { useEffect, useState} from "react";
import Header from "../partials/Header";
import "./Assests/css/requestControl.css";
import { useLocation ,useNavigate} from "react-router-dom";
export default function RequestControl() {
  const location = useLocation();
  let [Hname, setHname] = useState("");
  let [Hlocation, setHlocation] = useState("");
  let [HAppealDate, setHAppealDate] = useState("");
  let [HExpireDate, setHExpireDate] = useState("");
  let [Hsalary, setSalary] = useState("");
  let [id,setId] = useState("");
  let navigate = useNavigate();
  useEffect(() => {
    setHname(location.state.sender);
    setHlocation(location.state.location);
    setHExpireDate(location.state.expireDate);
    setHAppealDate(location.state.dateOfAppeal);
    setSalary(location.state.salary);
    setId(location.state._id);
  }, []);

  const acceptRequest = async()=>{
    try{
        let result = await fetch("http://localhost:5000/acceptRequest", {
      method: "post",
      body: JSON.stringify({id}),
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
    }catch(err){
        console.log(err);
    }
    navigate('/homeDoctor');
  }
  const rejectRequest = async()=>{
    try{
        let result = await fetch("http://localhost:5000/rejectRequest", {
      method: "post",
      body: JSON.stringify({id}),
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
    }catch(err){
        console.log(err);
    }
    navigate('/homeDoctor');
  }


  return (
    <>
      <Header />
     <div class="maincontainer">
        <div class="hospitalName">
          <h2>{Hname}</h2>
        </div>
        <div class="mainBlock">
          <div class="locationBlock">
            <p>Location : {Hlocation}</p>
          </div>
          <div class="roleBlock">
            <p>Offered Salary : {Hsalary}</p>
          </div>
          <div class="dateBlock">
            <p>Date Of Appeal  {HAppealDate.slice(0, 10)}</p>
            <p>Date of Expire  {HExpireDate.slice(0, 10)}</p>
          </div>
          <div class="ratingsHospital">
            <p>Rating Of Hospital : 4+</p>
          </div>
        </div>
        <div class="controls">
          <button style={{backgroundColor:"green"}} type="button" onClick={acceptRequest} className="acceptBtn">
            Accept
          </button>
          <button style={{backgroundColor:"red"}} type="button" onClick={rejectRequest} className="rejectBtn">
            Reject
          </button>
        </div>
      </div>
        </>
  );
}
