const express = require("express");
const pool = require("../config/db");
const path = require("path");
const router = express.Router();

router.get("/users-page", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/users.html"));
});

router.get("/users", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM users ORDER BY id DESC");
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Database error" });
    }
});

module.exports = router;
