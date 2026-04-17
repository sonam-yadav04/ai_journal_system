import React from "react";
import Logins from "./pages/Logins";
import Signup from "./pages/Signup";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dashboard from "./Dashboard";


function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Logins />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
             
                <Dashboard />
     
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;