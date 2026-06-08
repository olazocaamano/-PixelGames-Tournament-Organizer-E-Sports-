import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function Profile() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const currentUserId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await API.get(`/users/profile/${userId}`);
                setData(res.data);
            } catch (err) {
                console.error("Error fetching profile:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [userId]);

    if (loading) return <div className="window"><div className="profile-container" style={{ textAlign: "center", color: "#94a3b8" }}>Loading profile...</div></div>;
    if (!data) return <div className="window"><div className="profile-container" style={{ textAlign: "center", color: "#ef4444" }}>Player not found</div></div>;

    const { profile, stats, recent_matches } = data;

    return (
        <div className="window">
            <div className="profile-container">
                <button className="back-btn" onClick={() => navigate(-1)}>
                    ← Back
                </button>

                <div className="profile-card">
                    <div className="profile-header">
                        <div className="profile-avatar">
                            {(profile.nickname || "U")[0].toUpperCase()}
                        </div>
                        <div>
                            <h1 className="profile-name">{profile.nickname}</h1>
                            <p className="profile-username">@{profile.username}</p>
                            {String(currentUserId) === String(userId) && (
                                <span className="profile-you">This is you</span>
                            )}
                        </div>
                    </div>

                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-value green">{stats.wins}</div>
                            <div className="stat-label">Wins</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value red">{stats.losses}</div>
                            <div className="stat-label">Losses</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value cyan">{stats.win_rate}%</div>
                            <div className="stat-label">Win Rate</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value purple">{stats.total_matches}</div>
                            <div className="stat-label">Matches</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value amber">{stats.tournaments_played}</div>
                            <div className="stat-label">Tournaments</div>
                        </div>
                    </div>
                </div>

                <div className="section-card">
                    <h2 className="section-title">Recent Matches</h2>
                    {recent_matches.length === 0 ? (
                        <p style={{ color: "#64748b" }}>No matches played yet.</p>
                    ) : (
                        <div className="matches-list">
                            {recent_matches.map(m => (
                                <div key={m.id} className="match-item">
                                    <div>
                                        <strong className="match-players">
                                            <span style={{ color: String(m.winner_id) === String(userId) ? "#22c55e" : "#f1f5f9" }}>{m.player_1_nickname}</span>
                                            <span style={{ color: "#64748b", margin: "0 10px" }}>vs</span>
                                            <span style={{ color: m.winner_id && String(m.winner_id) !== String(userId) ? "#22c55e" : "#f1f5f9" }}>{m.player_2_nickname}</span>
                                        </strong>
                                        <span className="match-tournament">{m.tournament_name}</span>
                                    </div>
                                    <div className="match-result">
                                        <span className="match-round">{m.round}</span>
                                        {m.winner_id ? (
                                            <span className={`match-winner ${String(m.winner_id) === String(userId) ? "win" : "loss"}`}>
                                                {String(m.winner_id) === String(userId) ? "WIN" : "LOSS"}
                                            </span>
                                        ) : (
                                            <span className="match-winner pending">Pending</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;
