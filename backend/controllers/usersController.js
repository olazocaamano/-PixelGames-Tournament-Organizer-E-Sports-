const db = require('../db');
const logActivity = require("../utils/activityLogger");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../utils/emailService');

/* Get all users */
exports.getUsers = async (req, res) => {
    try {
        const [results] = await db.query(
            'SELECT id, username, email, role_id, is_active FROM users'
        );

        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

/* Forgot password - send reset email */
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const [users] = await db.query(
            'SELECT id, username FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.json({ message: 'If the email exists, a reset link has been sent.' });
        }

        const user = users[0];

        const [existing] = await db.query(
            'SELECT id FROM password_resets WHERE user_id = ? AND used_at IS NULL AND expires_at > NOW()',
            [user.id]
        );

        if (existing.length > 0) {
            await db.query('UPDATE password_resets SET used_at = NOW() WHERE user_id = ? AND used_at IS NULL', [user.id]);
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

        await db.query(
            'INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)',
            [user.id, token, expiresAt]
        );

        const result = await sendPasswordResetEmail(email, token);

        await logActivity({
            user_id: user.id,
            action_type: "PASSWORD_RESET_REQUESTED",
            description: `Password reset requested for user: ${user.username}`
        });

        res.json({
            message: 'If the email exists, a reset link has been sent.',
            ...(result.previewUrl ? { previewUrl: result.previewUrl } : {})
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

/* Reset password with token */
exports.resetPassword = async (req, res) => {
    const { token, password } = req.body;

    if (!token || !password) {
        return res.status(400).json({ error: 'Token and new password are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    try {
        const [tokens] = await db.query(
            'SELECT pr.user_id, u.username FROM password_resets pr INNER JOIN users u ON pr.user_id = u.id WHERE pr.token = ? AND pr.used_at IS NULL AND pr.expires_at > NOW()',
            [token]
        );

        if (tokens.length === 0) {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }

        const { user_id, username } = tokens[0];

        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, user_id]);

        await db.query('UPDATE password_resets SET used_at = NOW() WHERE token = ?', [token]);

        await logActivity({
            user_id,
            action_type: "PASSWORD_RESET_COMPLETED",
            description: `Password reset completed for user: ${username}`
        });

        res.json({ message: 'Password has been reset successfully.' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

/* Register new user */
exports.register = async (req, res) => {
    const { username, email, password, nickname } = req.body;

    // Default nickname if not provided
    const nicknameValue = nickname || username;

    try {
        // Validate required fields
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Check if user already exists
        const [existingUser] = await db.query(
            'SELECT id FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user (role_id = 3 = player)
        const [result] = await db.query(
            `
            INSERT INTO users (username, email, password, role_id, nickname, is_active)
            VALUES (?, ?, ?, 3, ?, 1)
            `,
            [username, email, hashedPassword, nicknameValue]
        );

        const newUserId = result.insertId;

        // Log registration activity
        await logActivity({
            user_id: newUserId,
            action_type: "NEW_USER",
            description: `New user registered: ${username}`
        });

        const token = jwt.sign(
            { id: newUserId, username, role_name: 'player' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        res.json({
            message: "User registered successfully",
            token,
            user: { id: newUserId, username, role_name: 'player' }
        });

    } catch (err) {
        // Handle duplicate entry error
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

/* Login user */
exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Get user with role information
        const [results] = await db.query(
            `SELECT 
                u.id, 
                u.username, 
                u.password,
                r.role_name 
            FROM users u
            INNER JOIN roles r ON u.role_id = r.id
            WHERE u.username = ?`,
            [username]
        );

        // Validate user exists
        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = results[0];

        // Compare password with hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role_name: user.role_name },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                role_name: user.role_name
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

/* Get player profile with stats */
exports.getPlayerProfile = async (req, res) => {
    const { userId } = req.params;
    try {
        const [users] = await db.query(
            `SELECT id, username, nickname, email, is_active FROM users WHERE id = ? AND role_id = 3`,
            [userId]
        );
        if (users.length === 0) {
            return res.status(404).json({ error: "Player not found" });
        }

        const [wins] = await db.query(
            `SELECT COUNT(*) AS total FROM matches WHERE winner_id = ?`,
            [userId]
        );

        const [losses] = await db.query(
            `SELECT COUNT(*) AS total FROM matches WHERE (player_1_id = ? OR player_2_id = ?) AND winner_id IS NOT NULL AND winner_id != ?`,
            [userId, userId, userId]
        );

        const [matches] = await db.query(
            `SELECT COUNT(*) AS total FROM matches WHERE (player_1_id = ? OR player_2_id = ?)`,
            [userId, userId]
        );

        const [tournaments] = await db.query(
            `SELECT COUNT(*) AS total FROM registration WHERE user_id = ?`,
            [userId]
        );

        const [recentMatches] = await db.query(`
            SELECT m.id, m.round, m.winner_id, t.name AS tournament_name,
                   p1.nickname AS player_1_nickname, p2.nickname AS player_2_nickname
            FROM matches m
            JOIN tournaments t ON m.tournament_id = t.id
            LEFT JOIN users p1 ON m.player_1_id = p1.id
            LEFT JOIN users p2 ON m.player_2_id = p2.id
            WHERE m.player_1_id = ? OR m.player_2_id = ?
            ORDER BY m.id DESC LIMIT 20
        `, [userId, userId]);

        const winRate = matches.total > 0
            ? Math.round((wins.total / matches.total) * 100)
            : 0;

        res.json({
            profile: users[0],
            stats: {
                wins: wins.total,
                losses: losses.total,
                total_matches: matches.total,
                win_rate: winRate,
                tournaments_played: tournaments.total
            },
            recent_matches: recentMatches
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

/* Create admin user (admin only) */
exports.createAdmin = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    try {
        const [existingUser] = await db.query(
            'SELECT id FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Username or email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const nicknameValue = username;

        const [result] = await db.query(
            `INSERT INTO users (username, email, password, role_id, nickname, is_active)
             VALUES (?, ?, ?, 1, ?, 1)`,
            [username, email, hashedPassword, nicknameValue]
        );

        const newUserId = result.insertId;

        await logActivity({
            user_id: newUserId,
            action_type: "NEW_ADMIN",
            description: `New admin created: ${username} by ${req.user.username}`
        });

        res.status(201).json({ message: 'Admin created successfully' });

    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'Username or email already exists' });
        }
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

/* Get admin users */
exports.getAdmins = async (req, res) => {
    try {
        const [results] = await db.query(
            'SELECT id, username, email, is_active FROM users WHERE role_id = 1'
        );
        res.json(results);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};

/* Demote admin to regular user */
exports.demoteAdmin = async (req, res) => {
    const { id } = req.params;

    try {
        const [users] = await db.query(
            'SELECT id, username, role_id FROM users WHERE id = ?',
            [id]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (users[0].role_id !== 1) {
            return res.status(400).json({ error: 'User is not an admin' });
        }

        if (Number(id) === Number(req.user.id)) {
            return res.status(400).json({ error: 'You cannot demote yourself' });
        }

        await db.query('UPDATE users SET role_id = 3 WHERE id = ?', [id]);

        await logActivity({
            user_id: id,
            action_type: "ADMIN_DEMOTED",
            description: `Admin ${users[0].username} demoted to user by ${req.user.username}`
        });

        res.json({ message: 'Admin demoted to user successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
};

/* Get players only */
exports.getPlayers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 50;
        const offset = (page - 1) * limit;

        const search = req.query.search || "";
        const searchTerm = `%${search}%`;

        // Get players (paginated)
        const dataQuery = `
            SELECT id, username, nickname, email, role_id, is_active
            FROM users
            WHERE role_id = 3
            AND (username LIKE ? OR nickname LIKE ?)
            LIMIT ? OFFSET ?
        `;

        const [players] = await db.query(dataQuery, [
            searchTerm,
            searchTerm,
            limit,
            offset
        ]);

        // Get total players
        const countQuery = `
            SELECT COUNT(*) AS total
            FROM users
            WHERE role_id = 3
            AND (username LIKE ? OR nickname LIKE ?)
        `;

        const [[{ total }]] = await db.query(countQuery, [
            searchTerm,
            searchTerm
        ]);

        // Complete answer
        res.json({
            players,
            total
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};