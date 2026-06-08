const db = require("../db");
const logActivity = require("../utils/activityLogger");
const { getIO } = require("../utils/socketEmitter");

exports.getTournamentMatches = async (req, res) => {
    const { tournamentId } = req.params;
    try {
        const [matches] = await db.query(`
            SELECT m.id, m.tournament_id, m.round, m.winner_id,
                   p1.id AS player_1_id, p1.nickname AS player_1_nickname, p1.username AS player_1_username,
                   p2.id AS player_2_id, p2.nickname AS player_2_nickname, p2.username AS player_2_username,
                   w.nickname AS winner_nickname
            FROM matches m
            LEFT JOIN users p1 ON m.player_1_id = p1.id
            LEFT JOIN users p2 ON m.player_2_id = p2.id
            LEFT JOIN users w ON m.winner_id = w.id
            WHERE m.tournament_id = ?
            ORDER BY FIELD(m.round, 'Final', 'Semi-finals', 'Quarter-finals', 'Round 1', 'Round 2', 'Round 3'), m.id
        `, [tournamentId]);
        res.json(matches);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

exports.getPlayerMatches = async (req, res) => {
    const { userId } = req.params;
    try {
        const [matches] = await db.query(`
            SELECT m.id, m.tournament_id, m.round, m.winner_id,
                   t.name AS tournament_name,
                   p1.id AS player_1_id, p1.nickname AS player_1_nickname,
                   p2.id AS player_2_id, p2.nickname AS player_2_nickname,
                   w.nickname AS winner_nickname
            FROM matches m
            JOIN tournaments t ON m.tournament_id = t.id
            LEFT JOIN users p1 ON m.player_1_id = p1.id
            LEFT JOIN users p2 ON m.player_2_id = p2.id
            LEFT JOIN users w ON m.winner_id = w.id
            WHERE m.player_1_id = ? OR m.player_2_id = ?
            ORDER BY m.id DESC
        `, [userId, userId]);
        res.json(matches);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

exports.createMatch = async (req, res) => {
    const { tournament_id, player_1_id, player_2_id, round } = req.body;
    if (!tournament_id || !player_1_id || !player_2_id || !round) {
        return res.status(400).json({ error: "All fields are required" });
    }
    try {
        const [result] = await db.query(
            `INSERT INTO matches (tournament_id, player_1_id, player_2_id, round) VALUES (?, ?, ?, ?)`,
            [tournament_id, player_1_id, player_2_id, round]
        );

        const matchId = result.insertId;

        await logActivity({
            user_id: req.user.id,
            tournament_id,
            match_id: matchId,
            action_type: "CREATE_MATCH",
            description: `Match created in round ${round}`
        });

        const io = getIO();
        if (io) {
            io.to(`user:${player_1_id}`).emit('notification', {
                message: `You have a new match in tournament!`,
                type: 'match'
            });
            io.to(`user:${player_2_id}`).emit('notification', {
                message: `You have a new match in tournament!`,
                type: 'match'
            });
            io.emit('match:created', { tournament_id, match_id: matchId });
        }

        res.json({ message: "Match created", matchId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

exports.reportResult = async (req, res) => {
    const { id } = req.params;
    const { winner_id } = req.body;

    if (!winner_id) {
        return res.status(400).json({ error: "winner_id is required" });
    }

    try {
        const [match] = await db.query(`SELECT * FROM matches WHERE id = ?`, [id]);
        if (match.length === 0) {
            return res.status(404).json({ error: "Match not found" });
        }

        if (winner_id !== match[0].player_1_id && winner_id !== match[0].player_2_id) {
            return res.status(400).json({ error: "Winner must be one of the players" });
        }

        await db.query(`UPDATE matches SET winner_id = ? WHERE id = ?`, [winner_id, id]);

        const [tournament] = await db.query(
            `SELECT t.name, t.status_id FROM tournaments t JOIN matches m ON m.tournament_id = t.id WHERE m.id = ?`,
            [id]
        );

        const loserId = winner_id === match[0].player_1_id ? match[0].player_2_id : match[0].player_1_id;

        await logActivity({
            user_id: req.user.id || winner_id,
            tournament_id: match[0].tournament_id,
            match_id: id,
            action_type: "MATCH_RESULT",
            description: `Match result: player ${winner_id} won`
        });

        const io = getIO();
        if (io) {
            io.to(`user:${winner_id}`).emit('notification', {
                message: `You won your match in ${tournament[0].name}!`,
                type: 'win'
            });
            io.to(`user:${loserId}`).emit('notification', {
                message: `You lost your match in ${tournament[0].name}.`,
                type: 'loss'
            });
            io.emit('match:result', { tournament_id: match[0].tournament_id, match_id: id, winner_id });
        }

        res.json({ message: "Result recorded" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

exports.generateBrackets = async (req, res) => {
    const { tournamentId } = req.params;

    try {
        const [existing] = await db.query(`SELECT id FROM matches WHERE tournament_id = ? LIMIT 1`, [tournamentId]);
        if (existing.length > 0) {
            return res.status(400).json({ error: "Brackets already generated for this tournament" });
        }

        const [registrations] = await db.query(
            `SELECT r.user_id, u.nickname FROM registration r JOIN users u ON r.user_id = u.id WHERE r.tournament_id = ?`,
            [tournamentId]
        );

        if (registrations.length < 2) {
            return res.status(400).json({ error: "At least 2 players needed" });
        }

        const players = registrations.map(r => r.user_id).sort(() => Math.random() - 0.5);

        let round = "Round 1";
        let pairs = [];
        for (let i = 0; i < players.length; i += 2) {
            if (i + 1 < players.length) {
                pairs.push([players[i], players[i + 1]]);
            }
        }

        if (pairs.length === 0) {
            return res.status(400).json({ error: "Not enough players to form pairs" });
        }

        const roundNames = getRoundName(pairs.length);

        for (let i = 0; i < pairs.length; i++) {
            await db.query(
                `INSERT INTO matches (tournament_id, player_1_id, player_2_id, round) VALUES (?, ?, ?, ?)`,
                [tournamentId, pairs[i][0], pairs[i][1], roundNames]
            );

            const [p1] = await db.query(`SELECT nickname FROM users WHERE id = ?`, [pairs[i][0]]);
            const [p2] = await db.query(`SELECT nickname FROM users WHERE id = ?`, [pairs[i][1]]);

            const io = getIO();
            if (io) {
                io.to(`user:${pairs[i][0]}`).emit('notification', {
                    message: `Your match in the tournament is ready! You face ${p2[0].nickname}`,
                    type: 'match'
                });
                io.to(`user:${pairs[i][1]}`).emit('notification', {
                    message: `Your match in the tournament is ready! You face ${p1[0].nickname}`,
                    type: 'match'
                });
            }
        }

        await logActivity({
            user_id: req.user.id,
            tournament_id: tournamentId,
            action_type: "BRACKETS_GENERATED",
            description: `Brackets generated for tournament with ${pairs.length} matches`
        });

        const io = getIO();
        if (io) {
            io.emit('tournament:bracketsGenerated', { tournament_id: tournamentId });
        }

        res.json({ message: `Brackets generated with ${pairs.length} matches`, matchCount: pairs.length });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

function getRoundName(matchCount) {
    if (matchCount === 1) return "Final";
    if (matchCount === 2) return "Semi-finals";
    if (matchCount <= 4) return "Quarter-finals";
    return "Round 1";
}
