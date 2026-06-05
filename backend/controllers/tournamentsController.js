/*
    File: tournamentsController.js
    Description: Handles tournament CRUD operations, search optimization,
    and user registration with activity logging.
*/

const db = require("../db");
const logActivity = require("../utils/activityLogger");
const { getIO } = require("../utils/socketEmitter");

/*
    Get tournaments with optional filters
*/
exports.getTournaments = async (req, res) => {

    const { active, search = "", limit = 10, offset = 0 } = req.query;

    let sql = `
        SELECT t.id, t.name, t.prize_pool, t.start_date
        FROM tournaments t
        WHERE 1=1
    `;

    let values = [];

    // Filter active tournaments
    if (active == 1 || active === "true") {
        sql += " AND t.is_active = ?";
        values.push(1);
    }

    // Search by name
    if (search) {
        sql += " AND t.name LIKE ?";
        values.push(`%${search}%`);
    }

    // Pagination
    sql += " ORDER BY t.start_date DESC LIMIT ? OFFSET ?";
    values.push(parseInt(limit), parseInt(offset));

    try {

        const [results] = await db.query(sql, values);

        res.json(results);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Database error"
        });
    }
};

/*
    Create tournament
*/
exports.createTournament = async (req, res) => {

    const {
        name,
        game_id,
        prize_pool,
        start_date
    } = req.body;

    if (
        !name ||
        !game_id ||
        !prize_pool ||
        !start_date
    ) {
        return res.status(400).json({
            error: "All fields are required"
        });
    }

    try {

        const [result] = await db.query(
            `
            INSERT INTO tournaments
            (
                name,
                game_id,
                prize_pool,
                start_date,
                status_id,
                creator_id,
                is_active
            )
            VALUES (?, ?, ?, ?, 1, ?, 1)
            `,
            [
                name,
                game_id,
                prize_pool,
                start_date,
                req.user.id
            ]
        );

        const tournamentId = result.insertId;

        await logActivity({
            user_id: req.user.id,
            tournament_id: tournamentId,
            action_type: "NEW_TOURNAMENT",
            description: `New tournament created: ${name}`
        });

        const io = getIO();
        if (io) {
            io.emit('tournament:created', {
                id: tournamentId,
                name,
                game_id,
                prize_pool,
                start_date,
                status_id: 1,
                is_active: 1,
                creator_id: req.user.id
            });
        }

        res.json({
            message: "Tournament created successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Database error"
        });
    }
};

/*
    Update tournament
*/
exports.updateTournament = async (req, res) => {

    const { id } = req.params;

    const {
        name,
        game_id,
        prize_pool,
        start_date,
        status_id,
        is_active
    } = req.body;

    try {

        await db.query(
            `
            UPDATE tournaments
            SET
                name = ?,
                game_id = ?,
                prize_pool = ?,
                start_date = ?,
                status_id = ?,
                is_active = ?
            WHERE id = ?
            `,
            [
                name,
                game_id,
                prize_pool,
                start_date,
                status_id,
                is_active,
                id
            ]
        );

        await logActivity({
            user_id: req.user.id,
            tournament_id: id,
            action_type: "EDIT_TOURNAMENT",
            description: `Tournament updated: ${name}`
        });

        const io = getIO();
        if (io) {
            io.emit('tournament:updated', {
                id: Number(id),
                name,
                game_id,
                prize_pool,
                start_date,
                status_id,
                is_active
            });
        }

        res.json({
            message: "Tournament updated successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Database error"
        });
    }
};

/*
    Register user to tournament
*/
exports.registerTournament = async (req, res) => {

    const { user_id, tournament_id } = req.body;

    try {

        // Check duplicate registration
        const [existing] = await db.query(
            `
            SELECT id
            FROM registration
            WHERE user_id = ? AND tournament_id = ?
            `,
            [user_id, tournament_id]
        );

        if (existing.length > 0) {

            return res.status(400).json({
                error: "Already registered"
            });
        }

        // Validate tournament exists
        const [tournament] = await db.query(
            `
            SELECT name
            FROM tournaments
            WHERE id = ?
            `,
            [tournament_id]
        );

        if (tournament.length === 0) {

            return res.status(404).json({
                error: "Tournament not found"
            });
        }

        const tournamentName = tournament[0].name;

        // Insert registration
        await db.query(
            `
            INSERT INTO registration
            (
                user_id,
                tournament_id,
                registration_date
            )
            VALUES (?, ?, NOW())
            `,
            [user_id, tournament_id]
        );

        // Log activity
        await logActivity({
            user_id,
            tournament_id,
            action_type: "REGISTER_TOURNAMENT",
            description: `User registered for tournament ${tournamentName}`
        });

        const io = getIO();
        if (io) {
            io.to(`user:${user_id}`).emit('tournament:registered', {
                user_id,
                tournament_id,
                tournament_name: tournamentName
            });
        }

        res.json({
            message: "Registration successful"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Database error"
        });
    }
};

/*
    Get user's registered tournaments
*/
exports.getMyTournaments = async (req, res) => {

    const { user_id } = req.params;

    try {

        const [results] = await db.query(
            `
            SELECT t.id, t.name, t.prize_pool, t.start_date, t.status_id, t.is_active
            FROM registration r
            JOIN tournaments t ON r.tournament_id = t.id
            WHERE r.user_id = ?
            ORDER BY r.registration_date DESC
            `,
            [user_id]
        );

        res.json(results);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Database error"
        });
    }
};

/*
    Update tournament status
*/
exports.updateTournamentStatus = async (req, res) => {

    const { id } = req.params;

    const {
        status_id,
        is_active
    } = req.body;

    try {

        await db.query(
            `
            UPDATE tournaments
            SET
                status_id = ?,
                is_active = ?
            WHERE id = ?
            `,
            [
                status_id,
                is_active,
                id
            ]
        );

        const io = getIO();
        if (io) {
            io.emit('tournament:statusChanged', {
                id: Number(id),
                status_id,
                is_active
            });
        }

        res.json({
            message: "Tournament status updated"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            error: "Database error"
        });
    }
};