import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import BracketViewer from "../components/BracketViewer";

function TournamentResults() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showBracket, setShowBracket] = useState(false);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await API.get(`/tournaments/${id}/results`);
                setData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [id]);

    if (loading) return <div className="window"><div className="results-container" style={{ textAlign: "center", color: "#94a3b8" }}>Loading results...</div></div>;
    if (!data) return <div className="window"><div className="results-container" style={{ textAlign: "center", color: "#ef4444" }}>Tournament not found</div></div>;

    const { tournament, standings, matches } = data;

    return (
        <div className="window">
            <div className="results-container">
                <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

                <div className="tournament-info">
                    <h1 className="tournament-name">{tournament.name}</h1>
                    <div className="tournament-meta">
                        <span>Game: <strong>{tournament.game_name}</strong></span>
                        <span>Status: <strong style={{ color: tournament.status_name === "Finished" ? "#22c55e" : "#f59e0b" }}>{tournament.status_name}</strong></span>
                        <span>Prize: <strong style={{ color: "#f59e0b" }}>${tournament.prize_pool}</strong></span>
                        <span>Start: <strong>{tournament.start_date?.slice(0, 10)}</strong></span>
                    </div>
                    <button className="bracket-toggle" onClick={() => setShowBracket(!showBracket)}>
                        {showBracket ? "Hide Brackets" : "View Brackets"}
                    </button>
                </div>

                {showBracket && (
                    <div className="section-card" style={{ marginBottom: "24px" }}>
                        <h2 className="section-title">Brackets</h2>
                        <BracketViewer tournamentId={id} adminView={false} />
                    </div>
                )}

                <div className="section-card" style={{ marginBottom: "24px" }}>
                    <h2 className="section-title">Standings</h2>
                    {standings.length === 0 ? (
                        <p style={{ color: "#64748b" }}>No standings yet.</p>
                    ) : (
                        <table className="standings-table">
                            <thead>
                                <tr>
                                    <th style={{ width: "50px" }}>#</th>
                                    <th>Player</th>
                                    <th style={{ textAlign: "center" }}>Wins</th>
                                    <th style={{ textAlign: "center" }}>Matches</th>
                                </tr>
                            </thead>
                            <tbody>
                                {standings.map((s, i) => (
                                    <tr key={s.id}>
                                        <td className="rank-number">#{i + 1}</td>
                                        <td>
                                            <Link to={`/profile/${s.id}`} className="player-link">{s.nickname}</Link>
                                        </td>
                                        <td style={{ textAlign: "center" }}><span className="wins-value">{s.wins}</span></td>
                                        <td style={{ textAlign: "center", color: "#f1f5f9" }}>{s.total_matches}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {matches.length > 0 && (
                    <div className="section-card">
                        <h2 className="section-title">All Matches</h2>
                        <div className="matches-list">
                            {matches.map(m => (
                                <div key={m.id} className="match-card">
                                    <div>
                                        <strong className="match-players-result" style={{ color: m.winner_id === m.player_1_id ? "#22c55e" : "#f1f5f9" }}>
                                            {m.p1_nick}
                                        </strong>
                                        <span className="match-vs">vs</span>
                                        <strong className="match-players-result" style={{ color: m.winner_id === m.player_2_id ? "#22c55e" : "#f1f5f9" }}>
                                            {m.p2_nick}
                                        </strong>
                                        <span className="match-round-label">{m.round}</span>
                                    </div>
                                    <div>
                                        {m.winner_id ? (
                                            <span style={{ color: "#22c55e", fontWeight: "bold", fontSize: "13px" }}>
                                                Winner: {m.winner_nick}
                                            </span>
                                        ) : (
                                            <span style={{ color: "#f59e0b", fontSize: "13px" }}>Pending</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TournamentResults;
