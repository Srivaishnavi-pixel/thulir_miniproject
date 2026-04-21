const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

/* ================= STORAGE ================= */
const storage = multer.diskStorage({

    destination: function (req, file, cb) {

        const vendorId = req.query.vendorId; // ✅ FIX

        if (!vendorId) {
            return cb(new Error("Vendor ID missing"), null);
        }

        const dir = path.join(__dirname, "..", "uploads", vendorId);

        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        cb(null, dir);
    },

    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const upload = multer({ storage });

/* ================= ADD PRODUCT ================= */
router.post("/add",

    upload.single("image"),

    async (req, res) => {

        try {

            console.log("BODY:", req.body);
            console.log("FILE:", req.file);

            const { name, price, quantity, category, vendorId } = req.body;

            if (!vendorId) {
                return res.json({ message: "Vendor ID missing" });
            }

            if (!req.file) {
                return res.json({ message: "Image not uploaded" });
            }

            // ✅ SAVE PRODUCT
            const product = new Product({
                name,
                price,
                quantity,
                category,
                vendorId,
                image: req.file.filename
            });

            await product.save();

            res.json({ message: "Product added successfully" });

        } catch (err) {
            console.error("ADD PRODUCT ERROR:", err);
            res.status(500).json({ message: "Failed to add product" });
        }
    }
);
/* ================= GET ALL PRODUCTS ================= */
router.get("/", async (req, res) => {

    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error fetching products" });
    }

});


/* ================= GET PRODUCT BY ID ================= */
router.get("/:id", async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.json(product);

    } catch (err) {
        console.error("GET PRODUCT ERROR:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;