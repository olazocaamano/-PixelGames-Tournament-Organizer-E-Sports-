import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";

import "../App.css";

import { getTournaments, createTournament, updateTournament } from "../services/tournamentService";
import { generateBrackets } from "../services/matchService";
import API from "../services/api";

import TournamentList from "../components/TournamentList";
import ActivityList from "../components/ActivityList";
import PlayerList from "../components/PlayersList";
import Modal from "../components/Modal";
import CreateTournament from "../components/CreateTournament";
import BracketViewer from "../components/BracketViewer";

import formatDate from "../utils/formatDate";

import { Bar, Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Filler
} from "chart.js";

import socket, { connectSocket, disconnectSocket } from "../services/socket";

ChartJS.register(
    BarElement,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
    Filler
);

function Admin() {
    const navigate = useNavigate();
    const role = localStorage.getItem("role");
    const [activeSection, setActiveSection] = useState("home");
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activities, setActivities] = useState([]);
    const [loadinga, setLoadinga] = useState(true);
    const [errora, setErrora] = useState(null);
    const [players, setPlayers] = useState([]);
    const [loadingPlayers, setLoadingPlayers] = useState(true);
    const [errorPlayers, setErrorPlayers] = useState(null);
    const [games, setGames] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const [newAdmin, setNewAdmin] = useState({ username: "", email: "", password: "" });
    const [adminMessage, setAdminMessage] = useState("");
    const [admins, setAdmins] = useState([]);
    const [loadingAdmins, setLoadingAdmins] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [editTournament, setEditTournament] = useState(null);

    const [newTournament, setNewTournament] = useState({
        name: "", game_id: "", prize_pool: "", start_date: "", status: ""
    });
    const [createMessage, setCreateMessage] = useState("");

    const [advStats, setAdvStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(false);

    const [selectedTournamentId, setSelectedTournamentId] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [bracketTournamentId, setBracketTournamentId] = useState(null);
    const [bracketMsg, setBracketMsg] = useState("");

    useEffect(() => {
        if (role !== "admin") { navigate("/"); }
    }, [role, navigate]);

    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await API.get("/users");
                setPlayers(response.data);
            } catch { setErrorPlayers("Failed to load players"); }
            finally { setLoadingPlayers(false); }
        };
        fetchPlayers();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        localStorage.removeItem("user");
        navigate("/");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const numericFields = ["game_id", "prize_pool", "status"];
        setNewTournament({
            ...newTournament,
            [name]: numericFields.includes(name) ? Number(value) : value
        });
    };

    const handleCreateTournament = async (e) => {
        e.preventDefault();
        try {
            await createTournament(newTournament);
            setCreateMessage("Tournament created successfully");
            setShowModal(false);
            fetchTournaments();
            const activitiesResponse = await API.get("/activity");
            setActivities(activitiesResponse.data);
        } catch {
            setCreateMessage("Error creating tournament");
        }
    };

    const handleUpdateTournament = async (e) => {
        e.preventDefault();
        try {
            await updateTournament(editTournament.id, editTournament);
            setEditTournament(null);
            fetchTournaments();
        } catch (err) { console.error(err); }
    };

    const fetchTournaments = useCallback(async () => {
        try {
            const response = await getTournaments({ limit: 1000 });
            setTournaments(response.data);
        } catch { setError("Failed to load tournaments :("); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchTournaments(); }, [fetchTournaments]);

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await API.get("/activity");
                setActivities(response.data);
            } catch { setErrora("Failed to load activities :("); }
            finally { setLoadinga(false); }
        };
        fetchActivities();
    }, []);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await API.get("/games", { params: { active: true } });
                setGames(response.data);
            } catch (err) { console.error("Failed to load games", err); }
        };
        fetchGames();
    }, []);

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        setAdminMessage("");
        try {
            await API.post("/users/admin", newAdmin);
            setAdminMessage("Admin created successfully");
            setNewAdmin({ username: "", email: "", password: "" });
        } catch (err) {
            setAdminMessage(err.response?.data?.error || "Error creating admin");
        }
    };

    const handleAdminInputChange = (e) => {
        const { name, value } = e.target;
        setNewAdmin((prev) => ({ ...prev, [name]: value }));
    };

    const fetchAdmins = useCallback(async () => {
        setLoadingAdmins(true);
        try {
            const res = await API.get("/users/admins");
            setAdmins(res.data);
        } catch { setAdmins([]); }
        finally { setLoadingAdmins(false); }
    }, []);

    useEffect(() => {
        if (activeSection === "admins") { fetchAdmins(); }
    }, [activeSection, fetchAdmins]);

    const handleDemoteAdmin = async (id, username) => {
        if (!window.confirm(`Demote "${username}" to regular user?`)) return;
        try {
            await API.patch(`/users/${id}/demote`);
            setAdminMessage(`"${username}" demoted to user`);
            fetchAdmins();
        } catch (err) {
            setAdminMessage(err.response?.data?.error || "Error demoting admin");
        }
    };

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) { connectSocket(userId); }
        const onRefresh = () => fetchTournaments();
        socket.on("tournament:created", onRefresh);
        socket.on("tournament:updated", onRefresh);
        socket.on("tournament:statusChanged", onRefresh);
        return () => {
            socket.off("tournament:created", onRefresh);
            socket.off("tournament:updated", onRefresh);
            socket.off("tournament:statusChanged", onRefresh);
            disconnectSocket();
        };
    }, [fetchTournaments]);

    const totalTournaments = tournaments.length;
    const activeTournamentsCount = tournaments.filter(t => t.is_active === 1).length;
    const finishedTournamentsCount = tournaments.filter(t => t.status === 2).length;
    const totalPlayers = players.length;
    const avgPrize = tournaments.length > 0
        ? Math.round(tournaments.reduce((sum, t) => sum + Number(t.prize_pool || 0), 0) / tournaments.length)
        : 0;

    const chartData = {
        labels: ["Total Tournaments", "Active", "Finished", "Players", "Avg Prize"],
        datasets: [{
            label: "Platform Statistics",
            data: [totalTournaments, activeTournamentsCount, finishedTournamentsCount, totalPlayers, avgPrize],
            borderWidth: 2,
            borderRadius: 8,
            backgroundColor: "rgba(0, 229, 255, 0.7)"
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, labels: { color: "#12fb50", font: { size: 14 } } },
            tooltip: {
                callbacks: {
                    label: function (context) { return `${context.label}: ${context.raw}`; }
                }
            }
        },
        scales: {
            x: { ticks: { color: "#12fb50" }, grid: { display: false } },
            y: { ticks: { color: "#12fb41", precision: 0 }, grid: { color: "rgba(255,255,255,0.05)" } }
        },
        animation: { duration: 1000, easing: "easeOutQuart" }
    };

    const tournamentsByGame = {};
    tournaments.forEach(t => {
        const game = t.game_name || "Unknown";
        tournamentsByGame[game] = (tournamentsByGame[game] || 0) + 1;
    });

    const gameChartData = {
        labels: Object.keys(tournamentsByGame),
        datasets: [{
            label: "Tournaments per Game",
            data: Object.values(tournamentsByGame),
            borderWidth: 2,
            backgroundColor: "rgba(168, 85, 247, 0.7)"
        }]
    };

    const filteredTournaments = tournaments.filter((t) =>
        t.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditFieldChange = (e) => {
        const { name, value } = e.target;
        setEditTournament((prev) => ({
            ...prev,
            [name]: ["game_id", "prize_pool", "status_id", "status", "is_active"].includes(name)
                ? Number(value) : value
        }));
    };

    const handleGenerateBrackets = async (tournamentId) => {
        if (!window.confirm("Generate brackets for this tournament? This will create matches.")) return;
        try {
            setBracketMsg("Generating...");
            const res = await generateBrackets(tournamentId);
            setBracketMsg(res.data.message || "Brackets generated!");
            if (res.data.matchCount > 0) {
                setBracketTournamentId(tournamentId);
            }
        } catch (err) {
            setBracketMsg(err.response?.data?.error || "Error generating brackets");
        }
        setTimeout(() => setBracketMsg(""), 3000);
    };

    const fetchRegistrations = async (tournamentId) => {
        try {
            const res = await API.get(`/tournaments/${tournamentId}/registrations`);
            setRegistrations(res.data);
            setSelectedTournamentId(tournamentId);
        } catch (err) {
            console.error(err);
        }
    };

    const handleRemoveRegistration = async (tournamentId, userId, nickname) => {
        if (!window.confirm(`Remove ${nickname} from this tournament?`)) return;
        try {
            await API.delete(`/tournaments/${tournamentId}/registrations/${userId}`);
            fetchRegistrations(tournamentId);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (activeSection === "statistics") {
            const fetchStats = async () => {
                setLoadingStats(true);
                try {
                    const res = await API.get("/stats");
                    setAdvStats(res.data);
                } catch (err) { console.error(err); }
                finally { setLoadingStats(false); }
            };
            fetchStats();
        }
    }, [activeSection]);

    const lineChartData = advStats ? {
        labels: advStats.activity_by_day.map(a => a.date?.slice(5, 10) || ""),
        datasets: [{
            label: "Activity (30 days)",
            data: advStats.activity_by_day.map(a => a.count),
            borderColor: "#00e5ff",
            backgroundColor: "rgba(0, 229, 255, 0.1)",
            fill: true,
            tension: 0.4
        }]
    } : null;

    const gamePopData = advStats ? {
        labels: advStats.games_popularity.map(g => g.game_name),
        datasets: [{
            label: "Tournaments per Game",
            data: advStats.games_popularity.map(g => g.tournament_count),
            backgroundColor: "rgba(168, 85, 247, 0.7)",
            borderRadius: 6
        }]
    } : null;

    return (
        <div className="window-admin">
            <div className="bar">
                <div className="left">
                    <div className="circle">
                        <img src="/images/iconos/administrador.png" alt="logo" />
                    </div>
                    <h1>Administrator</h1>
                </div>

                <ul className="menu">
                    <li><button className={activeSection === "home" ? "active" : ""} onClick={() => setActiveSection("home")}>Home</button></li>
                    <li><button className={activeSection === "tournaments" ? "active" : ""} onClick={() => setActiveSection("tournaments")}>Tournaments</button></li>
                    <li><button className={activeSection === "registrations" ? "active" : ""} onClick={() => setActiveSection("registrations")}>Registrations</button></li>
                    <li><button className={activeSection === "brackets" ? "active" : ""} onClick={() => setActiveSection("brackets")}>Brackets</button></li>
                    <li><button className={activeSection === "players" ? "active" : ""} onClick={() => setActiveSection("players")}>Players</button></li>
                    <li><button className={activeSection === "statistics" ? "active" : ""} onClick={() => setActiveSection("statistics")}>Statistics</button></li>
                    <li><button className={activeSection === "admins" ? "active" : ""} onClick={() => setActiveSection("admins")}>Admins</button></li>
                    <li><Link to="/leaderboards">Leaderboards</Link></li>
                    <button onClick={handleLogout} className="logout">Logout</button>
                </ul>
            </div>

            <div className="content">
                {activeSection === "home" && (
                    <div className="admin-box">
                        <div className="top">
                            <div className="circle"><img src="/images/iconos/general_summary.png" className="icono" /></div>
                            <h2>General Summary</h2>
                        </div>
                        <div className="admin-container">
                            <div className="box-tournaments">
                                <h2>Active Tournaments</h2>
                                <TournamentList tournaments={tournaments} loading={loading} error={error} />
                            </div>
                            <div className="box-activity">
                                <h2>Recent Activity</h2>
                                <ActivityList activities={activities} loading={loadinga} error={errora} />
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === "tournaments" && (
                    <div className="admin-box">
                        <div className="top">
                            <div className="circle"><img src="./images/iconos/tournament.png" alt="tournament" /></div>
                            <h2>Tournament Control</h2>
                        </div>
                        <div className="admin-container" style={{ flexDirection: "column" }}>
                            <div style={{ display: "flex", gap: "15px", width: "100%", padding: "0 10px" }}>
                                <input type="text" placeholder="Search tournaments by name..." value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)} style={{ flex: 1, fontSize: "18px", padding: "12px" }} />
                                <button onClick={() => setShowModal(true)} style={{ width: "200px" }}>Create Tournament</button>
                            </div>
                            <div className="box-tournaments" style={{ width: "100%", height: "400px" }}>
                                <h2>All Tournaments ({filteredTournaments.length})</h2>
                                <div className="box-tournaments-content">
                                    <ul>
                                        {filteredTournaments.map((t) => (
                                            <li key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                <div>
                                                    <strong>{t.name}</strong>
                                                    <span className={`status ${t.status_name}`}>{t.status_name?.toUpperCase()}</span>
                                                </div>
                                                <div style={{ display: "flex", gap: "8px" }}>
                                                    <button onClick={() => {
                                                        navigate(`/tournament/${t.id}/results`);
                                                    }} style={{ padding: "4px 10px", fontSize: "12px", background: "#222a40", color: "#00e5ff", border: "1px solid #0891b2" }}>
                                                        Results
                                                    </button>
                                                    <button onClick={() => setEditTournament({
                                                        ...t,
                                                        status_id: Number(t.status_id || t.status),
                                                        is_active: Number(t.is_active),
                                                        start_date: formatDate(t.start_date)
                                                    })} style={{ padding: "4px 10px", fontSize: "12px" }}>
                                                        Edit
                                                    </button>
                                                    <button onClick={() => handleGenerateBrackets(t.id)} style={{ padding: "4px 10px", fontSize: "12px", background: "#7c3aed", color: "white", border: "none" }}>
                                                        Brackets
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            {bracketMsg && <p style={{ color: "#00e5ff", textAlign: "center" }}>{bracketMsg}</p>}
                        </div>

                        {showModal && (
                            <Modal onClose={() => setShowModal(false)}>
                                <CreateTournament formData={newTournament} onChange={handleChange} onSubmit={handleCreateTournament} />
                                <p>{createMessage}</p>
                            </Modal>
                        )}

                        {editTournament && (
                            <Modal onClose={() => setEditTournament(null)}>
                                <h2>Edit Tournament</h2>
                                <form onSubmit={handleUpdateTournament}>
                                    <input type="text" name="name" placeholder="Tournament Name" value={editTournament.name || ""} onChange={handleEditFieldChange} required />
                                    <select name="game_id" value={editTournament.game_id || ""} onChange={handleEditFieldChange} required>
                                        <option value="">Select Game</option>
                                        {games.map((g) => (<option key={g.id} value={g.id}>{g.game_name}</option>))}
                                    </select>
                                    <input type="number" name="prize_pool" placeholder="Prize Pool" value={editTournament.prize_pool || ""} onChange={handleEditFieldChange} />
                                    <input type="datetime-local" name="start_date" value={editTournament.start_date || ""} onChange={handleEditFieldChange} required />
                                    <label style={{ color: "#ccc" }}>Status:</label>
                                    <select name="status_id" value={editTournament.status_id || 1} onChange={handleEditFieldChange}>
                                        <option value={1}>Pending</option>
                                        <option value={2}>Active</option>
                                        <option value={3}>Finished</option>
                                    </select>
                                    <label style={{ color: "#ccc" }}>Active:</label>
                                    <select name="is_active" value={editTournament.is_active || 0} onChange={handleEditFieldChange}>
                                        <option value={1}>Yes</option>
                                        <option value={0}>No</option>
                                    </select>
                                    <button type="submit">Save Changes</button>
                                </form>
                            </Modal>
                        )}
                    </div>
                )}

                {activeSection === "registrations" && (
                    <div className="admin-box">
                        <div className="top">
                            <div className="circle"><img src="/images/iconos/players.png" className="icono" /></div>
                            <h2>Registration Management</h2>
                        </div>
                        <div className="admin-container" style={{ flexDirection: "column" }}>
                            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}>
                                <select value={selectedTournamentId || ""} onChange={(e) => fetchRegistrations(e.target.value)}
                                    style={{ flex: 1, minWidth: "250px", padding: "12px", fontSize: "16px" }}>
                                    <option value="">Select a tournament...</option>
                                    {tournaments.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                            </div>

                            {selectedTournamentId && (
                                <div className="box-tournaments" style={{ width: "100%" }}>
                                    <h2>Registered Players ({registrations.length})</h2>
                                    <div className="box-tournaments-content">
                                        {registrations.length === 0 ? (
                                            <p style={{ color: "#94a3b8" }}>No registrations yet.</p>
                                        ) : (
                                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                                <thead>
                                                    <tr style={{ borderBottom: "1px solid #334155" }}>
                                                        <th style={{ padding: "10px", textAlign: "left", color: "#00e5ff" }}>Nickname</th>
                                                        <th style={{ padding: "10px", textAlign: "left", color: "#00e5ff" }}>Username</th>
                                                        <th style={{ padding: "10px", textAlign: "left", color: "#00e5ff" }}>Email</th>
                                                        <th style={{ padding: "10px", textAlign: "center", color: "#00e5ff" }}>Registered</th>
                                                        <th style={{ padding: "10px", textAlign: "center", color: "#00e5ff" }}>Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {registrations.map(reg => (
                                                        <tr key={reg.id} style={{ borderBottom: "1px solid #1e293b" }}>
                                                            <td style={{ padding: "10px" }}>
                                                                <Link to={`/profile/${reg.user_id}`} style={{ color: "#f1f5f9", textDecoration: "none", fontWeight: "bold" }}>
                                                                    {reg.nickname}
                                                                </Link>
                                                            </td>
                                                            <td style={{ padding: "10px", color: "#94a3b8" }}>@{reg.username}</td>
                                                            <td style={{ padding: "10px", color: "#94a3b8" }}>{reg.email}</td>
                                                            <td style={{ padding: "10px", textAlign: "center", color: "#94a3b8", fontSize: "13px" }}>
                                                                {reg.registration_date?.slice(0, 10)}
                                                            </td>
                                                            <td style={{ padding: "10px", textAlign: "center" }}>
                                                                <button onClick={() => handleRemoveRegistration(selectedTournamentId, reg.user_id, reg.nickname)}
                                                                    style={{ background: "#dc2626", padding: "4px 12px", fontSize: "12px", border: "none", color: "white", borderRadius: "6px", cursor: "pointer" }}>
                                                                    Remove
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeSection === "brackets" && (
                    <div className="admin-box">
                        <div className="top">
                            <div className="circle"><img src="/images/iconos/tournament.png" className="icono" /></div>
                            <h2>Bracket Viewer</h2>
                        </div>
                        <div className="admin-container" style={{ flexDirection: "column" }}>
                            <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
                                <select value={bracketTournamentId || ""} onChange={(e) => setBracketTournamentId(e.target.value ? Number(e.target.value) : null)}
                                    style={{ flex: 1, padding: "12px", fontSize: "16px" }}>
                                    <option value="">Select a tournament...</option>
                                    {tournaments.map(t => (
                                        <option key={t.id} value={t.id}>{t.name}</option>
                                    ))}
                                </select>
                                {bracketTournamentId && (
                                    <button onClick={() => handleGenerateBrackets(bracketTournamentId)} style={{ background: "#7c3aed" }}>
                                        Generate Brackets
                                    </button>
                                )}
                            </div>
                            {bracketTournamentId ? (
                                <BracketViewer tournamentId={bracketTournamentId} adminView={true} />
                            ) : (
                                <p style={{ color: "#94a3b8", textAlign: "center", padding: "40px" }}>Select a tournament to view brackets.</p>
                            )}
                            {bracketMsg && <p style={{ color: "#00e5ff", textAlign: "center", marginTop: "10px" }}>{bracketMsg}</p>}
                        </div>
                    </div>
                )}

                {activeSection === "players" && (
                    <div className="admin-box">
                        <div className="top">
                            <div className="circle"><img src="/images/iconos/players.png" className="icono" /></div>
                            <h2>Players Control | Players List</h2>
                        </div>
                        <PlayerList players={players} loading={loadingPlayers} error={errorPlayers} />
                    </div>
                )}

                {activeSection === "statistics" && (
                    <div className="admin-box">
                        <div className="top">
                            <div className="circle"><img src="/images/iconos/statistics.png" className="icono" /></div>
                            <h2>Advanced Statistics</h2>
                        </div>
                        <div className="admin-container" style={{ flexDirection: "column", gap: "24px" }}>
                            <div className="box-tournaments" style={{ width: "100%" }}>
                                <h2>System Overview</h2>
                                <div style={{ height: "300px" }}>
                                    <Bar data={chartData} options={chartOptions} />
                                </div>
                            </div>
                            <div className="box-tournaments" style={{ width: "100%" }}>
                                <h2>Tournaments per Game</h2>
                                <div style={{ height: "250px" }}>
                                    <Bar data={gameChartData} options={chartOptions} />
                                </div>
                            </div>

                            {loadingStats && <p style={{ color: "#94a3b8", textAlign: "center" }}>Loading advanced stats...</p>}
                            {advStats && (
                                <>
                                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "16px", width: "100%" }}>
                                        <div style={{ background: "#222a40", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
                                            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#00e5ff" }}>{advStats.tournaments.total}</div>
                                            <div style={{ color: "#94a3b8", fontSize: "13px" }}>Total Tournaments</div>
                                            <div style={{ fontSize: "12px", marginTop: "4px" }}>
                                                <span style={{ color: "#22c55e" }}>{advStats.tournaments.active} active</span>
                                                <span style={{ color: "#64748b" }}> / </span>
                                                <span style={{ color: "#f59e0b" }}>{advStats.tournaments.pending} pending</span>
                                                <span style={{ color: "#64748b" }}> / </span>
                                                <span style={{ color: "#a855f7" }}>{advStats.tournaments.finished} finished</span>
                                            </div>
                                        </div>
                                        <div style={{ background: "#222a40", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
                                            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#22c55e" }}>{advStats.users.total}</div>
                                            <div style={{ color: "#94a3b8", fontSize: "13px" }}>Total Users</div>
                                            <div style={{ fontSize: "12px", marginTop: "4px" }}>
                                                <span style={{ color: "#00e5ff" }}>{advStats.users.admins} admins</span>
                                                <span style={{ color: "#64748b" }}> / </span>
                                                <span style={{ color: "#a855f7" }}>{advStats.users.players} players</span>
                                            </div>
                                        </div>
                                        <div style={{ background: "#222a40", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
                                            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#a855f7" }}>{advStats.matches.total}</div>
                                            <div style={{ color: "#94a3b8", fontSize: "13px" }}>Total Matches</div>
                                            <div style={{ fontSize: "12px", marginTop: "4px" }}>
                                                <span style={{ color: "#22c55e" }}>{advStats.matches.completed} done</span>
                                                <span style={{ color: "#64748b" }}> / </span>
                                                <span style={{ color: "#f59e0b" }}>{advStats.matches.pending} pending</span>
                                            </div>
                                        </div>
                                        <div style={{ background: "#222a40", borderRadius: "12px", padding: "20px", textAlign: "center" }}>
                                            <div style={{ fontSize: "32px", fontWeight: "bold", color: "#f59e0b" }}>{advStats.registrations}</div>
                                            <div style={{ color: "#94a3b8", fontSize: "13px" }}>Registrations</div>
                                        </div>
                                    </div>

                                    {advStats.activity_by_day?.length > 0 && (
                                        <div className="box-tournaments" style={{ width: "100%" }}>
                                            <h2>Activity (Last 30 Days)</h2>
                                            <div style={{ height: "250px" }}>
                                                <Line data={lineChartData} options={{
                                                    ...chartOptions,
                                                    plugins: { ...chartOptions.plugins, legend: { display: true, labels: { color: "#00e5ff" } } }
                                                }} />
                                            </div>
                                        </div>
                                    )}

                                    {advStats.games_popularity?.length > 0 && (
                                        <div className="box-tournaments" style={{ width: "100%" }}>
                                            <h2>Game Popularity</h2>
                                            <div style={{ height: "250px" }}>
                                                <Bar data={gamePopData} options={chartOptions} />
                                            </div>
                                        </div>
                                    )}

                                    {advStats.top_players?.length > 0 && (
                                        <div className="box-tournaments" style={{ width: "100%" }}>
                                            <h2>Top 10 Players (by wins)</h2>
                                            <div className="box-tournaments-content">
                                                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                                    <thead>
                                                        <tr style={{ borderBottom: "1px solid #334155" }}>
                                                            <th style={{ padding: "10px", textAlign: "left", color: "#00e5ff" }}>#</th>
                                                            <th style={{ padding: "10px", textAlign: "left", color: "#00e5ff" }}>Player</th>
                                                            <th style={{ padding: "10px", textAlign: "center", color: "#00e5ff" }}>Matches</th>
                                                            <th style={{ padding: "10px", textAlign: "center", color: "#00e5ff" }}>Wins</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {advStats.top_players.map((p, i) => (
                                                            <tr key={i} style={{ borderBottom: "1px solid #1e293b" }}>
                                                                <td style={{ padding: "10px", color: "#94a3b8" }}>{i + 1}</td>
                                                                <td style={{ padding: "10px" }}>
                                                                    <Link to={`/profile/${p.id}`} style={{ color: "#f1f5f9", textDecoration: "none", fontWeight: "bold" }}>
                                                                        {p.nickname}
                                                                    </Link>
                                                                </td>
                                                                <td style={{ padding: "10px", textAlign: "center", color: "#94a3b8" }}>{p.matches_played}</td>
                                                                <td style={{ padding: "10px", textAlign: "center", color: "#22c55e", fontWeight: "bold" }}>{p.wins}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}

                {activeSection === "admins" && (
                    <div className="admin-box">
                        <div className="top">
                            <div className="circle"><img src="/images/iconos/administrador.png" className="icono" /></div>
                            <h2>Admin Management</h2>
                        </div>
                        <div style={{ display: "flex", gap: 24, padding: "24px 32px", justifyContent: "center", alignItems: "stretch", flexWrap: "wrap" }}>
                            <div style={{ flex: "1 1 340px", maxWidth: 420, backgroundColor: "#222a40", borderRadius: 20, padding: "24px 28px", boxShadow: "5px 5px 15px rgba(0,0,0,0.4)" }}>
                                <h2 style={{ textAlign: "center", margin: "0 0 20px 0", color: "#00e5ff", fontSize: 22 }}>Create New Admin</h2>
                                <form onSubmit={handleCreateAdmin}>
                                    <input type="text" name="username" placeholder="Username" required value={newAdmin.username} onChange={handleAdminInputChange} />
                                    <input type="email" name="email" placeholder="Email" required value={newAdmin.email} onChange={handleAdminInputChange} />
                                    <input type="password" name="password" placeholder="Password (min 6 characters)" required value={newAdmin.password} onChange={handleAdminInputChange} />
                                    <button type="submit">Create Admin</button>
                                    {adminMessage && <p style={{ textAlign: "center", marginTop: 10, color: adminMessage.includes("success") || adminMessage.includes("demoted") ? "#22c55e" : "#ef4444" }}>{adminMessage}</p>}
                                </form>
                            </div>
                            <div style={{ flex: "1 1 340px", maxWidth: 500, backgroundColor: "#222a40", borderRadius: 20, padding: "24px 28px", boxShadow: "5px 5px 15px rgba(0,0,0,0.4)" }}>
                                <h2 style={{ textAlign: "center", margin: "0 0 20px 0", borderBottom: "2px solid #334155", paddingBottom: 12 }}>Current Admins ({admins.length})</h2>
                                <div style={{ maxHeight: 340, overflowY: "auto" }}>
                                    {loadingAdmins ? (<p style={{ textAlign: "center", color: "#94a3b8", padding: 20 }}>Loading...</p>)
                                        : admins.length === 0 ? (<p style={{ textAlign: "center", color: "#94a3b8", padding: 20 }}>No admins found</p>)
                                            : (<ul style={{ padding: 0, margin: 0 }}>
                                                {admins.map((admin) => (
                                                    <li key={admin.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", listStyle: "none", borderBottom: "1px solid #1e293b" }}>
                                                        <div>
                                                            <strong style={{ color: "#00e5ff", fontSize: 16 }}>{admin.username}</strong><br />
                                                            <small style={{ color: "#94a3b8" }}>{admin.email}</small>
                                                        </div>
                                                        <button onClick={() => handleDemoteAdmin(admin.id, admin.username)} style={{ backgroundColor: "#dc2626", padding: "6px 14px", fontSize: 13, whiteSpace: "nowrap", borderRadius: 6, border: "none", color: "white", cursor: "pointer", transition: "0.2s" }}
                                                            onMouseEnter={(e) => e.target.style.backgroundColor = "#ef4444"}
                                                            onMouseLeave={(e) => e.target.style.backgroundColor = "#dc2626"}>
                                                            Demote to User
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>)}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Admin;
