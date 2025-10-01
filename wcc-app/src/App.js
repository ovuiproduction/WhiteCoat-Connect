import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Cover from "./pages/Cover";
import HHome from "./Hospital/components/HospitalHome";
import DHome from "./Doctor/components/Home";

import DocChat from "./pages/DocChat";

import { ToastContainer } from 'react-toastify';

export default function App() {
  return (
    <>
      <Router>
        <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} closeOnClick pauseOnHover theme="colored" />
        <Routes>
          <Route exact path="/" element={<Cover />} />
          <Route exact path="/homeHospital" element={<HHome />} />
          <Route exact path="/homeDoctor" element={<DHome />} />
      
          <Route exact path="/chatDoctor" element={<DocChat />} />
        </Routes>
      </Router>
    </>
  );
}
