const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ important for form data

/* ================= CONNECT DB ================= */
connectDB();

/* ================= STATIC FOLDER ================= */
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static("uploads"));



/* ================= ROUTES ================= */
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/vendors", require("./routes/vendorRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/location", require("./routes/locationRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));


/* ================= SERVER ================= */
app.listen(5000, () => {
    console.log("Server running on port 5000");
});