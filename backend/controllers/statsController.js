const db = require("../db");

exports.getAdvancedStats = async (req, res) => {
    try {
        const [[tournamentStats]] = await db.query(`
            SELECT
                COUNT(*) AS total,
                SUM(CASE WHEN status_id = 1 THEN 1 ELSE 0 END) AS pending,
                SUM(CASE WHEN status_id = 2 THEN 1 ELSE 0 END) AS active,
                SUM(CASE WHEN status_id = 3 THEN 1 ELSE 0 END) AS finished
            FROM tournaments
        `);

        const [[userStats]] = await db.query(`
            SELECT
                COUNT(*) AS total,
                SUM(CASE WHEN role_id = 1 THEN 1 ELSE 0 END) AS admins,
                SUM(CASE WHEN role_id = 3 THEN 1 ELSE 0 END) AS players
            FROM users
        `);

        const [[matchStats]] = await db.query(`
            SELECT
                COUNT(*) AS total,
                SUM(CASE WHEN winner_id IS NOT NULL THEN 1 ELSE 0 END) AS completed,
                SUM(CASE WHEN winner_id IS NULL THEN 1 ELSE 0 END) AS pending
            FROM matches
        `);

        const [[regStats]] = await db.query(`SELECT COUNT(*) AS total FROM registration`);

        const [activityByDay] = await db.query(`
            SELECT DATE(created_at) AS date, COUNT(*) AS count
            FROM activity
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY DATE(created_at)
            ORDER BY date
        `);

        const [gamesPopularity] = await db.query(`
            SELECT g.game_name, COUNT(t.id) AS tournament_count
            FROM games g
            LEFT JOIN tournaments t ON g.id = t.game_id
            WHERE g.is_active = 1
            GROUP BY g.id, g.game_name
            ORDER BY tournament_count DESC
        `);

        const [topPlayers] = await db.query(`
            SELECT u.nickname, COUNT(m.id) AS matches_played,
                   COUNT(CASE WHEN m.winner_id = u.id THEN 1 END) AS wins
            FROM users u
            JOIN matches m ON m.player_1_id = u.id OR m.player_2_id = u.id
            WHERE u.role_id = 3
            GROUP BY u.id, u.nickname
            ORDER BY wins DESC
            LIMIT 10
        `);

        res.json({
            tournaments: tournamentStats,
            users: userStats,
            matches: matchStats,
            registrations: regStats.total,
            activity_by_day: activityByDay,
            games_popularity: gamesPopularity,
            top_players: topPlayers
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};
