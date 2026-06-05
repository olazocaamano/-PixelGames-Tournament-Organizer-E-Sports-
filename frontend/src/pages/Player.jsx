/*
    File: Player.jsx
    Description: Player dashboard page.
    This page is protected and only accessible for users with "player" role.
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../App.css";

import TournamentAutocomplete from "../components/TournamentAutocomplete";

function Player() {
    const navigate = useNavigate();

    // Controls which section is displayed in the admin panel
    const [activeSection, setActiveSection] = useState("home");

    // Get user role from local storage (session simulation)
    const role = localStorage.getItem("role");

    /*
        Route protection
        Redirects user to home if they are not a player
     */
    useEffect(() => {
        if (role !== "player") {
            navigate("/");
        }
    }, [role, navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        localStorage.removeItem("user");
        navigate("/");
    };

    return (

        <div className="window-admin">

            {/* Sidebar navigation */}
            <div className="bar">
                <div className="left">
                    <div className="circle">
                        <img src="/images/iconos/players.png" alt="logo" />
                    </div>
                    <h1>User</h1>
                </div>

                {/* Navigation menu */}
                <ul className="menu">

                    <li>
                        <button
                            className={activeSection === "home" ? "active" : ""}
                            onClick={() => setActiveSection("home")}
                        >
                            Home
                        </button>
                    </li>

                    <li>
                        <button
                            className={activeSection === "tournaments" ? "active" : ""}
                            onClick={() => setActiveSection("tournaments")}
                        >
                            Tournaments
                        </button>
                    </li>
                    <button onClick={handleLogout} className="logout">
                        Logout
                    </button>
                </ul>
            </div>

            <div className="content">

                {/* HOME SECTION */}
                {activeSection === "home" && (
                    <div className="admin-box">
                        <div className="top">
                            <div className="circle">
                                <img src="/images/iconos/home.png" className="icono" />
                            </div>
                            <h2>Home</h2>
                        </div>

                        <div className="admin-container">

                            {/* Welcome panel */}
                            <div className="box-tournaments">
                                <h2>Welcome</h2>
                                <div className="box-tournaments-content">
                                    <p>Welcome back, player.</p>
                                    <p>Select "Tournaments" to join competitions.</p>
                                </div>
                            </div>

                            {/* Quick info */}
                            <div className="box-activity">
                                <h2>Activity</h2>
                                <div className="box-activity-content">
                                    <ul>
                                        <li>
                                            <strong>No recent activity</strong>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                        </div>

                    </div>
                )}

                {/* TOURNAMENTS SECTION */}
                {activeSection === "tournaments" && (
                    <div className="admin-box">
                        <div className="top">
                            <div className="circle">
                                <img src="/images/iconos/tournament.png" className="icono" />
                            </div>
                            <h2>Tournaments</h2>
                        </div>

                        <div className="admin-container">
                            <TournamentAutocomplete />
                        </div>

                    </div>
                )}

            </div>

        </div>

    );
}

export default Player;