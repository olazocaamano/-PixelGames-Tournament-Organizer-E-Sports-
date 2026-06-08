const db = require("../db");

exports.getGlobalLeaderboard = async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
                u.id,
                u.nickname,
                u.username,
                COUNT(CASE WHEN m.winner_id = u.id THEN 1 END) AS wins,
                COUNT(CASE WHEN (m.player_1_id = u.id OR m.player_2_id = u.id) AND m.winner_id IS NOT NULL THEN 1 END) AS total_matches_played,
                ROUND(
                    COUNT(CASE WHEN m.winner_id = u.id THEN 1 END) /
                    NULLIF(COUNT(CASE WHEN (m.player_1_id = u.id OR m.player_2_id = u.id) AND m.winner_id IS NOT NULL THEN 1 END), 0) * 100,
                    1
                ) AS win_rate,
                (SELECT COUNT(*) FROM registration r WHERE r.user_id = u.id) AS tournaments_played
            FROM users u
            LEFT JOIN matches m ON (m.player_1_id = u.id OR m.player_2_id = u.id)
            WHERE u.role_id = 3
            GROUP BY u.id, u.nickname, u.username
            HAVING total_matches_played > 0
            ORDER BY wins DESC, win_rate DESC
            LIMIT 100
        `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

exports.getTournamentLeaderboard = async (req, res) => {
    const { tournamentId } = req.params;
    try {
        const [rows] = await db.query(`
            SELECT
                u.id,
                u.nickname,
                u.username,
                COUNT(CASE WHEN m.winner_id = u.id THEN 1 END) AS wins,
                COUNT(CASE WHEN (m.player_1_id = u.id OR m.player_2_id = u.id) AND m.winner_id IS NOT NULL THEN 1 END) AS total_matches,
                ROUND(
                    COUNT(CASE WHEN m.winner_id = u.id THEN 1 END) /
                    NULLIF(COUNT(CASE WHEN (m.player_1_id = u.id OR m.player_2_id = u.id) AND m.winner_id IS NOT NULL THEN 1 END), 0) * 100,
                    1
                ) AS win_rate
            FROM users u
            JOIN registration r ON r.user_id = u.id AND r.tournament_id = ?
            LEFT JOIN matches m ON (m.player_1_id = u.id OR m.player_2_id = u.id) AND m.tournament_id = ?
            WHERE u.role_id = 3
            GROUP BY u.id, u.nickname, u.username
            ORDER BY wins DESC, win_rate DESC
        `, [tournamentId, tournamentId]);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};
