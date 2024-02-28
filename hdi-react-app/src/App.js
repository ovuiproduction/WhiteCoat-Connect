import React from "react";

import HHome from './Hospital/Home'
import Signup from "./Hospital/Signup";
import Search from './Hospital/Search';
import Dsignup from './Doctor/Signup';
import Cover from "./components/Cover";
import HLogin from "./Hospital/Login";
import DLogin from "./Doctor/Login";
import DHome from "./Doctor/Home";
import DoctorRequestForm from "./Hospital/sendRequestForm";
import RequestControl from "./Doctor/requestControl";
import HistoryHospital from "./Hospital/HistoryHospital";
import ChatDoctor from "./Doctor/ChatDoctor";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    Link
} from "react-router-dom";

export default function App(){

    return(
        <>    
           <Router>
                <Routes>

                <Route
                        exact
                        path="/"
                        element={<Cover />}
                    />

                <Route
                        exact
                        path="/homeHospital"
                        element={<HHome />}
                    />
                <Route
                        exact
                        path="/loginHospital"
                        element={<HLogin />}
                    />
                
                     <Route
                        exact
                        path="/signup"
                        element={<Signup />}
                    />
                    <Route
                        exact
                        path="/signupDoctor"
                        element={<Dsignup />}
                    />
                    <Route
                        exact
                        path="/loginDoctor"
                        element={<DLogin />}
                    />
                    <Route
                        exact
                        path="/searchDoctor"
                        element={<Search />}
                    />  
                    <Route
                        exact
                        path="/homeDoctor"
                        element={<DHome />}
                    />  
                    <Route
                        exact
                        path="/sendRequestForm"
                        element={<DoctorRequestForm />}
                    /> 
                    <Route
                        exact
                        path="/requestControl"
                        element={<RequestControl />}
                    /> 
                     <Route
                        exact
                        path="/historyHospital"
                        element={<HistoryHospital />}
                    /> 
                    <Route
                        exact
                        path="/chatDoctor"
                        element={<ChatDoctor />}
                    /> 
                    </Routes>
            </Router>
        </>
    );
};