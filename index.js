require("dotenv").config();
const express = require("express");
const app = express();
const uploadRoutes = require("./routes/uploadRoutes");
const userRoutes = require("./routes/userRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", uploadRoutes);
app.use("/", userRoutes); // pastikan ini di-mount

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
