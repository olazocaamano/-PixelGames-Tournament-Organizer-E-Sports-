const db = require('../db');
const logActivity = require('../utils/activityLogger');

// Get games
// Returns all games or only active ones depending on query parameter
exports.getGames = async (req, res) => {
    const active = req.query.active;

    let sql = "SELECT * FROM games";
    let values = [];

    if (active == 1 || active === "true") {
        sql += " WHERE is_active = ?";
        values.push(1);
    }

    try {
        const [results] = await db.query(sql, values);
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
};

exports.createGame = async (req, res) => {
    const { game_name, genre, publisher, release_date } = req.body;

    try {
        const [result] = await db.query(
            `INSERT INTO games (game_name, genre, publisher, release_date, is_active)
            VALUES (?, ?, ?, ?, 1)`,
            [game_name, genre, publisher, release_date]
        );

        const newGameId = result.insertId;

        await logActivity({
            user_id: req.user.id,
            game_id: newGameId,
            action_type: "NEW_GAME",
            description: `New game added: ${game_name}`
        });

        res.json({ message: "Game created successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
};