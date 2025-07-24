import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import CreateClient from "./pages/CreateClient";
import Dashboard from "./pages/Dashboard";
import ClientDetails from "./pages/ClientDetails";
import Login from "./pages/Login";
import Authorize from "./pages/Authorize";



const App = () => {

  return (
    <>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/createclient" element={<CreateClient />} />
              <Route path="/clientdetails/:id" element={<ClientDetails />} />
              <Route path="/authorize" element={<Authorize />} />
            </Routes>
    </>
  );
};

export default App;