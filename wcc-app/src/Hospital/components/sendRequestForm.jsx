import react, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/sendRequestForm.css";

export default function DoctorRequestForm() {
  const navigate = useNavigate();
  let [status, setStatus] = useState("");
  let [expireDate, setExpireDate] = useState("");
  let [Location, setLocation] = useState("");
  let location = useLocation();
  let [reqDoctorEmail, setReqDoctorEmail] = useState("");
  let [salary, setSalary] = useState("");
  useEffect(() => {
    setReqDoctorEmail(location.state);
  }, []);

  const submitForm = async () => {
    try {
      let response = await fetch("http://localhost:5000/sendRequest", {
        method: "post",
        body: JSON.stringify({ reqDoctorEmail, expireDate, Location, salary }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setStatus(data.status);
        });
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
        crossOrigin="anonymous"
      ></link>
      <script
        src="https://kit.fontawesome.com/630e6cad6a.js"
        crossOrigin="anonymous"
      ></script>
      <nav className="navbar navbar-expand-lg coverheader">
        <div className="container-fluid">
          <a className="navbar-brand" href="/searchDoctor">
            HDI
          </a>
        </div>
      </nav>
      <div class="sendRequestFormBlock">
        <form>
          <div class="mb-3">
            <label for="date" class="form-label">
              Date of Expire this offer
            </label>
            <input
              name="expireDate"
              value={expireDate}
              onChange={(e) => setExpireDate(e.target.value)}
              type="date"
              class="form-control"
              id="date"
              aria-describedby="emailHelp"
            />
            <div id="emailHelp" class="form-text">
              Threshold Date till Offer available
            </div>
          </div>
          <div class="mb-3">
            <label for="salary" class="form-label">
              Salary
            </label>
            <input
              name="salary"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              type="text"
              class="form-control"
              id="salary"
              aria-describedby="emailHelp"
              placeholder="10,000-50,000"
            />
            <div id="emailHelp" class="form-text">
              Please Specify the range of salary
            </div>
          </div>
          <div class="mb-3">
            <label for="workplace" class="form-label">
              Location of work place
            </label>
            <textarea
              name="location"
              value={Location}
              onChange={(e) => setLocation(e.target.value)}
              class="form-control"
              id="workplace"
              rows="3"
            ></textarea>
          </div>
          <button type="button" onClick={submitForm} class="btn btn-primary">
            Send Request
          </button>
        </form>
      </div>
    </>
  );
}
