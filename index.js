require("dotenv").config();
const express = require("express");
const path = require("path");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, "views"))); // Menyajikan halaman HTML

// Routes
app.use("/api", uploadRoutes);

// Menjalankan server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
