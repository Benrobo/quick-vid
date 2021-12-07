import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import IsLoggedIn from "./utils/checkAuth";
import Home from "./pages/home/home";
import Login from "./pages/login/login";
import Signup from "./pages/signup/signup";
import Upload from "./pages/upload/Upload";
import WatchVideo from "./pages/videoPreview/videoPreview";
import Dashboard from "./pages/dashboard/dashboard";

function App() {
  return (
    <Router>
      <div className="main-container">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/login" element={
            IsLoggedIn() ? <Navigate to="/" /> : <Login />
          } />
          <Route path="/signup" element={
            IsLoggedIn() ? <Navigate to="/" /> : <Signup />
          } />
          <Route path="/upload" element={
            IsLoggedIn() ? <Upload /> : <Navigate to="/" />
          } />
          <Route path="/videoPreview/:id" element={<WatchVideo />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
