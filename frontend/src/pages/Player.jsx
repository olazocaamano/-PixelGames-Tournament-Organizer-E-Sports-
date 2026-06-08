import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";

import "../App.css";

import TournamentAutocomplete from "../components/TournamentAutocomplete";
import BracketViewer from "../components/BracketViewer";
import { getMyTournaments } from "../services/tournamentService";
import { getNotifications, markAllAsRead } from "../services/notificationService";
import { getPlayerMatches } from "../services/matchService";
import socket, { connectSocket, disconnectSocket } from "../services/socket";

function Player() {
    const navigate = useNavigate();

    const [activeSection, setActiveSection] = useState("home");
    const [myTournaments, setMyTournaments] = useState([]);
    const [loadingMyTours, setLoadingMyTours] = useState(true);
    const [notifications, setNotifications] = useState({ notifications: [], unread: 0 });
    const [showNotifications, setShowNotifications] = useState(false);
    const [myMatches, setMyMatches] = useState([]);
    const [selectedTournamentForBracket, setSelectedTournamentForBracket] = useState(null);

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

    const fetchNotifications = useCallback(async () => {
        if (!userId) return;
        try {
            const res = await getNotifications(userId);
            setNotifications(res.data);
        } catch (err) {
            console.error("Error fetching notifications:", err);
        }
    }, [userId]);

    const fetchMyMatches = useCallback(async () => {
        if (!userId) return;
        try {
            const res = await getPlayerMatches(userId);
            setMyMatches(res.data);
        } catch (err) {
            console.error("Error fetching matches:", err);
        }
    }, [userId]);

    useEffect(() => {
        if (userId && role === "player") {
            fetchMyTournaments();
            fetchNotifications();
            fetchMyMatches();
            connectSocket(userId);

            const onRegistered = (data) => {
                if (String(data.user_id) === String(userId)) {
                    fetchMyTournaments();
                }
            };
            const onRefresh = () => {
                fetchMyTournaments();
                fetchMyMatches();
            };
            const onNotif = () => {
                fetchNotifications();
            };

            socket.on("tournament:registered", onRegistered);
            socket.on("tournament:created", onRefresh);
            socket.on("tournament:updated", onRefresh);
            socket.on("tournament:statusChanged", onRefresh);
            socket.on("notification", onNotif);
            socket.on("match:created", onRefresh);
            socket.on("match:result", onRefresh);

            return () => {
                socket.off("tournament:registered", onRegistered);
                socket.off("tournament:created", onRefresh);
                socket.off("tournament:updated", onRefresh);
                socket.off("tournament:statusChanged", onRefresh);
                socket.off("notification", onNotif);
                socket.off("match:created", onRefresh);
                socket.off("match:result", onRefresh);
                disconnectSocket();
            };
        }
    }, [userId, role, fetchMyTournaments, fetchNotifications, fetchMyMatches]);

    const handleLogout = () => {
        disconnectSocket();
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        localStorage.removeItem("user");
        navigate("/");
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllAsRead(userId);
            setNotifications(prev => ({ ...prev, unread: 0, notifications: prev.notifications.map(n => ({ ...n, is_read: 1 })) }));
        } catch (err) {
            console.error(err);
        }
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
                        <button className={activeSection === "home" ? "active" : ""} onClick={() => setActiveSection("home")}>
                            Home
                        </button>
                    </li>
                    <li>
                        <button className={activeSection === "tournaments" ? "active" : ""} onClick={() => setActiveSection("tournaments")}>
                            Tournaments
                        </button>
                    </li>
                    <li>
                        <button className={activeSection === "my-tournaments" ? "active" : ""} onClick={() => setActiveSection("my-tournaments")}>
                            My Tournaments
                        </button>
                    </li>
                    <li>
                        <button className={activeSection === "my-matches" ? "active" : ""} onClick={() => { setActiveSection("my-matches"); fetchMyMatches(); }}>
                            My Matches
                        </button>
                    </li>
                    <li>
                        <Link to="/leaderboards">Leaderboards</Link>
                    </li>
                    <li style={{ position: "relative" }}>
                        <button onClick={() => setShowNotifications(!showNotifications)} className={showNotifications ? "active" : ""}>
                            Notifications {notifications.unread > 0 && <span className="notif-badge">{notifications.unread}</span>}
                        </button>
                        {showNotifications && (
                            <div className="notifications-dropdown">
                                <div className="notif-header">
                                    <strong className="notif-title">Notifications</strong>
                                    {notifications.unread > 0 && <button className="notif-mark-read" onClick={handleMarkAllRead}>Mark all read</button>}
                                </div>
                                {notifications.notifications.length === 0 ? (
                                    <p className="notif-empty">No notifications</p>
                                ) : (
                                    notifications.notifications.map(n => (
                                        <div key={n.id} className={`notification-item${n.is_read ? "" : " unread"}`}>
                                            <p className="notification-message">{n.message}</p>
                                            <small className="notification-time">{n.created_at?.slice(0, 16).replace("T", " ")}</small>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </li>
                    <li>
                        <Link to={`/profile/${userId}`}>My Profile</Link>
                    </li>
                    <button onClick={handleLogout} className="logout">Logout</button>
                </ul>
            </div>

            <div className="content">
                {activeSection === "home" && (
                    <div className="admin-box">
                        <div className="top">
                            <div className="circle"><img src="/images/iconos/home.png" className="icono" alt="home" /></div>
                            <h2>Home</h2>
                        </div>
                        <div className="admin-container">
                            <div className="box-tournaments">
                                <h2>Welcome</h2>
                                <div className="box-tournaments-content">
                                    <p>Welcome back, {user.nickname || "player"}.</p>
                                    <p>Select "Tournaments" to join competitions.</p>
                                    <p><Link to={`/profile/${userId}`} style={{ color: "#00e5ff" }}>View your profile →</Link></p>
                                </div>
                            </div>
                            <div className="box-activity">
                                <h2>My Tournaments</h2>
                                <div className="box-activity-content">
                                    {loadingMyTours ? (<p>Loading...</p>)
                                        : myTournaments.length === 0 ? (<ul><li><strong>No tournaments registered</strong></li></ul>)
                                            : (<ul>{myTournaments.map((t) => (
                                                <li key={t.id}>
                                                    <strong>{t.name}</strong>
                                                    <span className={`status ${statusLabel(t.status_id).toLowerCase()}`}>{statusLabel(t.status_id).toUpperCase()}</span>
                                                </li>
                                            ))}</ul>)}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === "tournaments" && (
                    <div className="admin-box">
                        <div className="top">
                            <div className="circle"><img src="/images/iconos/tournament.png" className="icono" alt="tournament" /></div>
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
                            <div className="circle"><img src="/images/iconos/tournament.png" className="icono" alt="tournament" /></div>
                            <h2>My Tournaments</h2>
                        </div>
                        <div className="admin-container">
                            <div className="box-tournaments" style={{ width: "95%" }}>
                                <h2>Registered Tournaments</h2>
                                <div className="box-tournaments-content">
                                    {loadingMyTours ? (<p>Loading your tournaments...</p>)
                                        : myTournaments.length === 0 ? (<p>You haven't registered for any tournament yet.</p>)
                                            : (<ul>{myTournaments.map((t) => (
                                                <li key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <div>
                                                        <strong>{t.name}</strong>
                                                        <span>{t.prize_pool ? `$${t.prize_pool}` : ""}</span>
                                                        <span className={`status ${statusLabel(t.status_id).toLowerCase()}`}>{statusLabel(t.status_id).toUpperCase()}</span>
                                                    </div>
                                                    <div style={{ display: "flex", gap: "8px" }}>
                                                        <button onClick={() => {
                                                            navigate(`/tournament/${t.id}/results`);
                                                        }} style={{ padding: "4px 10px", fontSize: "12px", background: "#222a40", color: "#00e5ff", border: "1px solid #0891b2" }}>
                                                            Results
                                                        </button>
                                                        <button onClick={() => setSelectedTournamentForBracket(t.id)}
                                                            style={{ padding: "4px 10px", fontSize: "12px", background: "#7c3aed", color: "white", border: "none" }}>
                                                            Brackets
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}</ul>)}
                                </div>
                            </div>
                            {selectedTournamentForBracket && (
                                <div className="box-tournaments" style={{ width: "95%", marginTop: "20px" }}>
                                    <h2>Bracket View
                                        <button onClick={() => setSelectedTournamentForBracket(null)}
                                            style={{ marginLeft: "12px", padding: "2px 10px", fontSize: "12px", background: "#dc2626", border: "none", color: "white", borderRadius: "4px" }}>
                                            Close
                                        </button>
                                    </h2>
                                    <BracketViewer tournamentId={selectedTournamentForBracket} adminView={false} />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeSection === "my-matches" && (
                    <div className="admin-box">
                        <div className="top">
                            <div className="circle"><img src="/images/iconos/tournament.png" className="icono" alt="matches" /></div>
                            <h2>My Matches</h2>
                        </div>
                        <div className="admin-container">
                            <div className="box-tournaments" style={{ width: "95%" }}>
                                <h2>Match History</h2>
                                <div className="box-tournaments-content">
                                    {myMatches.length === 0 ? (
                                        <p>No matches yet.</p>
                                    ) : (
                                        <ul>{myMatches.map(m => {
                                            const isWinner = String(m.winner_id) === String(userId);
                                            const isLoser = m.winner_id && !isWinner;
                                            return (
                                                <li key={m.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                    <div>
                                                        <strong>{m.player_1_nickname} vs {m.player_2_nickname}</strong>
                                                        <br />
                                                        <small style={{ color: "#94a3b8" }}>{m.tournament_name} - {m.round}</small>
                                                    </div>
                                                    <div>
                                                        {isWinner && <span style={{ color: "#22c55e", fontWeight: "bold" }}>WIN</span>}
                                                        {isLoser && <span style={{ color: "#ef4444", fontWeight: "bold" }}>LOSS</span>}
                                                        {!m.winner_id && <span style={{ color: "#f59e0b" }}>Pending</span>}
                                                    </div>
                                                </li>
                                            );
                                        })}</ul>
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
