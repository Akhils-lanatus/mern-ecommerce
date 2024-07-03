const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const app = express();
const productRoutes = require("./routes/products");
const PORT = 8080;

//Multer Setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/products", productRoutes(upload));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
