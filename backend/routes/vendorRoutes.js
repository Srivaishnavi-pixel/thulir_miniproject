const express = require("express");
const router = express.Router();
const Vendor = require("../models/Vendor");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

/* ================= STORAGE ================= */
const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        const regId = req.registrationId;
        const dir = path.join("uploads", regId);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        cb(null, dir);
    },

   filename: function (req, file, cb) {

    if (file.fieldname === "photo") {
        cb(null, "photo.jpg");
    } 
    else if (file.fieldname === "certificate") {
        cb(null, "certificate.jpg");
    } 
    else {
        cb(null, Date.now() + "-" + file.originalname);
    }

}
});

const upload = multer({ storage });

/* ================= REGISTER ================= */
router.post("/register", (req, res, next) => {

    req.registrationId = "FARM" + Date.now();
    next();

}, upload.fields([
    { name: "certificate" },
    { name: "photo" }
]), async (req, res) => {

    try {
        const { name, email, password, state, address, mobile } = req.body;

        if (!name || !email || !password) {
            return res.json({ message: "All fields required" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const vendor = new Vendor({
            registrationId: req.registrationId,
            name,
            email,
            password: hashedPassword,
            state,
            address,
            mobile,
            certificate: req.files?.certificate
                ? req.files["certificate"][0].filename
                : "",
            photo: req.files?.photo
                ? req.files["photo"][0].filename
                : ""
        });

        await vendor.save();

        res.json({
            message: "Vendor Registered Successfully",
            registrationId: req.registrationId
        });

    } catch (err) {
        console.error("REGISTER ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
});

/* ================= LOGIN ================= */
router.post("/login", async (req, res) => {

    try {
        const { email, password } = req.body;

        const vendor = await Vendor.findOne({ email });

        if (!vendor) {
            return res.json({ message: "Vendor not found" });
        }

        const isMatch = await bcrypt.compare(password, vendor.password);

        if (!isMatch) {
            return res.json({ message: "Wrong password" });
        }

        res.json({
            message: "Login Successful",
            name: vendor.name,
            id: vendor.registrationId
        });

    } catch (err) {
        console.error("LOGIN ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
});

/* ================= GET VENDOR IMAGES ================= */
router.get("/images/:id", (req, res) => {

    try {
        const dirPath = path.join(__dirname, "..", "uploads", req.params.id);

        if (!fs.existsSync(dirPath)) {
            return res.json({ photo: "", certificate: "" });
        }

        const files = fs.readdirSync(dirPath);

        let photo = "";
        let certificate = "";

        files.forEach(file => {
            if (file.includes("photo")) photo = file;
            if (file.includes("certificate")) certificate = file;
        });

        res.json({ photo, certificate });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching images" });
    }
});

/* ================= GET VENDOR BY ID (MOST IMPORTANT) ================= */
router.get("/:id", async (req, res) => {

    try {
        const vendor = await Vendor.findOne({
            registrationId: req.params.id
        });

        if (!vendor) {
            return res.status(404).json({ message: "Vendor not found" });
        }

        res.json(vendor);

    } catch (err) {
        console.error("FETCH ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;