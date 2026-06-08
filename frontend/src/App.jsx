/*
    File: App.jsx
    Description: Main application routing configuration using react-router-dom.
    Defines all the routes for the system including admin and player modules.
 */


import React from "react";
import { Routes, Route } from "react-router-dom";

// Aplication pages
import Home from "./pages/Home";
import Admin from "./pages/Admin";
import Player from "./pages/Player";
import AdminLogin from "./pages/AdminLogin";
import UserRegister from "./pages/UserRegister";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Leaderboards from "./pages/Leaderboards";
import TournamentResults from "./pages/TournamentResults";

// Components
import BackgroundAnimation from "./components/BackgroundAnimation";

// Global styles
import "./App.css";

/*
    Main App component
    Handles navigation between all application pages
 */
function App() {
  return (
    <>
      <BackgroundAnimation />
          <div style={{ position: "relative", zIndex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/user/register" element={<UserRegister />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/player" element={<Player />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/leaderboards" element={<Leaderboards />} />
          <Route path="/tournament/:id/results" element={<TournamentResults />} />
        </Routes>
      </div>
    </>
  );
}

export default App;