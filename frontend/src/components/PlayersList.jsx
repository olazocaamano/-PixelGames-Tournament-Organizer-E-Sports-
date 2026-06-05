import React, { useState, useEffect } from "react";
import API from "../services/api";
import "../App.css";

const PlayersList = () => {
    const [players, setPlayers] = useState([]);
    const [totalPlayers, setTotalPlayers] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const limit = 20;

    const fetchPlayers = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await API.get(`/users/players?page=${page}&search=${encodeURIComponent(searchTerm)}`);

            setPlayers(res.data.players || []);
            setTotalPlayers(res.data.total || 0);
        } catch (err) {
            console.error("FULL ERROR:", err);
            setError(err.response?.data?.error || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlayers();
    }, [page]);

    const handleSearch = () => {
        setPage(1);
        fetchPlayers();
    };

    if (loading) {
        return <p className="loading-text">Accessing player database...</p>;
    }

    if (error) {
        return <p className="error-text">{error}</p>;
    }

    return (
        <div className="box-players-container">
            <div className="players-search-bar">
                <input
                    type="text"
                    placeholder="Search player by nickname..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSearch();
                        }
                    }}
                />
                <button
                    className="btn-search"
                    onClick={handleSearch}
                >
                    SEARCH
                </button>
                <span className="player-count">
                    Players: {players.length} of {totalPlayers}
                </span>
            </div>

            <div className="players-grid">
                {players.length === 0 ? (
                    <p className="no-results">
                        No players found (Role 3).
                    </p>
                ) : (
                    <table className="pixel-table">
                        <thead>
                            <tr>
                                <th>Status</th>
                                <th>Identity</th>
                                <th>Email</th>
                                <th className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {players.map((player) => (
                                <tr key={player.id} className="grid-row">
                                    <td className="col-status">
                                        <div
                                            className={`status-indicator ${Number(player.is_active) === 1
                                                    ? "active"
                                                    : "inactive"
                                                }`}
                                        />
                                    </td>
                                    <td className="col-identity">
                                        <div className="player-identity-block">
                                            <strong className="nickname-accent">
                                                {player.nickname || player.username}
                                            </strong>
                                            <span className="username-sub">
                                                @{player.username}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="col-contact">
                                        {player.email}
                                    </td>
                                    <td className="col-actions text-center">
                                        <div className="action-buttons-group">
                                            <button
                                                className="btn-manage"
                                                onClick={() =>
                                                    console.log("Manage ID:", player.id)
                                                }
                                            >
                                                MANAGE
                                            </button>
                                            <button
                                                className="btn-logs"
                                                onClick={() =>
                                                    console.log("View logs for ID:", player.id)
                                                }
                                            >
                                                LOGS
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="bar-bottom">
                <div className="pagination">
                    <button
                        onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                    >
                        Prev
                    </button>
                    <span className="page-indicator">
                        Page {page}
                    </span>
                    <button
                        onClick={() => setPage(prev => prev + 1)}
                        disabled={players.length < limit}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlayersList;
