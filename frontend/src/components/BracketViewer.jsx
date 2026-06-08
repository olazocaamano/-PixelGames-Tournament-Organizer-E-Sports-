import React, { useEffect, useState, useCallback } from "react";
import { getTournamentMatches } from "../services/matchService";
import socket from "../services/socket";

const roundOrder = ["Final", "Semi-finals", "Quarter-finals", "Round 1", "Round 2", "Round 3"];

function BracketViewer({ tournamentId, adminView, onResultReported }) {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reportingMatch, setReportingMatch] = useState(null);
    const [selectedWinner, setSelectedWinner] = useState("");

    const fetchMatches = useCallback(async () => {
        try {
            const res = await getTournamentMatches(tournamentId);
            setMatches(res.data);
        } catch (err) {
            console.error("Error fetching matches:", err);
        } finally {
            setLoading(false);
        }
    }, [tournamentId]);

    useEffect(() => {
        if (tournamentId) fetchMatches();
    }, [tournamentId, fetchMatches]);

    useEffect(() => {
        const onUpdate = () => fetchMatches();
        socket.on("match:created", onUpdate);
        socket.on("match:result", onUpdate);
        return () => {
            socket.off("match:created", onUpdate);
            socket.off("match:result", onUpdate);
        };
    }, [tournamentId, fetchMatches]);

    const grouped = {};
    matches.forEach(m => {
        const round = m.round || "Round 1";
        if (!grouped[round]) grouped[round] = [];
        grouped[round].push(m);
    });

    const sortedRounds = Object.keys(grouped).sort((a, b) => {
        return roundOrder.indexOf(a) - roundOrder.indexOf(b);
    });

    const handleReportResult = async () => {
        if (!selectedWinner || !reportingMatch) return;
        try {
            const { reportResult } = await import("../services/matchService");
            await reportResult(reportingMatch.id, Number(selectedWinner));
            setReportingMatch(null);
            setSelectedWinner("");
            fetchMatches();
            if (onResultReported) onResultReported();
        } catch (err) {
            console.error("Error reporting result:", err);
        }
    };

    if (loading) return <p style={{ color: "#94a3b8", textAlign: "center" }}>Loading brackets...</p>;
    if (matches.length === 0) return <p style={{ color: "#94a3b8", textAlign: "center" }}>No matches yet. Generate brackets to start.</p>;

    return (
        <div style={{ overflowX: "auto", padding: "20px 0" }}>
            <div style={{ display: "flex", gap: "40px", minWidth: "fit-content", justifyContent: "center" }}>
                {sortedRounds.map((round, roundIndex) => (
                    <div key={round} style={{ display: "flex", flexDirection: "column", gap: roundIndex === 0 ? "16px" : `${32 + roundIndex * 16}px`, minWidth: "220px" }}>
                        <h3 style={{ color: "#00e5ff", textAlign: "center", margin: "0 0 16px 0", fontSize: "14px", textTransform: "uppercase", letterSpacing: "2px" }}>{round}</h3>
                        {grouped[round].map((match) => (
                            <div key={match.id} style={{
                                background: "#1a2035",
                                border: "1px solid #334155",
                                borderRadius: "12px",
                                padding: "12px 16px",
                                minWidth: "200px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                                    <span style={{
                                        color: match.winner_id === match.player_1_id ? "#22c55e" : "#f1f5f9",
                                        fontWeight: match.winner_id === match.player_1_id ? "bold" : "normal",
                                        fontSize: "14px"
                                    }}>
                                        {match.player_1_nickname || "TBD"}
                                    </span>
                                    {match.winner_id === match.player_1_id && <span style={{ color: "#22c55e", fontSize: "12px" }}>WIN</span>}
                                </div>
                                <div style={{ textAlign: "center", color: "#64748b", fontSize: "12px", margin: "4px 0" }}>VS</div>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
                                    <span style={{
                                        color: match.winner_id === match.player_2_id ? "#22c55e" : "#f1f5f9",
                                        fontWeight: match.winner_id === match.player_2_id ? "bold" : "normal",
                                        fontSize: "14px"
                                    }}>
                                        {match.player_2_nickname || "TBD"}
                                    </span>
                                    {match.winner_id === match.player_2_id && <span style={{ color: "#22c55e", fontSize: "12px" }}>WIN</span>}
                                </div>
                                {adminView && !match.winner_id && (
                                    <div style={{ marginTop: "10px", borderTop: "1px solid #334155", paddingTop: "10px" }}>
                                        {reportingMatch?.id === match.id ? (
                                            <div style={{ display: "flex", gap: "6px", flexDirection: "column" }}>
                                                <select value={selectedWinner} onChange={(e) => setSelectedWinner(e.target.value)} style={{ padding: "6px", fontSize: "13px", borderRadius: "6px", border: "1px solid #334155", background: "#0b0f1a", color: "#f1f5f9" }}>
                                                    <option value="">Select winner</option>
                                                    <option value={match.player_1_id}>{match.player_1_nickname}</option>
                                                    <option value={match.player_2_id}>{match.player_2_nickname}</option>
                                                </select>
                                                <div style={{ display: "flex", gap: "6px" }}>
                                                    <button onClick={handleReportResult} style={{ padding: "4px 12px", fontSize: "12px", background: "#0891b2", flex: 1 }}>Submit</button>
                                                    <button onClick={() => { setReportingMatch(null); setSelectedWinner(""); }} style={{ padding: "4px 12px", fontSize: "12px", background: "#dc2626", flex: 1 }}>Cancel</button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button onClick={() => setReportingMatch(match)} style={{ width: "100%", padding: "6px", fontSize: "12px", background: "#222a40", color: "#00e5ff", border: "1px solid #0891b2" }}>
                                                Report Result
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default BracketViewer;
