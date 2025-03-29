const express = require("express");
const multer = require("multer");
const s3 = require("../config/awsConfig");
const path = require("path");
const router = express.Router();

const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

// Konfigurasi Multer (menyimpan file ke memori sebelum diupload ke S3)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route untuk menampilkan halaman index.html
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../views/index.html"));
});

// Upload file ke S3
router.post("/upload", upload.single("image"), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const fileName = `${Date.now()}-${req.file.originalname}`;
    const params = {
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        ACL: "public-read",
    };

    try {
        const uploadResult = await s3.upload(params).promise();
        res.json({ message: "Upload successful", url: uploadResult.Location });
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Upload failed" });
    }
});

// Ambil semua gambar di S3
router.get("/images", async (req, res) => {
    try {
        const params = { Bucket: BUCKET_NAME };
        const { Contents } = await s3.listObjectsV2(params).promise();

        const images = Contents.map(item => ({
            url: `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`,
        }));

        res.json(images);
    } catch (error) {
        console.error("Error fetching images:", error);
        res.status(500).json({ error: "Failed to fetch images" });
    }
});

module.exports = router;
