import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import "../App.css";

import TournamentAutocomplete from "../components/TournamentAutocomplete";
import { getMyTournaments } from "../services/tournamentService";
import socket, { connectSocket, disconnectSocket } from "../services/socket";

function Player() {
    const navigate = useNavigate();

    const [activeSection, setActiveSection] = useState("home");
    const [myTournaments, setMyTournaments] = useState([]);
    const [loadingMyTours, setLoadingMyTours] = useState(true);

    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    useEffect(() => {
        if (role !== "player") {
            navigate("/");
        }
    }, [role, navigate]);

    const fetchMyTournaments = useCallback(async () => {
        if (!userId) return;
        try {
            const res = await getMyTournaments(userId);
            setMyTournaments(res.data);
        } catch (err) {
            console.error("Error fetching my tournaments:", err);
        } finally {
            setLoadingMyTours(false);
        }
    }, [userId]);

    useEffect(() => {
        if (userId && role === "player") {
            fetchMyTournaments();
            connectSocket(userId);

            const onRegistered = (data) => {
                if (String(data.user_id) === String(userId)) {
                    fetchMyTournaments();
                }
            };
            const onRefresh = () => fetchMyTournaments();

            socket.on("tournament:registered", onRegistered);
            socket.on("tournament:created", onRefresh);
            socket.on("tournament:updated", onRefresh);
            socket.on("tournament:statusChanged", onRefresh);

            return () => {
                socket.off("tournament:registered", onRegistered);
                socket.off("tournament:created", onRefresh);
                socket.off("tournament:updated", onRefresh);
                socket.off("tournament:statusChanged", onRefresh);
                disconnectSocket();
            };
        }
    }, [userId, role, fetchMyTournaments]);

    const handleLogout = () => {
        disconnectSocket();
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        localStorage.removeItem("user");
        navigate("/");
    };

    const statusLabel = (statusId) => {
        const map = { 1: "Pending", 2: "Active", 3: "Finished" };
        return map[statusId] || "Unknown";
    };

    return (
        <div className="window-admin">

            <div className="bar">
                <div className="left">
                    <div className="circle">
                        <img src="/images/iconos/players.png" alt="logo" />
                    </div>
                    <h1>{user.nickname || "User"}</h1>
                </div>

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
                    <li>
                        <button
                            className={activeSection === "my-tournaments" ? "active" : ""}
                            onClick={() => setActiveSection("my-tournaments")}
                        >
                            My Tournaments
                        </button>
                    </li>
                    <button onClick={handleLogout} className="logout">
                        Logout
                    </button>
                </ul>
            </div>

            <div className="content">

                {activeSection === "home" && (
                    <div className="admin-box">
                        <div className="top">
                            <div className="circle">
                                <img src="/images/iconos/home.png" className="icono" alt="home" />
                            </div>
                            <h2>Home</h2>
                        </div>

                        <div className="admin-container">

                            <div className="box-tournaments">
                                <h2>Welcome</h2>
                                <div className="box-tournaments-content">
                                    <p>Welcome back, {user.nickname || "player"}.</p>
                                    <p>Select "Tournaments" to join competitions.</p>
                                </div>
                            </div>

                            <div className="box-activity">
                                <h2>My Tournaments</h2>
                                <div className="box-activity-content">
                                    {loadingMyTours ? (
                                        <p>Loading...</p>
                                    ) : myTournaments.length === 0 ? (
                                        <ul><li><strong>No tournaments registered</strong></li></ul>
                                    ) : (
                                        <ul>
                                            {myTournaments.map((t) => (
                                                <li key={t.id}>
                                                    <strong>{t.name}</strong>
                                                    <span className={`status ${statusLabel(t.status_id).toLowerCase()}`}>
                                                        {statusLabel(t.status_id).toUpperCase()}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                )}

                {activeSection === "tournaments" && (
                    <div className="admin-box">
                        <div className="top">
                            <div className="circle">
                                <img src="/images/iconos/tournament.png" className="icono" alt="tournament" />
                            </div>
                            <h2>Tournaments</h2>
                        </div>

                        <div className="admin-container">
                            <TournamentAutocomplete onRegisterSuccess={fetchMyTournaments} />
                        </div>
                    </div>
                )}

                {activeSection === "my-tournaments" && (
                    <div className="admin-box">
                        <div className="top">
                            <div className="circle">
                                <img src="/images/iconos/tournament.png" className="icono" alt="tournament" />
                            </div>
                            <h2>My Tournaments</h2>
                        </div>

                        <div className="admin-container">
                            <div className="box-tournaments" style={{ width: "95%" }}>
                                <h2>Registered Tournaments</h2>
                                <div className="box-tournaments-content">
                                    {loadingMyTours ? (
                                        <p>Loading your tournaments...</p>
                                    ) : myTournaments.length === 0 ? (
                                        <p>You haven't registered for any tournament yet.</p>
                                    ) : (
                                        <ul>
                                            {myTournaments.map((t) => (
                                                <li key={t.id}>
                                                    <strong>{t.name}</strong>
                                                    <span>{t.prize_pool ? `$${t.prize_pool}` : ""}</span>
                                                    <span className={`status ${statusLabel(t.status_id).toLowerCase()}`}>
                                                        {statusLabel(t.status_id).toUpperCase()}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

            </div>

        </div>
    );
}

export default Player;