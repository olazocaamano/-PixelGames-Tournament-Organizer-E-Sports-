import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getGlobalLeaderboard, getTournamentLeaderboard } from "../services/leaderboardService";
import { getTournaments } from "../services/tournamentService";

function Leaderboards() {
    const navigate = useNavigate();
    const [global, setGlobal] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tournamentLeaderboard, setTournamentLeaderboard] = useState([]);
    const [selectedTournament, setSelectedTournament] = useState("");
    const [tournaments, setTournaments] = useState([]);
    const [tab, setTab] = useState("global");

    useEffect(() => {
        const fetchGlobal = async () => {
            try {
                const res = await getGlobalLeaderboard();
                setGlobal(res.data);
            } catch (err) { console.error(err); }
            finally { setLoading(false); }
        };
        fetchGlobal();
    }, []);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const res = await getTournaments({ limit: 200 });
                setTournaments(res.data);
            } catch (err) { console.error(err); }
        };
        fetchTours();
    }, []);

    const handleTournamentSelect = async (e) => {
        const tid = e.target.value;
        setSelectedTournament(tid);
        if (tid) {
            try {
                const res = await getTournamentLeaderboard(tid);
                setTournamentLeaderboard(res.data);
            } catch (err) { console.error(err); }
        } else {
            setTournamentLeaderboard([]);
        }
    };

    return (
        <div className="window">
            <div className="leaderboard-container">
                <div className="leaderboard-header">
                    <h1 className="leaderboard-title">Leaderboards</h1>
                    <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
                </div>

                <div className="tab-bar">
                    <button className={`tab-btn ${tab === "global" ? "active" : "inactive"}`} onClick={() => setTab("global")}>
                        Global Rankings
                    </button>
                    <button className={`tab-btn ${tab === "tournament" ? "active" : "inactive"}`} onClick={() => setTab("tournament")}>
                        Per Tournament
                    </button>
                </div>

                {tab === "global" && (
                    <div className="section-card">
                        <h2 className="section-title">Global Rankings</h2>
                        {loading ? (
                            <p style={{ color: "#94a3b8" }}>Loading...</p>
                        ) : global.length === 0 ? (
                            <p style={{ color: "#64748b" }}>No ranked players yet. Play matches to appear!</p>
                        ) : (
                            <table className="leaderboard-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: "50px" }}>#</th>
                                        <th>Player</th>
                                        <th style={{ textAlign: "center" }}>Wins</th>
                                        <th style={{ textAlign: "center" }}>Matches</th>
                                        <th style={{ textAlign: "center" }}>Win Rate</th>
                                        <th style={{ textAlign: "center" }}>Tournaments</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {global.map((p, i) => (
                                        <tr key={p.id}>
                                            <td>
                                                {i < 3 ? (
                                                    <span className="rank-medal">{["🥇", "🥈", "🥉"][i]}</span>
                                                ) : (
                                                    <span className="rank-number">#{i + 1}</span>
                                                )}
                                            </td>
                                            <td>
                                                <Link to={`/profile/${p.id}`} className="player-link">
                                                    {p.nickname}
                                                </Link>
                                                <span className="player-sub">@{p.username}</span>
                                            </td>
                                            <td style={{ textAlign: "center" }}><span className="wins-value">{p.wins}</span></td>
                                            <td style={{ textAlign: "center", color: "#f1f5f9" }}>{p.total_matches_played}</td>
                                            <td style={{ textAlign: "center" }}>
                                                <span className={p.win_rate >= 50 ? "winrate-high" : "winrate-low"}>{p.win_rate || 0}%</span>
                                            </td>
                                            <td style={{ textAlign: "center", color: "#94a3b8" }}>{p.tournaments_played}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}

                {tab === "tournament" && (
                    <div className="section-card">
                        <h2 className="section-title">Tournament Rankings</h2>
                        <select value={selectedTournament} onChange={handleTournamentSelect} style={{ width: "100%", marginBottom: "20px" }}>
                            <option value="">Select a tournament...</option>
                            {tournaments.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>

                        {selectedTournament && tournamentLeaderboard.length === 0 && (
                            <p style={{ color: "#64748b" }}>No data for this tournament yet.</p>
                        )}
                        {tournamentLeaderboard.length > 0 && (
                            <table className="leaderboard-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: "50px" }}>#</th>
                                        <th>Player</th>
                                        <th style={{ textAlign: "center" }}>Wins</th>
                                        <th style={{ textAlign: "center" }}>Matches</th>
                                        <th style={{ textAlign: "center" }}>Win Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tournamentLeaderboard.map((p, i) => (
                                        <tr key={p.id}>
                                            <td><span className="rank-number">#{i + 1}</span></td>
                                            <td>
                                                <Link to={`/profile/${p.id}`} className="player-link">{p.nickname}</Link>
                                            </td>
                                            <td style={{ textAlign: "center" }}><span className="wins-value">{p.wins}</span></td>
                                            <td style={{ textAlign: "center", color: "#f1f5f9" }}>{p.total_matches}</td>
                                            <td style={{ textAlign: "center" }}>
                                                <span className={p.win_rate >= 50 ? "winrate-high" : "winrate-low"}>{p.win_rate || 0}%</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Leaderboards;
