const db = require("../db");

exports.getNotifications = async (req, res) => {
    const { userId } = req.params;
    try {
        const [notifications] = await db.query(
            `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`,
            [userId]
        );
        const [[{ unread }]] = await db.query(
            `SELECT COUNT(*) AS unread FROM notifications WHERE user_id = ? AND is_read = 0`,
            [userId]
        );
        res.json({ notifications, unread });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

exports.markAsRead = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query(`UPDATE notifications SET is_read = 1 WHERE id = ?`, [id]);
        res.json({ message: "Marked as read" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};

exports.markAllAsRead = async (req, res) => {
    const { userId } = req.params;
    try {
        await db.query(`UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0`, [userId]);
        res.json({ message: "All marked as read" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Database error" });
    }
};
