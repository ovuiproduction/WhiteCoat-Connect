import React from "react";
import {Link} from 'react-router-dom'
import Header from "../partials/Header";
import "./Assests/css/Home.css";

export default function HHome() {
  return (
    <>
      <Header />
      <link rel="preconnect" href="https://fonts.googleapis.com"></link>

      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin
      ></link>

      <link
        href="https://fonts.googleapis.com/css2?family=Poppins&display=swap"
        rel="stylesheet"
      ></link>

      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
        crossOrigin="anonymous"
      ></link>

      <link
        rel="stylesheet"
        href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
        integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
        crossOrigin="anonymous"
      ></link>

      <div className="hospitalHomeMainContainer">
        <div className="homeHospitalSlide">
          <div
            id="carouselExampleAutoplaying"
            className="carousel slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img
                  src="https://media.istockphoto.com/id/1133609760/vector/hospital-reception-waiting-hall-with-counter-seats-doors-and-elevator-empty-no-people.jpg?s=170667a&w=0&k=20&c=FZIxyQoIn16xE4R0J4gyki1oQlf7SldPK_rP1tosOIs="
                  className="d-block  img"
                  alt="..."
                />
                <div className="carousel-caption d-none d-md-block">
                  <h5>first slide label</h5>
                  <p>
                    Some representative placeholder content for the third slide.
                  </p>
                </div>
              </div>
              <div className="carousel-item">
                <img
                  src="https://media.istockphoto.com/id/1133609760/vector/hospital-reception-waiting-hall-with-counter-seats-doors-and-elevator-empty-no-people.jpg?s=170667a&w=0&k=20&c=FZIxyQoIn16xE4R0J4gyki1oQlf7SldPK_rP1tosOIs="
                  className="d-block img"
                  alt="..."
                />
                <div className="carousel-caption d-none d-md-block">
                  <h5>second slide label</h5>
                  <p>
                    Some representative placeholder content for the third slide.
                  </p>
                </div>
              </div>
              <div className="carousel-item">
                <img
                  src="https://media.istockphoto.com/id/1133609760/vector/hospital-reception-waiting-hall-with-counter-seats-doors-and-elevator-empty-no-people.jpg?s=170667a&w=0&k=20&c=FZIxyQoIn16xE4R0J4gyki1oQlf7SldPK_rP1tosOIs="
                  className="d-block  img"
                  alt="..."
                />
                <div className="carousel-caption d-none d-md-block">
                  <h5>Third slide label</h5>
                  <p>
                    Some representative placeholder content for the third slide.
                  </p>
                </div>
              </div>
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleAutoplaying"
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleAutoplaying"
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>

        <div className="secondaryBlock">


          <div className="historyBlock">
            <a href="/historyHospital">
            <div className="historyBlockCover">
              <h2>History</h2>
              <div className="historyInfo">
                <p>Total Doctor : </p>
                <p>Avg Rating : </p>
                <p>Total Expenditures : </p>
              </div>
            </div>
            </a>
          </div>


          <div className="middleBlock"></div>
          <div className="queryBlock">
            <div className="emergancyBlock">
              <div className="emergancyBlockCover">
                <h2>Find Doctor</h2>
                <Link className="searchDoctorLink" to="/searchDoctor">Search</Link>
              </div>
            </div>
            <div className="bookingBlock"></div>
          </div>
        </div>
      </div>
    </>
  );
}
