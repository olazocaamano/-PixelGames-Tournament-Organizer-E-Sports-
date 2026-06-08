/*
    File: Admin.jsx
    Description: Admin dashboard for managing tournaments, players, and system statistics.
    Includes creation, editing, and monitoring of tournaments and users.
 */

import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import "../App.css";

// Services (API communication)
import { getTournaments, createTournament, updateTournament } from "../services/tournamentService";
import API from "../services/api";

// Components
import TournamentList from "../components/TournamentList";
import ActivityList from "../components/ActivityList";
import PlayerList from "../components/PlayersList";
import Modal from "../components/Modal";
import CreateTournament from "../components/CreateTournament";

// Utils
import formatDate from "../utils/formatDate";

// Graphics
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
} from "chart.js";

import socket, { connectSocket, disconnectSocket } from "../services/socket";

ChartJS.register(
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
);

function Admin() {
    const navigate = useNavigate();

    // Get user role from local storage
    const role = localStorage.getItem("role");

    // Controls which section is displayed in the admin panel
    const [activeSection, setActiveSection] = useState("home");

    // Tournament state
    const [tournaments, setTournaments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Activity state
    const [activities, setActivities] = useState([]);
    const [loadinga, setLoadinga] = useState(true);
    const [errora, setErrora] = useState(null);

    // Players state
    const [players, setPlayers] = useState([]);
    const [loadingPlayers, setLoadingPlayers] = useState(true);
    const [errorPlayers, setErrorPlayers] = useState(null);

    // Games state
    const [games, setGames] = useState([]);

    // Search
    const [searchTerm, setSearchTerm] = useState("");

    // Admin management state
    const [newAdmin, setNewAdmin] = useState({ username: "", email: "", password: "" });
    const [adminMessage, setAdminMessage] = useState("");
    const [admins, setAdmins] = useState([]);
    const [loadingAdmins, setLoadingAdmins] = useState(false);

    /*
        Load players from API on component mount
     */
    useEffect(() => {
        const fetchPlayers = async () => {
            try {
                const response = await API.get("/users");
                setPlayers(response.data);
            } catch {
                setErrorPlayers("Failed to load players");
            } finally {
                setLoadingPlayers(false);
            }
        };

        fetchPlayers();
    }, []);

    // Modal & form state
    const [showModal, setShowModal] = useState(false);
    const [editTournament, setEditTournament] = useState(null);

    // Form data for creating a new tournament
    const [newTournament, setNewTournament] = useState({
        name: "",
        game_id: "",
        prize_pool: "",
        start_date: "",
        status: ""
    });

    const [createMessage, setCreateMessage] = useState("");



    /*
        Redirect non-admin users to home
     */
    useEffect(() => {
        if (role !== "admin") {
            navigate("/");
        }
    }, [role, navigate]);

    /*
        Logout user and clear session data
     */
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        localStorage.removeItem("user");
        navigate("/");
    };

    /*
        Handle input changes for create tournament form
     */
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Fields that must be stored as numbers
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
        } catch (err) {
            console.error(err);
        }
    };

    const fetchTournaments = useCallback(async () => {
        try {
            const response = await getTournaments({ limit: 1000 });
            setTournaments(response.data);
        } catch {
            setError("Failed to load tournaments :(");
        } finally {
            setLoading(false);
        }
    }, []);

    /*
        Load tournaments on component mount
     */
    useEffect(() => {
        fetchTournaments();
    }, [fetchTournaments]);

    /*
        Load recent activity feed
     */
    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await API.get("/activity");
                setActivities(response.data);
            } catch {
                setErrora("Failed to load activities :(");
            } finally {
                setLoadinga(false);
            }
        };

        fetchActivities();
    }, []);

    /*
        Load games for dropdown
     */
    useEffect(() => {
        const fetchGames = async () => {
            try {
                const response = await API.get("/games", { params: { active: true } });
                setGames(response.data);
            } catch (err) {
                console.error("Failed to load games", err);
            }
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
        } catch {
            setAdmins([]);
        } finally {
            setLoadingAdmins(false);
        }
    }, []);

    useEffect(() => {
        if (activeSection === "admins") {
            fetchAdmins();
        }
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

    /*
        Socket connection for real-time updates
     */
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            connectSocket(userId);
        }

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

    // ==========================
    // STATISTICS CALCULATIONS
    // ==========================

    // Total tournaments
    const totalTournaments = tournaments.length;

    // Active tournaments
    const activeTournaments = tournaments.filter(t => t.is_active === 1).length;

    // Finished tournaments (status = 2 por ejemplo)
    const finishedTournaments = tournaments.filter(t => t.status === 2).length;

    // Total players
    const totalPlayers = players.length;

    // Average prize pool
    const avgPrize =
        tournaments.length > 0
            ? Math.round(
                tournaments.reduce((sum, t) => sum + Number(t.prize_pool || 0), 0) /
                tournaments.length
            )
            : 0;

    /*
    Chart configuration for statistics
    Displays number of tournaments vs players
*/

    const chartData = {
        labels: [
            "Total Tournaments",
            "Active",
            "Finished",
            "Players",
            "Avg Prize"
        ],
        datasets: [
            {
                label: "Platform Statistics",
                data: [
                    totalTournaments,
                    activeTournaments,
                    finishedTournaments,
                    totalPlayers,
                    avgPrize
                ],
                borderWidth: 2,
                borderRadius: 8
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                display: true,
                labels: {
                    color: "#12fb50",
                    font: {
                        size: 14
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.label}: ${context.raw}`;
                    }
                }
            }
        },

        scales: {
            x: {
                ticks: {
                    color: "#12fb50"
                },
                grid: {
                    display: false
                }
            },
            y: {
                ticks: {
                    color: "#12fb41",
                    precision: 0
                },
                grid: {
                    color: "rgba(255,255,255,0.05)"
                }
            }
        },

        animation: {
            duration: 1000,
            easing: "easeOutQuart"
        }
    };

    const tournamentsByGame = {};

    tournaments.forEach(t => {
        const game = t.game_name || "Unknown";
        tournamentsByGame[game] = (tournamentsByGame[game] || 0) + 1;
    });

    const gameChartData = {
        labels: Object.keys(tournamentsByGame),
        datasets: [
            {
                label: "Tournaments per Game",
                data: Object.values(tournamentsByGame),
                borderWidth: 2
            }
        ]
    };

    const filteredTournaments = tournaments.filter((t) =>
        t.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditFieldChange = (e) => {
        const { name, value } = e.target;
        setEditTournament((prev) => ({
            ...prev,
            [name]: ["game_id", "prize_pool", "status_id", "status", "is_active"].includes(name)
                ? Number(value)
                : value
        }));
    };

    return (
        <div className="window-admin">

            {/* Sidebar navigation */}
            <div className="bar">
                <div className="left">
                    <div className="circle">
                        <img src="/images/iconos/administrador.png" alt="logo" />
                    </div>
                    <h1>Administrator</h1>
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

                    <li>
                        <button
                            className={activeSection === "players" ? "active" : ""}
                            onClick={() => setActiveSection("players")}
                        >
                            Players
                        </button>
                    </li>

                    <li>
                        <button
                            className={activeSection === "statistics" ? "active" : ""}
                            onClick={() => setActiveSection("statistics")}
                        >
                            Statistics
                        </button>
                    </li>

                    <li>
                        <button
                            className={activeSection === "admins" ? "active" : ""}
                            onClick={() => setActiveSection("admins")}
                        >
                            Admins
                        </button>
                    </li>

                    {/* Logout button */}
                    <button onClick={handleLogout} className="logout">
                        Logout
                    </button>
                </ul>
            </div>

            {/* Main content area */}
            <div className="content">

                {/* HOME SECTION */}
                {activeSection === "home" && (
                    <div className="admin-box">
                        <div className="top">
                            <div className="circle">
                                <img src="/images/iconos/general_summary.png" className="icono" />
                            </div>
                            <h2>General Summary</h2>
                        </div>

                        {/* Overview of tournaments and activity */}
                        <div className="admin-container">
                            <div className="box-tournaments">
                                <h2>Active Tournaments</h2>
                                <TournamentList
                                    tournaments={tournaments}
                                    loading={loading}
                                    error={error}
                                />
                            </div>

                            <div className="box-activity">
                                <h2>Recent Activity</h2>
                                <ActivityList
                                    activities={activities}
                                    loading={loadinga}
                                    error={errora}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* TOURNAMENT SECTION */}
                {activeSection === "tournaments" && (
                    <div className="admin-box">
                        <div className="top">
                            <div className="circle">
                                <img src="./images/iconos/tournament.png" alt="tournament" />
                            </div>
                            <h2>Tournament Control</h2>
                        </div>

                        {/* Tournament management panel */}
                        <div className="admin-container" style={{ flexDirection: "column" }}>

                            <div style={{ display: "flex", gap: "15px", width: "100%", padding: "0 10px" }}>
                                <input
                                    type="text"
                                    placeholder="Search tournaments by name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ flex: 1, fontSize: "18px", padding: "12px" }}
                                />
                                <button onClick={() => setShowModal(true)} style={{ width: "200px" }}>
                                    Create Tournament
                                </button>
                            </div>

                            <div className="box-tournaments" style={{ width: "100%", height: "400px" }}>
                                <h2>All Tournaments ({filteredTournaments.length})</h2>

                                <TournamentList
                                    tournaments={filteredTournaments}
                                    loading={loading}
                                    error={error}
                                    onEdit={(tournament) =>
                                        setEditTournament({
                                            ...tournament,
                                            status_id: Number(tournament.status_id || tournament.status),
                                            is_active: Number(tournament.is_active),
                                            start_date: formatDate(tournament.start_date)
                                        })
                                    }
                                />
                            </div>
                        </div>

                        {/* Create tournament modal */}
                        {showModal && (
                            <Modal onClose={() => setShowModal(false)}>
                                <CreateTournament
                                    formData={newTournament}
                                    onChange={handleChange}
                                    onSubmit={handleCreateTournament}
                                />
                                <p>{createMessage}</p>
                            </Modal>
                        )}

                        {/* Edit tournament modal */}
                        {editTournament && (
                            <Modal onClose={() => setEditTournament(null)}>
                                <h2>Edit Tournament</h2>
                                <form onSubmit={handleUpdateTournament}>

                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Tournament Name"
                                        value={editTournament.name || ""}
                                        onChange={handleEditFieldChange}
                                        required
                                    />

                                    <select
                                        name="game_id"
                                        value={editTournament.game_id || ""}
                                        onChange={handleEditFieldChange}
                                        required
                                    >
                                        <option value="">Select Game</option>
                                        {games.map((g) => (
                                            <option key={g.id} value={g.id}>
                                                {g.game_name}
                                            </option>
                                        ))}
                                    </select>

                                    <input
                                        type="number"
                                        name="prize_pool"
                                        placeholder="Prize Pool"
                                        value={editTournament.prize_pool || ""}
                                        onChange={handleEditFieldChange}
                                    />

                                    <input
                                        type="datetime-local"
                                        name="start_date"
                                        value={editTournament.start_date || ""}
                                        onChange={handleEditFieldChange}
                                        required
                                    />

                                    <label style={{ color: "#ccc" }}>Status:</label>
                                    <select
                                        name="status_id"
                                        value={editTournament.status_id || 1}
                                        onChange={handleEditFieldChange}
                                    >
                                        <option value={1}>Pending</option>
                                        <option value={2}>Active</option>
                                        <option value={3}>Finished</option>
                                    </select>

                                    <label style={{ color: "#ccc" }}>Active:</label>
                                    <select
                                        name="is_active"
                                        value={editTournament.is_active || 0}
                                        onChange={handleEditFieldChange}
                                    >
                                        <option value={1}>Yes</option>
                                        <option value={0}>No</option>
                                    </select>

                                    <button type="submit">Save Changes</button>
                                </form>
                            </Modal>
                        )}
                    </div>
                )}

                {/* PLAYERS SECTION */}
                {activeSection === "players" && (
                    <div className="admin-box">
                        <div className="top">
                            <div className="circle">
                                <img src="/images/iconos/players.png" className="icono" />
                            </div>
                            <h2>Players Control | Players List</h2>
                        </div>


                        <PlayerList
                            players={players}
                            loading={loadingPlayers}
                            error={errorPlayers}
                        />
                    </div>
                )}

                {activeSection === "statistics" && (
                    <div className="admin-box">
                        <div className="top">
                            <div className="circle">
                                <img src="/images/iconos/statistics.png" className="icono" />
                            </div>
                            <h2>Statistics</h2>
                        </div>

                        <div className="admin-container">
                            <div className="box-tournaments" style={{ width: "100%" }}>
                                <h2>System Overview</h2>

                                {/* Bar chart showing tournaments vs players */}
                                <div style={{ height: "350px" }}>
                                    <Bar data={chartData} options={chartOptions} />
                                    <Bar data={gameChartData} options={chartOptions} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === "admins" && (
                    <div className="admin-box">
                        <div className="top">
                            <div className="circle">
                                <img src="/images/iconos/administrador.png" className="icono" />
                            </div>
                            <h2>Admin Management</h2>
                        </div>

                        <div style={{
                            display: "flex",
                            gap: 24,
                            padding: "24px 32px",
                            justifyContent: "center",
                            alignItems: "stretch",
                            flexWrap: "wrap",
                        }}>
                            {/* Create admin form */}
                            <div style={{
                                flex: "1 1 340px",
                                maxWidth: 420,
                                backgroundColor: "#222a40",
                                borderRadius: 20,
                                padding: "24px 28px",
                                boxShadow: "5px 5px 15px rgba(0,0,0,0.4)",
                            }}>
                                <h2 style={{ textAlign: "center", margin: "0 0 20px 0", color: "#00e5ff", fontSize: 22 }}>
                                    Create New Admin
                                </h2>
                                <form onSubmit={handleCreateAdmin}>
                                    <input
                                        type="text"
                                        name="username"
                                        placeholder="Username"
                                        required
                                        value={newAdmin.username}
                                        onChange={handleAdminInputChange}
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Email"
                                        required
                                        value={newAdmin.email}
                                        onChange={handleAdminInputChange}
                                    />
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Password (min 6 characters)"
                                        required
                                        value={newAdmin.password}
                                        onChange={handleAdminInputChange}
                                    />
                                    <button type="submit">Create Admin</button>
                                    {adminMessage && (
                                        <p style={{
                                            textAlign: "center",
                                            marginTop: 10,
                                            color: adminMessage.includes("success") || adminMessage.includes("demoted")
                                                ? "#22c55e" : "#ef4444"
                                        }}>
                                            {adminMessage}
                                        </p>
                                    )}
                                </form>
                            </div>

                            {/* Current admins list */}
                            <div style={{
                                flex: "1 1 340px",
                                maxWidth: 500,
                                backgroundColor: "#222a40",
                                borderRadius: 20,
                                padding: "24px 28px",
                                boxShadow: "5px 5px 15px rgba(0,0,0,0.4)",
                            }}>
                                <h2 style={{ textAlign: "center", margin: "0 0 20px 0", borderBottom: "2px solid #334155", paddingBottom: 12 }}>
                                    Current Admins ({admins.length})
                                </h2>
                                <div style={{ maxHeight: 340, overflowY: "auto" }}>
                                    {loadingAdmins ? (
                                        <p style={{ textAlign: "center", color: "#94a3b8", padding: 20 }}>Loading...</p>
                                    ) : admins.length === 0 ? (
                                        <p style={{ textAlign: "center", color: "#94a3b8", padding: 20 }}>No admins found</p>
                                    ) : (
                                        <ul style={{ padding: 0, margin: 0 }}>
                                            {admins.map((admin) => (
                                                <li key={admin.id} style={{
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    alignItems: "center",
                                                    padding: "14px 0",
                                                    listStyle: "none",
                                                    borderBottom: "1px solid #1e293b",
                                                }}>
                                                    <div>
                                                        <strong style={{ color: "#00e5ff", fontSize: 16 }}>{admin.username}</strong>
                                                        <br />
                                                        <small style={{ color: "#94a3b8" }}>{admin.email}</small>
                                                    </div>
                                                    <button
                                                        onClick={() => handleDemoteAdmin(admin.id, admin.username)}
                                                        style={{
                                                            backgroundColor: "#dc2626",
                                                            padding: "6px 14px",
                                                            fontSize: 13,
                                                            whiteSpace: "nowrap",
                                                            borderRadius: 6,
                                                            border: "none",
                                                            color: "white",
                                                            cursor: "pointer",
                                                            transition: "0.2s",
                                                        }}
                                                        onMouseEnter={(e) => e.target.style.backgroundColor = "#ef4444"}
                                                        onMouseLeave={(e) => e.target.style.backgroundColor = "#dc2626"}
                                                    >
                                                        Demote to User
                                                    </button>
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

export default Admin;